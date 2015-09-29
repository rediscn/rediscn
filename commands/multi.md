---
layout: commands
title: multi 命令 -- Redis中文资料站
permalink: commands/multi.html
disqusIdentifier: command_multi
disqusUrl: http://redis.cn/commands/multi.html
commandsType: keys
---

Marks the start of a [transaction][tt] block.
Subsequent commands will be queued for atomic execution using `EXEC`.

[tt]: /topics/transactions

@return

@simple-string-reply: always `OK`.
