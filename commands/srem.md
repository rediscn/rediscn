---
layout: commands
title: srem 命令 -- Redis中文资料站
permalink: commands/srem.html
disqusIdentifier: command_srem
disqusUrl: http://redis.cn/commands/srem.html
commandsType: sets
---

在key集合中移除指定的元素. 如果指定的元素不是key集合中的元素则忽略 如果key集合不存在则被视为一个空的集合，该命令返回0.

如果key的类型不是一个集合,则返回错误.

## 返回值

[integer-reply](/topics/protocol#integer-reply):从集合中移除元素的个数，不包括不存在的成员.

## 历史

- >= 2.4: 接受多个 member 元素参数. Redis 2.4 之前的版本每次只能移除一个元素.

## 举例

	redis> SADD myset "one"
	(integer) 1
	redis> SADD myset "two"
	(integer) 1
	redis> SADD myset "three"
	(integer) 1
	redis> SREM myset "one"
	(integer) 1
	redis> SREM myset "four"
	(integer) 0
	redis> SMEMBERS myset
	1) "three"
	2) "two"
	redis> 