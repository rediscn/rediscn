---
layout: commands
title: zincrby 命令
permalink: commands/zincrby.html
disqusIdentifier: command_zincrby
disqusUrl: http://redis.cn/commands/zincrby.html
commandsType: sortedsets
discuzTid: 1080
---

为有序集key的成员member的score值加上增量increment。如果key中不存在member，就在key中添加一个member，score是increment（就好像它之前的score是0.0）。如果key不存在，就创建一个只含有指定member成员的有序集合。

当key不是有序集类型时，返回一个错误。

score值必须是字符串表示的整数值或双精度浮点数，并且能接受double精度的浮点数。也有可能给一个负数来减少score的值。

## 返回值

[Bulk string reply](/topics/protocol#Bulk string reply): member成员的新score值，以字符串形式表示。

## 例子

	redis> ZADD myzset 1 "one"
	(integer) 1
	redis> ZADD myzset 2 "two"
	(integer) 1
	redis> ZINCRBY myzset 2 "one"
	"3"
	redis> ZRANGE myzset 0 -1 WITHSCORES
	1) "two"
	2) "2"
	3) "one"
	4) "3"
	redis> 
