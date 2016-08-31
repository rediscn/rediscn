---
layout: commands
title: zrem 命令
permalink: commands/zrem.html
disqusIdentifier: command_zrem
disqusUrl: http://redis.cn/commands/zrem.html
commandsType: sortedsets
discuzTid: 1087
---

当key存在，但是其不是有序集合类型，就返回一个错误。

##返回值

[integer-reply](/topics/protocol#integer-reply), 如下的整数:

返回的是从有序集合中删除的成员个数，不包括不存在的成员。

##历史



- >= 2.4: 接受多个元素。在2.4之前的版本中，每次只能删除一个成员。

##例子

	redis> ZADD myzset 1 "one"
	(integer) 1
	redis> ZADD myzset 2 "two"
	(integer) 1
	redis> ZADD myzset 3 "three"
	(integer) 1
	redis> ZREM myzset "two"
	(integer) 1
	redis> ZRANGE myzset 0 -1 WITHSCORES
	1) "one"
	2) "1"
	3) "three"
	4) "3"
	redis> 