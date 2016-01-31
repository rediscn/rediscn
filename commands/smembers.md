---
layout: commands
title: smembers 命令 -- Redis中文资料站
permalink: commands/smembers.html
disqusIdentifier: command_smembers
disqusUrl: http://redis.cn/commands/smembers.html
commandsType: sets
---

返回key集合所有的元素.

该命令的作用与使用一个参数的[SINTER](/commands/sinter.html) 命令作用相同.

##返回值

[array-reply](/topics/protocol.html#array-reply):集合中的所有元素.

##举例

	redis> SADD myset "Hello"
	(integer) 1
	redis> SADD myset "World"
	(integer) 1
	redis> SMEMBERS myset
	1) "World"
	2) "Hello"
	redis> 