---
layout: commands
title: readonly 命令
permalink: commands/readonly.html
disqusIdentifier: command_readonly
disqusUrl: http://redis.cn/commands/readonly.html
commandsType: cluster
discuzTid: 1026
---

Enables read queries for a connection to a Redis Cluster slave node. 

开启与 Redis Cluster 从节点连接的读请求

Normally slave nodes will redirect clients to the authoritative master for
the hash slot involved in a given command, however clients can use slaves
in order to scale reads using the `READONLY` command.

通常，从节点将重定向客户端到认证过的主节点，以获取在指定命令中所涉及的哈希槽，然而客户端能通过`READONLY`命令将从节点设置为只读模式。

`READONLY` tells a Redis Cluster slave node that the client is willing to
read possibly stale data and is not interested in running write queries.

`READONLY`告诉 Redis Cluster 从节点客户端愿意读取可能过时的数据并且对写请求不感兴趣。

When the connection is in readonly mode, the cluster will send a redirection
to the client only if the operation involves keys not served by the slave's
master node. This may happen because:

当连接处于只读模式，只有操作涉及到该从节点的主节点不服务的键时，集群将会发送一个重定向给客户端。这可能是因为：

1. The client sent a command about hash slots never served by the master of this slave.

   客户端发送一个有关这个从节点的主节点不服务哈希槽的命令。

2. The cluster was reconfigured (for example resharded) and the slave is no longer able to serve commands for a given hash slot.

   集群被重新配置（例如重新分片）并且从节点不在服务给定哈希槽的命令。

@return

@simple-string-reply
