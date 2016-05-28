---
layout: commands
title: lastsave 命令
permalink: commands/lastsave.html
disqusIdentifier: command_lastsave
disqusUrl: http://redis.cn/commands/lastsave.html
commandsType: server
---

执行成功时返回UNIX时间戳。客户端执行 [BGSAVE](/commands/bgsave.html) 命令时，可以通过每N秒发送一个 `LASTSAVE` 命令来查看[BGSAVE](/commands/bgsave.html) 命令执行的结果，由 `LASTSAVE` 返回结果的变化可以判断执行结果。

## 返回值

[integer-reply](/topics/protocol.html#integer-reply): UNIX 的时间戳.
