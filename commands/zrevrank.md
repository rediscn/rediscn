---
layout: commands
title: zrevrank 命令
permalink: commands/zrevrank.html
disqusIdentifier: command_zrevrank
disqusUrl: http://redis.cn/commands/zrevrank.html
commandsType: sortedsets
---

返回有序集key中成员member的排名，其中有序集成员按score值从大到小排列。排名以0为底，也就是说，score值最大的成员排名为0。

使用[ZRANK](/commands/zrank.html)命令可以获得成员按score值递增(从小到大)排列的排名。

##返回值

- 如果member是有序集key的成员，返回[integer-reply](/topics/protocol#integer-reply):member的排名。
- 如果member不是有序集key的成员，返回[bulk-string-reply](/topics/protocol#bulk-string-reply): `nil`。

##例子

	redis> ZADD myzset 1 "one"
	(integer) 1
	redis> ZADD myzset 2 "two"
	(integer) 1
	redis> ZADD myzset 3 "three"
	(integer) 1
	redis> ZREVRANK myzset "one"
	(integer) 2
	redis> ZREVRANK myzset "four"
	(nil)
	redis> 