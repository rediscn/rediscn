---
layout: commands
title: unwatch 命令
permalink: commands/unwatch.html
disqusIdentifier: command_unwatch
disqusUrl: http://redis.cn/commands/unwatch.html
commandsType: transactions
discuzTid: 1074
---

刷新一个事务中已被监视的所有key。

如果执行[EXEC](/commands/exec.html) 或者[DISCARD](/commands/discard.html)， 则不需要手动执行[UNWATCH](/commands/unwatch.html) 。

## 返回值

[simple-string-reply](/topics/protocol#simple-string-reply): 总是 OK。