---
layout: commands
title: zunionstore 命令
permalink: commands/zunionstore.html
disqusIdentifier: command_zunionstore
disqusUrl: http://redis.cn/commands/zunionstore.html
commandsType: sortedsets
discuzTid: 1097
---

计算给定的numkeys个有序集合的并集，并且把结果放到destination中。在给定要计算的key和其它参数之前，必须先给定key个数(numberkeys)。 默认情况下，结果集中某个成员的score值是所有给定集下该成员score值之和。

使用WEIGHTS选项，你可以为每个给定的有序集指定一个乘法因子，意思就是，每个给定有序集的所有成员的score值在传递给聚合函数之前都要先乘以该因子。如果WEIGHTS没有给定，默认就是1。

使用AGGREGATE选项，你可以指定并集的结果集的聚合方式。默认使用的参数SUM，可以将所有集合中某个成员的score值之和作为结果集中该成员的score值。如果使用参数MIN或者MAX，结果集就是所有集合中元素最小或最大的元素。

如果key destination存在，就被覆盖。

##返回值

[integer-reply](/topics/protocol#integer-reply): 结果有序集合destination中元素个数。

##例子

	redis> ZADD zset1 1 "one"
	(integer) 1
	redis> ZADD zset1 2 "two"
	(integer) 1
	redis> ZADD zset2 1 "one"
	(integer) 1
	redis> ZADD zset2 2 "two"
	(integer) 1
	redis> ZADD zset2 3 "three"
	(integer) 1
	redis> ZUNIONSTORE out 2 zset1 zset2 WEIGHTS 2 3
	(integer) 3
	redis> ZRANGE out 0 -1 WITHSCORES
	1) "one"
	2) "5"
	3) "three"
	4) "9"
	5) "two"
	6) "10"
	redis> 
