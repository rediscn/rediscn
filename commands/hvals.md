---
layout: commands
title: hvals 命令
permalink: commands/hvals.html
disqusIdentifier: command_hvals
disqusUrl: http://redis.cn/commands/hvals.html
commandsType: hashes
---

返回 key 指定的哈希集中所有字段的值。

返回值

[array-reply](/topics/protocol#array-reply)：哈希集中的值的列表，当 key 指定的哈希集不存在时返回空列表。

例子

	redis> HSET myhash field1 "Hello"
	(integer) 1
	redis> HSET myhash field2 "World"
	(integer) 1
	redis> HVALS myhash
	1) "Hello"
	2) "World"
	redis> 