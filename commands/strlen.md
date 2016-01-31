---
layout: commands
title: strlen 命令 -- Redis中文资料站
permalink: commands/strlen.html
disqusIdentifier: command_strlen
disqusUrl: http://redis.cn/commands/strlen.html
commandsType: strings
---

返回key的string类型value的长度。如果key对应的非string类型，就返回错误。

##返回值

[integer-reply](/topics/protocol#integer-reply)：key对应的字符串value的长度，或者0（key不存在）

##例子

	redis> SET mykey "Hello world"
	OK
	redis> STRLEN mykey
	(integer) 11
	redis> STRLEN nonexisting
	(integer) 0
	redis> 