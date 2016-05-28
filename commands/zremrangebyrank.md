---
layout: commands
title: zremrangebyrank 命令
permalink: commands/zremrangebyrank.html
disqusIdentifier: command_zremrangebyrank
disqusUrl: http://redis.cn/commands/zremrangebyrank.html
commandsType: sortedsets
---

移除有序集key中，指定排名(rank)区间内的所有成员。下标参数start和stop都以0为底，0处是分数最小的那个元素。这些索引也可是负数，表示位移从最高分处开始数。例如，-1是分数最高的元素，-2是分数第二高的，依次类推。

##返回值

[integer-reply](/topics/protocol#integer-reply): 被移除成员的数量。

##列子

	redis> ZADD myzset 1 "one"
	(integer) 1
	redis> ZADD myzset 2 "two"
	(integer) 1
	redis> ZADD myzset 3 "three"
	(integer) 1
	redis> ZREMRANGEBYRANK myzset 0 1
	(integer) 2
	redis> ZRANGE myzset 0 -1 WITHSCORES
	1) "three"
	2) "3"
	redis> 