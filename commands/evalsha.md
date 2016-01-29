---
layout: commands
title: evalsha 命令 -- Redis中文资料站
permalink: commands/evalsha.html
disqusIdentifier: command_evalsha
disqusUrl: http://redis.cn/commands/evalsha.html
commandsType: scripting
---

根据给定的 SHA1 校验码，对缓存在服务器中的脚本进行求值。 将脚本缓存到服务器的操作可以通过 SCRIPT LOAD 命令进行。 这个命令的其他地方，比如参数的传入方式，都和 [EVAL](/commands/eval.html)命令一样。