---
layout: commands
title: psetex 命令
permalink: commands/psetex.html
disqusIdentifier: command_psetex
disqusUrl: http://redis.cn/commands/psetex.html
commandsType: strings
---

[PSETEX](/commands/psetex.html)和[SETEX](/commands/setex.html)一样，唯一的区别是到期时间以毫秒为单位,而不是秒。

## 例子

	redis> PSETEX mykey 1000 "Hello"
	OK
	redis> PTTL mykey
	(integer) 999
	redis> GET mykey
	"Hello"
	redis> 