---
layout: commands
title: client-pause 命令
permalink: commands/client-pause.html
disqusIdentifier: command_client-pause
disqusUrl: http://redis.cn/commands/client-pause.html
commandsType: server
discuzTid: 915
---

`CLIENT PAUSE` 是连接控制命令，它可以将所有客户端的访问暂停给定的毫秒数

该命令执行如下：

* 它会停止处理所有来自一般客户端或者pub/sub客户端的命令。但是和slaves的交互命令不受影响。
* 因为它会尽快返回OK给调用者，所以`CLIENT PAUSE` 不会被自己暂停。
* 当给定的时间结束，所有的客户端都被解除阻塞:查询缓存里积累的所有命令都会被处理。

当该命令可以可控的将客户端从一个Redis实例切换至另一个实例。比如，当需要升级一个实例时，管理员可以作如下操作：

* 使用`CLIENT PAUSE` 暂停所有客户端
* 等待数秒，让slaves节点处理完所有来自master的复制命令
* 将一个salve节点切换为master
* 重配客户端以来接新的master 节点

可以在MULTI/EXEC中一起使用`CLIENT PAUSE` 和`INFO replication`以在阻塞的同时获取当前master的偏移量。用这种方法，可以让slaves处理至给定的复制偏移节点。

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply): 命令返回OK，超时设置无效则返回错误