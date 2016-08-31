---
layout: commands
title: multi 命令
permalink: commands/multi.html
disqusIdentifier: command_multi
disqusUrl: http://redis.cn/commands/multi.html
commandsType: transactions
discuzTid: 1009
---

标记一个事务块的开始。 随后的指令将在执行[EXEC](/commands/exec.html)时作为一个原子执行。

##返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply): 始终为`OK`
