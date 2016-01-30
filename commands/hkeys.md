---
layout: commands
title: hkeys 命令 -- Redis中文资料站
permalink: commands/hkeys.html
disqusIdentifier: command_hkeys
disqusUrl: http://redis.cn/commands/hkeys.html
commandsType: hashes
---

返回 key 指定的哈希集中所有字段的名字。

##返回值

[array-reply](/topics/protocol.html#array-reply)：哈希集中的字段列表，当 key 指定的哈希集不存在时返回空列表。

##例子

	redis> HSET myhash field1 "Hello"
	(integer) 1
	redis> HSET myhash field2 "World"
	(integer) 1
	redis> HKEYS myhash
	1) "field1"
	2) "field2"
	redis> 