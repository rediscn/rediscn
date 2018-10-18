---
layout: commands
title: zinterstore 命令
permalink: commands/zinterstore.html
disqusIdentifier: command_zinterstore
disqusUrl: http://redis.cn/commands/zinterstore.html
commandsType: sortedsets
discuzTid: 1081
---

计算给定的numkeys个有序集合的交集，并且把结果放到destination中。 在给定要计算的key和其它参数之前，必须先给定key个数(numberkeys)。

默认情况下，结果中一个元素的分数是有序集合中该元素分数之和，前提是该元素在这些有序集合中都存在。因为交集要求其成员必须是给定的每个有序集合中的成员，结果集中的每个元素的分数和输入的有序集合个数相等。

对于WEIGHTS和AGGREGATE参数的描述，参见命令[ZUNIONSTORE](/commands/zunionstore.html)。

如果destination存在，就把它覆盖。

## 返回值

[integer-reply](/topics/protocol#integer-reply): 结果有序集合destination中元素个数。

## 例子

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
	redis> ZINTERSTORE out 2 zset1 zset2 WEIGHTS 2 3
	(integer) 2
	redis> ZRANGE out 0 -1 WITHSCORES
	1) "one"
	2) "5"
	3) "two"
	4) "10"
	redis> 