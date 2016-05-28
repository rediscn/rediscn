---
layout: commands
title: zrevrangebyscore 命令
permalink: commands/zrevrangebyscore.html
disqusIdentifier: command_zrevrangebyscore
disqusUrl: http://redis.cn/commands/zrevrangebyscore.html
commandsType: sortedsets
---

返回key的有序集合中的分数在max和min之间的所有元素（包括分数等于max或者min的元素）。与有序集合的默认排序相反，对于这个命令，元素被认为是从高分到低具有相同分数的元素按字典反序。

除了反序之外， ng, [ZREVRANGEBYSCORE](/commands/zrevrangebyscore.html) 和[ZRANGEBYSCORE](/commands/zrangebyscore.html)类似。

##返回值

[array-reply](/topics/protocol#array-reply): 
指定分数范围的元素列表(也可以返回他们的分数)。

##例子

	redis> ZADD myzset 1 "one"
	(integer) 1
	redis> ZADD myzset 2 "two"
	(integer) 1
	redis> ZADD myzset 3 "three"
	(integer) 1
	redis> ZREVRANGEBYSCORE myzset +inf -inf
	1) "three"
	2) "two"
	3) "one"
	redis> ZREVRANGEBYSCORE myzset 2 1
	1) "two"
	2) "one"
	redis> ZREVRANGEBYSCORE myzset 2 (1
	1) "two"
	redis> ZREVRANGEBYSCORE myzset (2 (1
	(empty list or set)
	redis> 
