---
layout: commands
title: sdiff 命令 -- Redis中文资料站
permalink: commands/sdiff.html
disqusIdentifier: command_sdiff
disqusUrl: http://redis.cn/commands/sdiff.html
commandsType: sets
---

返回一个集合与给定集合的差集的元素.

举例:

	key1 = {a,b,c,d}
	key2 = {c}
	key3 = {a,c,e}
	SDIFF key1 key2 key3 = {b,d}

不存在的key认为是空集.

##返回值

[array-reply](/topics/protocol.html#array-reply):结果集的元素.

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
	redis> SDIFF key1 key2
	1) "a"
	2) "b"
	redis> 