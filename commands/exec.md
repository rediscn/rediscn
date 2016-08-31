---
layout: commands
title: exec 命令
permalink: commands/exec.html
disqusIdentifier: command_exec
disqusUrl: http://redis.cn/commands/exec.html
commandsType: transactions
discuzTid: 954
---

执行事务中所有在排队等待的指令并将链接状态恢复到正常
当使用[WATCH](/commands/watch.html) 时，只有当被监视的键没有被修改，且允许检查设定机制时，EXEC会被执行

返回值

[multi-bulk-reply](/topics/protocol.html#multi-bulk-reply): 每个元素与原子事务中的指令一一对应
当使用[WATCH](/commands/watch.html)时，如果被终止，[EXEC](/commands/exec.html) 则返回一个空的应答集合