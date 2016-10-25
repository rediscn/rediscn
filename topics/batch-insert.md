---
layout: topics
title: Redis从文件中批量插入数据（redis batch-insert）
permalink: topics/batch-insert.html
disqusIdentifier: topics_batch-insert
disqusUrl: http://redis.cn/topics/batch-insert.html
discuzTid: 861
---

# Redis从文件中批量插入数据




##  简介

--------
在redis中，有时候需要批量执行某些命令，但是在redis的redis-cli下，只能一条条的执行指令，实在太麻烦了！  
想到这，你是不是蓝瘦香菇？
如果能将要执行的指令一行行存储到文件中，然后用一行命令将文件中的命令一次执行完成，那肯定爽死了！  
所以下面，我要带你冒着手指怀孕的危险，让你爽一把：  



## 创建文件

--------

首先创建一个txt文件，将要执行的指令一行一行写进去，当然，你也可以从其他文件拷贝进来。

    server$ vim d1.txt 
    
    set myk12 v1
    zadd zset12 0 a 1 b 3 c
    sadd sset12 e f g hh
    set myk22 v2
    hset myset12 k1 v1
    hmset myset22 k2 v2 k3 v3 k4 v4
    set myk32 v3





## 转码

--------

redis-cli中只支持dos格式的换行符 ```\r\n``` ，如果你在Linux下、Mac下或者Windows下创建的文件，最好都转个码。没有转码的文件,执行会失败。  
下面是转码指令, 只需要在命令后加入要转码的文件即可：

    server> unix2dos d1.txt 
    unix2dos: converting file d1.txt to DOS format...


如果使用unix2dos这个命令进行转码失败，提示没有这个命令，就需要进行安装，我在在mac下用brew install unix2dos 安装的unix2dos转码工具

    brew install unix2dos
    ==> Auto-updated Homebrew!
    Updated 1 tap (homebrew/core).
    ... 部分省略 ...
    ==> Pouring dos2unix-7.3.4.sierra.bottle.tar.gz
    /usr/local/Cellar/dos2unix/7.3.4: 23 files, 344.3K


如果是CentOS，使用yum install unix2dos安装unix2dos转码工具。

    yum install unix2dos
    已加载插件：fastestmirror, security
    ... 部分省略 ...
    已安装:
      unix2dos.x86_64 0:2.2-35.el6
    完毕！



## 执行导入

--------

文件转码完成后，就可以导入，导入使用cat和redis-cli命令组合,一个用来读取文件内容,一个用来发送文件到redis执行，如果要导入的文件和redis在同一台服务器上，可以直接将本地文件中的指令导入redis执行

    server> cat d1.txt | redis-cli 
    OK
    (integer) 3
    (integer) 4
    OK
    (integer) 1
    OK
    OK

我们可以看到，你输入多少条指令，就会有多少行返回记录，并且告诉你它们的执行结果，如果你导入的指令比较多，可以使用``` --pipe``` 这个参数来启用pipe协议，它不仅仅能减少返回结果的输出，还能更快的执行指令。


    server> cat d1.txt | redis-cli --pipe
    All data transferred. Waiting for the last reply...  
    Last reply received from server.  
    errors: 0, replies: 7  


如果你要导入数据在远程主机上，而且端口也是自定义的，那么可以使用下面的方法将文件导入到远程服务器：


    server> cat d1.txt | redis-cli -p 6380 -h 192.168.1.166 --pipe
    All data transferred. Waiting for the last reply...  
    Last reply received from server.  
    errors: 0, replies: 7  


数据导入完成后，我们就应该去redis看看是不是导入成功了：

    server$ redis-cli -p 6380
    127.0.0.1:6380> get myk1
    "v1"
    127.0.0.1:6380> hgetall myset1
    1) "k1"
    2) "v1"
    127.0.0.1:6380> hgetall myset2
    1) "k2"
    2) "v2"
    3) "k3"
    4) "v3"
    5) "k4"
    6) "v4"



是不是很爽，以后redis中有什么数据要处理，直接一行命令搞定！


## 总结：

--------

* redis官方有批量导入的方法，使用脚本将文件转成redis协议支持的格式，可惜我测试时只能使用```set k1 v1``` 这类包含三个元素的指令完成批量导入。遇到四个元素的，提示执行成功，但是数据就是看不到。
* 我使用的redis版本是2.8.0以上，如果你的版本较低，执行某个指令失败，可能是版本太低了
* 另外强调一下转码的重要性，如果转码失败，导入肯定失败
* 导入指令文件最好不要在一行结束留空格或者留空行，否则会出现意想不到的问题 