---
layout: commands
title: zrank 命令
permalink: commands/zrank.html
disqusIdentifier: command_zrank
disqusUrl: http://redis.cn/commands/zrank.html
commandsType: sortedsets
discuzTid: 1086
---

返回有序集key中成员member的排名。其中有序集成员按score值递增(从小到大)顺序排列。排名以0为底，也就是说，score值最小的成员排名为0。

使用ZREVRANK命令可以获得成员按score值递减(从大到小)排列的排名。

## 返回值

- 如果member是有序集key的成员，返回[integer-reply](/topics/protocol#integer-reply)：member的排名。
- 如果member不是有序集key的成员，返回[bulk-string-reply](/topics/protocol#bulk-string-reply): `nil`。

## 例子

	redis> ZADD myzset 1 "one"
	(integer) 1
	redis> ZADD myzset 2 "two"
	(integer) 1
	redis> ZADD myzset 3 "three"
	(integer) 1
	redis> ZRANK myzset "three"
	(integer) 2
	redis> ZRANK myzset "four"
	(nil)
	redis> 