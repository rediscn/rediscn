---
layout: commands
title: readwrite 命令
permalink: commands/readwrite.html
disqusIdentifier: command_readwrite
disqusUrl: http://redis.cn/commands/readwrite.html
commandsType: cluster
discuzTid: 1027
tranAuthor: menwengit
---

禁止与Redis Cluster从节点连接的读请求。

默认情况下禁止Redis Cluster从节点的读请求，但是可以使用`READONLY`去在每个连接的基础上改变这个行为，`READWRITE`命令将连接的只读模式重置为读写模式。

## 返回值

[simple-string-reply](http://www.redis.cn/topics/protocol.html#simple-string-reply)

