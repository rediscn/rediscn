---
layout: commands
title: readwrite 命令 -- Redis中文资料站
permalink: commands/readwrite.html
disqusIdentifier: command_readwrite
disqusUrl: http://redis.cn/commands/readwrite.html
commandsType: keys
---

Disables read queries for a connection to a Redis Cluster slave node.

Read queries against a Redis Cluster slave node are disabled by default,
but you can use the `READONLY` command to change this behavior on a per-
connection basis. The `READWRITE` command resets the readonly mode flag
of a connection back to readwrite.

@return

@simple-string-reply
