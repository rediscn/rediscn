---
layout: commands
title: watch 命令 -- Redis中文资料站
permalink: commands/watch.html
disqusIdentifier: command_watch
disqusUrl: http://redis.cn/commands/watch.html
commandsType: transactions
---

标记所有指定的key 被监视起来，在事务中有条件的执行（乐观锁）。

##返回值

[simple-string-reply](/topics/protocol#simple-string-reply): 总是 OK。
