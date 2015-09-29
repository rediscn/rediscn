---
layout: commands
title: bgsave 命令 -- Redis中文资料站
permalink: commands/bgsave.html
disqusIdentifier: command_bgsave
disqusUrl: http://redis.cn/commands/bgsave.html
commandsType: server
---

Save the DB in background.
The OK code is immediately returned.
Redis forks, the parent continues to serve the clients, the child saves the DB
on disk then exits.
A client may be able to check if the operation succeeded using the `LASTSAVE`
command.

Please refer to the [persistence documentation][tp] for detailed information.

[tp]: /topics/persistence

@return

@simple-string-reply
