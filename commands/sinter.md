---
layout: commands
title: sinter 命令
permalink: commands/sinter.html
disqusIdentifier: command_sinter
disqusUrl: http://redis.cn/commands/sinter.html
commandsType: sets
---

返回指定所有的集合的成员的交集.

例如:

	key1 = {a,b,c,d}
	key2 = {c}
	key3 = {a,c,e}
	SINTER key1 key2 key3 = {c}

如果key不存在则被认为是一个空的集合,当给定的集合为空的时候,结果也为空.(一个集合为空，结果一直为空).

##返回值

[array-reply](/topics/protocol.html#array-reply): 结果集成员的列表.

##例子
	
	redis> SADD key1 "a"
	(integer) 1
	redis> SADD key1 "b"
	(integer) 1
	redis> SADD key1 "c"
	(integer) 1
	redis> SADD key2 "c"
	(integer) 1
	redis> SADD key2 "d"
	(integer) 1
	redis> SADD key2 "e"
	(integer) 1
	redis> SINTER key1 key2
	1) "c"
	redis> 