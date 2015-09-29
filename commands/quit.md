---
layout: commands
title: quit 命令 -- Redis中文资料站
permalink: commands/quit.html
disqusIdentifier: command_quit
disqusUrl: http://redis.cn/commands/quit.html
commandsType: keys
---

Ask the server to close the connection.
The connection is closed as soon as all pending replies have been written to the
client.

@return

@simple-string-reply: always OK.
