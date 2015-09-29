---
layout: commands
title: flushdb 命令 -- Redis中文资料站
permalink: commands/flushdb.html
disqusIdentifier: command_flushdb
disqusUrl: http://redis.cn/commands/flushdb.html
commandsType: server
---

Delete all the keys of the currently selected DB.
This command never fails.

The time-complexity for this operation is O(N), N being the number of
keys in the database.

@return

@simple-string-reply
