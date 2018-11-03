---
layout: commands
title: replicaof 命令
permalink: commands/replicaof.html
disqusIdentifier: command_replicaof
disqusUrl: http://redis.cn/commands/replicaof.html
commandsType: server
discuzTid: 13911
---

The `REPLICAOF` command can change the replication settings of a replica on the fly.
命令`REPLICAOF` 可以在线修改当前服务器的复制设置

If a Redis server is already acting as replica, the command `REPLICAOF` NO ONE will turn off the replication, turning the Redis server into a MASTER.  In the proper form `REPLICAOF` hostname port will make the server a replica of another server listening at the specified hostname and port.
如果当前服务器已经是副本服务器，命令`REPLIACOF`服务器，命令`REPLIACOF` NO ONE 会关闭当前服务器的复制并转变为主服务器。执行 `REPLIACOF` hostname port 会将当前服务器转变为
某一服务器的副本服务器

If a server is already a replica of some master, `REPLICAOF` hostname port will stop the replication against the old server and start the synchronization against the new one, discarding the old dataset.
如果当前服务器已经是某个主服务器(master server)的副本服务器，那么执行 REPLICAOF hostname port 将使当前服务器停止对原主服务器的同步，丢弃旧数据集，转而开始对新主服务器进行同步

The form `REPLICAOF` NO ONE will stop replication, turning the server into a MASTER, but will not discard the replication. So, if the old master stops working, it is possible to turn the replica into a master and set the application to use this new master in read/write. Later when the other Redis server is fixed, it can be reconfigured to work as a replica.
对一个副本服务器执行命令 REPLICAOF NO ONE 将使得这个副本服务器关闭复制，并从副本服务器转变回主服务器，原来同步所得的数据集不会被丢弃。因此，当元主服务器停止服务，可以将该副本服务器切换为主服务器，应用可以使用新主服务器进行读写。原主服务器修复后，可将其设置为新主服务器的副本服务器。

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply)
