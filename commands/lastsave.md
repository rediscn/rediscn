---
layout: commands
title: lastsave 命令 -- Redis中文资料站
permalink: commands/lastsave.html
disqusIdentifier: command_lastsave
disqusUrl: http://redis.cn/commands/lastsave.html
commandsType: keys
---

Return the UNIX TIME of the last DB save executed with success.
A client may check if a `BGSAVE` command succeeded reading the `LASTSAVE` value,
then issuing a `BGSAVE` command and checking at regular intervals every N
seconds if `LASTSAVE` changed.

@return

@integer-reply: an UNIX time stamp.
