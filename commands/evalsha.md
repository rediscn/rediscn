---
layout: commands
title: evalsha 命令 -- Redis中文资料站
permalink: commands/evalsha.html
disqusIdentifier: command_evalsha
disqusUrl: http://redis.cn/commands/evalsha.html
commandsType: scripting
---

Evaluates a script cached on the server side by its SHA1 digest.
Scripts are cached on the server side using the `SCRIPT LOAD` command.
The command is otherwise identical to `EVAL`.
