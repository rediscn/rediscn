---
layout: commands
title: discard 命令
permalink: commands/discard.html
disqusIdentifier: command_discard
disqusUrl: http://redis.cn/commands/discard.html
commandsType: transactions
---

刷新一个事务中所有在排队等待的指令，并且将连接状态恢复到正常。

如果已使用[WATCH](/commands/watch.html)，[DISCARD](/commands/discard.html)将释放所有被[WATCH](/commands/watch.html)的key。

## 返回值

[status-reply](/topics/protocol.html#status-reply)：所有返回都是 OK