---
layout: commands
title: sdiffstore 命令 -- Redis中文资料站
permalink: commands/sdiffstore.html
disqusIdentifier: command_sdiffstore
disqusUrl: http://redis.cn/commands/sdiffstore.html
commandsType: sets
---

该命令类似于 [SDIFF](/commands/sdiff.html), 不同之处在于该命令不返回结果集，而是将结果存放在`destination`集合中.

如果`destination`已经存在, 则将其覆盖重写.

##返回值

[integer-reply](/topics/protocol.html#integer-reply): 结果集元素的个数.

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
	redis> SDIFFSTORE key key1 key2
	(integer) 2
	redis> SMEMBERS key
	1) "b"
	2) "a"
	redis> 
