---
layout: commands
title: unwatch 命令 -- Redis中文资料站
permalink: commands/unwatch.html
disqusIdentifier: command_unwatch
disqusUrl: http://redis.cn/commands/unwatch.html
commandsType: transactions
---

Flushes all the previously watched keys for a [transaction][tt].

[tt]: /topics/transactions

If you call `EXEC` or `DISCARD`, there's no need to manually call `UNWATCH`.

## ����ֵ

@simple-string-reply: always `OK`.
