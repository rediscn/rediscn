---
layout: commands
title: slaveof 命令 -- Redis中文资料站
permalink: commands/slaveof.html
disqusIdentifier: command_slaveof
disqusUrl: http://redis.cn/commands/slaveof.html
commandsType: server
---

Redis `SLAVEOF` 命令可以将当前服务器转变为指定服务器的从属服务器(slave server)。

如果当前服务器已经是某个主服务器(master server)的从属服务器，那么执行 SLAVEOF host port 将使当前服务器停止对旧主服务器的同步，丢弃旧数据集，转而开始对新主服务器进行同步。

另外，对一个从属服务器执行命令 `SLAVEOF NO ONE` 将使得这个从属服务器关闭复制功能，并从从属服务器转变回主服务器，原来同步所得的数据集不会被丢弃。

利用『 SLAVEOF NO ONE 不会丢弃同步所得数据集』这个特性，可以在主服务器失败的时候，将从属服务器用作新的主服务器，从而实现无间断运行。

##返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply)
