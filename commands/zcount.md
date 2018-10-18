---
layout: commands
title: zcount 命令
permalink: commands/zcount.html
disqusIdentifier: command_zcount
disqusUrl: http://redis.cn/commands/zcount.html
commandsType: sortedsets
discuzTid: 1079
---

返回有序集key中，score值在min和max之间(默认包括score值等于min或max)的成员。 关于参数min和max的详细使用方法，请参考[ZRANGEBYSCORE](/commands/zrangebyscore.html)命令。

Note: the command has a complexity of just O(log(N)) because it uses elements ranks (see `ZRANK`) to get an idea of the range. Because of this there is no need to do a work proportional to the size of the range.

## 返回值

[integer-reply](/topics/protocol#integer-reply): 指定分数范围的元素个数。

## 例子

	redis> ZADD myzset 1 "one"
	(integer) 1
	redis> ZADD myzset 2 "two"
	(integer) 1
	redis> ZADD myzset 3 "three"
	(integer) 1
	redis> ZCOUNT myzset -inf +inf
	(integer) 3
	redis> ZCOUNT myzset (1 3
	(integer) 2
	redis> 