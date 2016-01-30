---
layout: commands
title: hlen 命令 -- Redis中文资料站
permalink: commands/hlen.html
disqusIdentifier: command_hlen
disqusUrl: http://redis.cn/commands/hlen.html
commandsType: hashes
---

返回 `key` 指定的哈希集包含的字段的数量。

## 返回值

[integer-reply](/topics/protocol.html#integer-reply)：
哈希集中字段的数量，当 `key` 指定的哈希集不存在时返回 0

## 例子

	redis> HSET myhash field1 "Hello"
	(integer) 1
	redis> HSET myhash field2 "World"
	(integer) 1
	redis> HLEN myhash
	(integer) 2
	redis> 