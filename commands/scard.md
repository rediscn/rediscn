---
layout: commands
title: scard 命令
permalink: commands/scard.html
disqusIdentifier: command_scard
disqusUrl: http://redis.cn/commands/scard.html
commandsType: sets
discuzTid: 1039
---

返回集合存储的key的基数 (集合元素的数量).

## 返回值

[integer-reply](/topics/protocol.html#integer-reply): 集合的基数(元素的数量),如果key不存在,则返回 0.

## 举例

	redis> SADD myset "Hello"
	(integer) 1
	redis> SADD myset "World"
	(integer) 1
	redis> SCARD myset
	(integer) 2
	redis> 