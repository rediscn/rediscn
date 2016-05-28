---
layout: topics
title: Redis大量数据插入（redis mass-insert）
permalink: topics/mass-insert.html
disqusIdentifier: topics_mass-insert
disqusUrl: http://redis.cn/topics/mass-insert.html
---

Redis 大量数据插入
===

有些时候，Redis实例需要装载大量用户在短时间内产生的数据，数以百万计的keys需要被快速的创建。

我们称之为*大量数据插入(mass insertion)*,本文档的目标就是提供如下信息：Redis如何尽可能快的处理数据。

使用Luke协议
----------------------

使用正常模式的Redis 客户端执行大量数据插入不是一个好主意：因为一个个的插入会有大量的时间浪费在每一个命令往返时间上。使用管道（pipelining）是一种可行的办法，但是在大量插入数据的同时又需要执行其他新命令时，这时读取数据的同时需要确保请可能快的的写入数据。

只有一小部分的客户端支持非阻塞输入/输出(non-blocking I/O),并且并不是所有客户端能以最大限度的提高吞吐量的高效的方式来分析答复。

例如，如果我们需要生成一个10亿的`keyN -> ValueN'的大数据集，我们会创建一个如下的redis命令集的文件：

    SET Key0 Value0
    SET Key1 Value1
    ...
    SET KeyN ValueN

一旦创建了这个文件，其余的就是让Redis尽可能快的执行。在以前我们会用如下的`netcat`命令执行：

    (cat data.txt; sleep 10) | nc localhost 6379 > /dev/null

然而这并不是一个非常可靠的方式，因为用netcat进行大规模插入时不能检查错误。从Redis 2.6开始`redis-cli`支持一种新的被称之为**pipe mode**的新模式用于执行大量数据插入工作。

使用**pipe mode**模式的执行命令如下：

    cat data.txt | redis-cli --pipe

这将产生类似如下的输出：

    All data transferred. Waiting for the last reply...
    Last reply received from server.
    errors: 0, replies: 1000000

使用redis-cli将有效的确保错误输出到Redis实例的标准输出里面。


生成Redis协议
-------------------------
它会非常简单的生成和解析Redis协议，Redis协议文档请参考[Redis协议说明](/topics/protocol.html)。
但是为了生成大量数据插入的目标，你需要了解每一个细节协议，每个命令会用如下方式表示：

    *<args><cr><lf>
    $<len><cr><lf>
    <arg0><cr><lf>
    <arg1><cr><lf>
    ...
    <argN><cr><lf>

这里的`<cr>`是"\r"（或者是ASCII的13）、`<lf>`是"\n"（或者是ASCII的10）。

例如：命令**SET key value**协议格式如下：

    *3<cr><lf>
    $3<cr><lf>
    SET<cr><lf>
    $3<cr><lf>
    key<cr><lf>
    $5<cr><lf>
    value<cr><lf>

或表示为引用字符串：

    "*3\r\n$3\r\nSET\r\n$3\r\nkey\r\n$5\r\nvalue\r\n"

你需要将大量插入数据的命令按照上面的方式一个接一个的生成到文件。

下面是使用Ruby生成协议的参考：

    def gen_redis_proto(*cmd)
        proto = ""
        proto << "*"+cmd.length.to_s+"\r\n"
        cmd.each{|arg|
            proto << "$"+arg.to_s.bytesize.to_s+"\r\n"
            proto << arg.to_s+"\r\n"
        }
        proto
    end

    puts gen_redis_proto("SET","mykey","Hello World!").inspect

针对上面的例子，使用下面代码可以很容易的生成需要的文件：

    (0...1000).each{|n|
        STDOUT.write(gen_redis_proto("SET","Key#{n}","Value#{n}"))
    }

我们可以直接用 redis-cli 的 pipe执行我们的第一个大量数据插入命令，过程如下：

    $ ruby proto.rb | redis-cli --pipe
    All data transferred. Waiting for the last reply...
    Last reply received from server.
    errors: 0, replies: 1000

pipe mode的工作原理是什么？
---------------------------------------

难点是保证redis-cli在pipe mode模式下执行和netcat一样快的同时，如何能理解服务器发送的最后一个回复。

这是通过以下方式获得：

+ redis-cli --pipe试着尽可能快的发送数据到服务器。
+ 读取数据的同时，解析它。
+ 一旦没有更多的数据输入，它就会发送一个特殊的**ECHO**命令，后面跟着20个随机的字符。我们相信可以通过匹配回复相同的20个字符是同一个命令的行为。
+ 一旦这个特殊命令发出，收到的答复就开始匹配这20个字符，当匹配时，就可以成功退出了。

同时，在分析回复的时候，我们会采用计数器的方法计数，以便在最后能够告诉我们大量插入数据的数据量。

