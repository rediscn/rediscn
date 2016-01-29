---
layout: commands
title: client-getname 命令 -- Redis中文资料站
permalink: commands/client-getname.html
disqusIdentifier: command_client-getname
disqusUrl: http://redis.cn/commands/client-getname.html
commandsType: keys
---

The `CLIENT GETNAME` returns the name of the current connection as set by `CLIENT SETNAME`. Since every new connection starts without an associated name, if no name was assigned a null bulk reply is returned.

## ����ֵ

@bulk-string-reply: The connection name, or a null bulk reply if no name is set.
