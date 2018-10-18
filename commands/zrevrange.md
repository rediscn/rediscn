---
layout: commands
title: zrevrange 命令
permalink: commands/zrevrange.html
disqusIdentifier: command_zrevrange
disqusUrl: http://redis.cn/commands/zrevrange.html
commandsType: sortedsets
discuzTid: 1091
---

返回有序集key中，指定区间内的成员。其中成员的位置按score值递减(从大到小)来排列。具有相同score值的成员按字典序的反序排列。 除了成员按score值递减的次序排列这一点外，[ZREVRANGE](/commands/zrevrange.html)命令的其他方面和[ZRANGE](/commands/zrange.html)命令一样。

## 返回值

[array-reply](/topics/protocol#array-reply): 
指定范围的元素列表(可选是否含有分数)。

例子

	redis> ZADD myzset 1 "one"
	(integer) 1
	redis> ZADD myzset 2 "two"
	(integer) 1
	redis> ZADD myzset 3 "three"
	(integer) 1
	redis> ZREVRANGE myzset 0 -1
	1) "three"
	2) "two"
	3) "one"
	redis> ZREVRANGE myzset 2 3
	1) "one"
	redis> ZREVRANGE myzset -2 -1
	1) "two"
	2) "one"
	redis> 