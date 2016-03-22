---
layout: topics
title: REDIS pipelining -- Redis中文资料站
permalink: topics/pipelining.html
disqusIdentifier: topics_pipelining
disqusUrl: http://redis.cn/topics/pipelining.html
---

请求/响应协议和RTT
===

Redis是一种基于客户端-服务端模型以及请求/响应协议的TCP服务。

这意味着通常情况下一个请求会遵循以下步骤：

* 客户端向服务端发送一个查询请求，并监听Socket返回，通常是以阻塞模式，等待服务端响应。
* 服务端处理命令，并将结果返回给客户端。

因此，例如下面是4个命令序列执行情况：

 * *Client:* INCR X
 * *Server:* 1
 * *Client:* INCR X
 * *Server:* 2
 * *Client:* INCR X
 * *Server:* 3
 * *Client:* INCR X
 * *Server:* 4

客户端和服务器通过网络进行连接。这个连接可以很快（loopback接口）或很慢（建立了一个多次跳转的网络连接）。无论网络延如何延时，数据包总是能从客户端到达服务器，并从服务器返回数据回复客户端。

这个时间被称之为 RTT (Round Trip Time - 往返时间). 当客户端需要在一个批处理中执行多次请求时很容易看到这是如何影响性能的（例如添加许多元素到同一个list，或者用很多Keys填充数据库）。例如，如果RTT时间是250毫秒（在一个很慢的连接下），即使服务器每秒能处理100k的请求数，我们每秒最多也只能处理4个请求。

如果采用loopback接口，RTT就短得多（比如我的主机ping 127.0.0.1只需要44毫秒），但它任然是一笔很多的开销在一次批量写入操作中。

幸运的是有一种方法可以改善这种情况。

Redis 管道（Pipelining）
---

一次请求/响应服务器能实现处理新的请求即使旧的请求还未被响应。这样就可以将*多个命令*发送到服务器，而不用等待回复，最后在一个步骤中读取该答复。

这就是管道（pipelining），是一种几十年来广泛使用的技术。例如许多POP3协议已经实现支持这个功能，大大加快了从服务器下载新邮件的过程。

Redis很早就支持管道（pipelining）技术，因此无论你运行的是什么版本，你都可以使用管道（pipelining）操作Redis。下面是一个使用的例子：

    $ (printf "PING\r\nPING\r\nPING\r\n"; sleep 1) | nc localhost 6379
    +PONG
    +PONG
    +PONG

这一次我们没有为每个命令都花费了RTT开销，而是智勇了一个命令的开销时间。

非常明确的，用管道顺序操作的第一个例子如下：

 * *Client:* INCR X
 * *Client:* INCR X
 * *Client:* INCR X
 * *Client:* INCR X
 * *Server:* 1
 * *Server:* 2
 * *Server:* 3
 * *Server:* 4

**重要说明**: 使用管道发送命令是，服务器将被迫回复一个队列答复，占用很多内存。所以，如果你需要发送大量的命令，最好是把他们按照合理数量分批次的处理，例如10K的命令，读回复，然后再发送另一个10k的命令，等等。这样速度几乎是相同的，但是在回复这10k命令队列需要非常大量的内存用来组织返回数据内容。

一些测试
---

下面我们会使用Redis Ruby客户端进行一些使用管道和不使用管道的情况，测试管道技术对速度的提升效果：

    require 'rubygems'
    require 'redis'

    def bench(descr)
        start = Time.now
        yield
        puts "#{descr} #{Time.now-start} seconds"
    end

    def without_pipelining
        r = Redis.new
        10000.times {
            r.ping
        }
    end

    def with_pipelining
        r = Redis.new
        r.pipelined {
            10000.times {
                r.ping
            }
        }
    end

    bench("without pipelining") {
        without_pipelining
    }
    bench("with pipelining") {
        with_pipelining
    }

从处于局域网中的Mac OS X系统上执行上面这个简单脚本的数据表明，开启了管道操作后，往返时延已经被改善得相当低了：

    without pipelining 1.185238 seconds
    with pipelining 0.250783 seconds

如你所见，开启管道后，我们的速度效率提升了5倍。

管道（Pipelining） VS 脚本（Scripting）
---

Using [Redis scripting](/commands/eval.html) (available in Redis version 2.6 or greater) a number of use cases for pipelining can be addressed more efficiently using scripts that perform a lot of the work needed at the server side. A big advantage of scripting is that it is able to both read and write data with minimal latency, making operations like *read, compute, write* very fast (pipelining can't help in this scenario since the client needs the reply of the read command before it can call the write command).

Sometimes the application may also want to send `EVAL` or `EVALSHA` commands in a pipeline. This is entirely possible and Redis explicitly supports it with the [SCRIPT LOAD](/commands/script-load.html) command (it guarantees that `EVALSHA` can be called without the risk of failing).
