---
layout: commands
title: bgrewriteaof 命令 -- Redis中文资料站
permalink: commands/bgrewriteaof.html
disqusIdentifier: command_bgrewriteaof
disqusUrl: http://redis.cn/commands/bgrewriteaof.html
commandsType: server
---

Instruct Redis to start an [Append Only File][tpaof] rewrite process.
The rewrite will create a small optimized version of the current Append Only
File.

If `BGREWRITEAOF` fails, no data gets lost as the old AOF will be untouched.

The rewrite will be only triggered by Redis if there is not already a background
process doing persistence.
Specifically:

* If a Redis child is creating a snapshot on disk, the AOF rewrite is
  _scheduled_ but not started until the saving child producing the RDB file
  terminates.
  In this case the `BGREWRITEAOF` will still return an OK code, but with an
  appropriate message.
  You can check if an AOF rewrite is scheduled looking at the `INFO` command
  as of Redis 2.6.
* If an AOF rewrite is already in progress the command returns an error and no
  AOF rewrite will be scheduled for a later time.

Since Redis 2.4 the AOF rewrite is automatically triggered by Redis, however the
`BGREWRITEAOF` command can be used to trigger a rewrite at any time.

Please refer to the [persistence documentation][tp] for detailed information.

##返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply): always `OK`.
