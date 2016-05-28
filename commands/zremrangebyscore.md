---
layout: commands
title: zremrangebyscore 命令
permalink: commands/zremrangebyscore.html
disqusIdentifier: command_zremrangebyscore
disqusUrl: http://redis.cn/commands/zremrangebyscore.html
commandsType: sortedsets
---

移除有序集key中，所有score值介于min和max之间(包括等于min或max)的成员。
自版本2.1.6开始，score值等于min或max的成员也可以不包括在内，语法请参见[ZRANGEBYSCORE](/commands/zrangebyscore.html)命令。

##返回值

[integer-reply](/topics/protocol#integer-reply): 删除的元素的个数。

##例子

	redis> ZADD myzset 1 "one"
	(integer) 1
	redis> ZADD myzset 2 "two"
	(integer) 1
	redis> ZADD myzset 3 "three"
	(integer) 1
	redis> ZREMRANGEBYSCORE myzset -inf (2
	(integer) 1
	redis> ZRANGE myzset 0 -1 WITHSCORES
	1) "two"
	2) "2"
	3) "three"
	4) "3"
	redis> 