---
layout: commands
title: zrangebyscore 命令
permalink: commands/zrangebyscore.html
disqusIdentifier: command_zrangebyscore
disqusUrl: http://redis.cn/commands/zrangebyscore.html
commandsType: sortedsets
---

如果M是常量（比如，用limit总是请求前10个元素），你可以认为是O(log(N))。 

返回key的有序集合中的分数在min和max之间的所有元素（包括分数等于max或者min的元素）。元素被认为是从低分到高分排序的。 

具有相同分数的元素按字典序排列（这个根据redis对有序集合实现的情况而定，并不需要进一步计算）。

 可选的LIMIT参数指定返回结果的数量及区间（类似SQL中SELECT LIMIT offset, count）。注意，如果offset太大，定位offset就可能遍历整个有序集合，这会增加O(N)的复杂度。

 可选参数WITHSCORES会返回元素和其分数，而不只是元素。这个选项在redis2.0之后的版本都可用。

##区间及无限

min和max可以是-inf和+inf，这样一来，你就可以在不知道有序集的最低和最高score值的情况下，使用ZRANGEBYSCORE这类命令。

默认情况下，区间的取值使用闭区间(小于等于或大于等于)，你也可以通过给参数前增加(符号来使用可选的开区间(小于或大于)。 

举个例子：

	ZRANGEBYSCORE zset (1 5

返回所有符合条件1 < score <= 5的成员；

	ZRANGEBYSCORE zset (5 (10

返回所有符合条件5 < score < 10 的成员。

##返回值

[array-reply](/topics/protocol#array-reply): 指定分数范围的元素列表(也可以返回他们的分数)。

##例子

	redis> ZADD myzset 1 "one"
	(integer) 1
	redis> ZADD myzset 2 "two"
	(integer) 1
	redis> ZADD myzset 3 "three"
	(integer) 1
	redis> ZRANGEBYSCORE myzset -inf +inf
	1) "one"
	2) "two"
	3) "three"
	redis> ZRANGEBYSCORE myzset 1 2
	1) "one"
	2) "two"
	redis> ZRANGEBYSCORE myzset (1 2
	1) "two"
	redis> ZRANGEBYSCORE myzset (1 (2
	(empty list or set)
	redis> 