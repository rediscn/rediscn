---
layout: commands
title: readwrite 命令
permalink: commands/readwrite.html
disqusIdentifier: command_readwrite
disqusUrl: http://redis.cn/commands/readwrite.html
commandsType: cluster
discuzTid: 1027
---

Disables read queries for a connection to a Redis Cluster slave node.

禁止与Redis Cluster从节点连接的读请求。

Read queries against a Redis Cluster slave node are disabled by default,
but you can use the `READONLY` command to change this behavior on a per-
connection basis. The `READWRITE` command resets the readonly mode flag
of a connection back to readwrite.

默认情况下禁止Redis Cluster从节点的读请求，但是可以使用`READONLY`去在每个连接的基础上改变这个行为，`READWRITE`命令将连接的只读模式重置为读写模式。

@return

@simple-string-reply
