---
layout: commands
title: sunion 命令
permalink: commands/sunion.html
disqusIdentifier: command_sunion
disqusUrl: http://redis.cn/commands/sunion.html
commandsType: sets
discuzTid: 1067
---

返回给定的多个集合的并集中的所有成员.

例如:

	key1 = {a,b,c,d}
	key2 = {c}
	key3 = {a,c,e}
	SUNION key1 key2 key3 = {a,b,c,d,e}

不存在的key可以认为是空的集合.

##返回值

[array-reply](/topics/protocol#array-reply):并集的成员列表

##举例

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
	redis> SUNION key1 key2
	1) "a"
	2) "b"
	3) "c"
	4) "d"
	5) "e"
	redis> 