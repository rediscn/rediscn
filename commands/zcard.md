---
layout: commands
title: zcard 命令
permalink: commands/zcard.html
disqusIdentifier: command_zcard
disqusUrl: http://redis.cn/commands/zcard.html
commandsType: sortedsets
---

返回key的有序集元素个数。

##返回值

[integer-reply](/topics/protocol#integer-reply): key存在的时候，返回有序集的元素个数，否则返回0。

##例子

	redis> ZADD myzset 1 "one"
	(integer) 1
	redis> ZADD myzset 2 "two"
	(integer) 1
	redis> ZCARD myzset
	(integer) 2
	redis> 