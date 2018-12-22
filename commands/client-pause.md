---
layout: commands
title: client-pause 命令
permalink: commands/client-pause.html
disqusIdentifier: command_client-pause
disqusUrl: http://redis.cn/commands/client-pause.html
commandsType: server
discuzTid: 915
---

`CLIENT PAUSE` is a connections control command able to suspend all the Redis clients for the specified amount of time (in milliseconds).
`CLIENT PAUSE` 是连接控制命令，它可以将所有客户端的访问暂停给定的毫秒数

The command performs the following actions:
该命令执行如下：

* It stops processing all the pending commands from normal and pub/sub clients. However interactions with slaves will continue normally.
* 它会停止处理所有来自一般客户端或者pub/sub客户端的命令。但是和slaves的交互命令不受影响。
* However it returns OK to the caller ASAP, so the `CLIENT PAUSE` command execution is not paused by itself.
* 因为它会尽快返回OK给调用者，所以`CLIENT PAUSE` 不会被自己暂停。
* When the specified amount of time has elapsed, all the clients are unblocked: this will trigger the processing of all the commands accumulated in the query buffer of every client during the pause.
* 当给定的时间结束，所有的客户端都被解除阻塞:查询缓存里积累的所有命令都会被处理。

This command is useful as it makes able to switch clients from a Redis instance to another one in a controlled way. For example during an instance upgrade the system administrator could do the following:
当该命令可以可控的将客户端从一个Redis实例切换至另一个实例。比如，当需要升级一个实例时，管理员可以作如下操作：
* Pause the clients using `CLIENT PAUSE`
* 使用`CLIENT PAUSE` 暂停所有客户端
* Wait a few seconds to make sure the slaves processed the latest replication stream from the master.
* 等待数秒，让slaves节点处理完所有来自master的复制命令
* Turn one of the slaves into a master.
* 将一个salve节点切换为master
* Reconfigure clients to connect with the new master.
* 重配客户端以来接新的master 节点

It is possible to send `CLIENT PAUSE` in a MULTI/EXEC block together with the `INFO replication` command in order to get the current master offset
at the time the clients are blocked. 
This way it is possible to wait for a specific offset in the slave side in order to make sure all the replication stream was processed.
可以在MULTI/EXEC中一起使用`CLIENT PAUSE` 和`INFO replication`以在阻塞的同时获取当前master的偏移量。用这种方法，可以让slaves处理至给定的复制偏移节点。
@return

@simple-string-reply: The command returns OK or an error if the timeout is invalid.
@simple-string-reply: 命令返回OK，超时设置无效则返回错误