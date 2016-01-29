---
layout: commands
title: flushall 命令 -- Redis中文资料站
permalink: commands/flushall.html
disqusIdentifier: command_flushall
disqusUrl: http://redis.cn/commands/flushall.html
commandsType: server
---

Delete all the keys of all the existing databases, not just the currently
selected one.
This command never fails.

The time-complexity for this operation is O(N), N being the number of
keys in all existing databases.

## ����ֵ

@simple-string-reply
