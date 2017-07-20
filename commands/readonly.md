---
layout: commands
title: readonly 命令
permalink: commands/readonly.html
disqusIdentifier: command_readonly
disqusUrl: http://redis.cn/commands/readonly.html
commandsType: cluster
discuzTid: 1026
tranAuthor: menwengit
---

开启与 Redis Cluster 从节点连接的读请求

通常，从节点将重定向客户端到认证过的主节点，以获取在指定命令中所涉及的哈希槽，然而客户端能通过`READONLY`命令将从节点设置为只读模式。

`READONLY`告诉 Redis Cluster 从节点客户端愿意读取可能过时的数据并且对写请求不感兴趣。

当连接处于只读模式，只有操作涉及到该从节点的主节点不服务的键时，集群将会发送一个重定向给客户端。这可能是因为：

1. 客户端发送一个有关这个从节点的主节点不服务哈希槽的命令。

2. 集群被重新配置（例如重新分片）并且从节点不在服务给定哈希槽的命令。

## 返回值

[simple-string-reply](http://www.redis.cn/topics/protocol.html#simple-string-reply)
