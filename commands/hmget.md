---
layout: commands
title: hmget 命令 -- Redis中文资料站
permalink: commands/hmget.html
disqusIdentifier: command_hmget
disqusUrl: http://redis.cn/commands/hmget.html
commandsType: hashes
---

返回 `key` 指定的哈希集中指定字段的值。

对于哈希集中不存在的每个字段，返回 `nil` 值。因为不存在的keys被认为是一个空的哈希集，对一个不存在的 `key` 执行 [HMGET](/commands/hmget.html) 将返回一个只含有 `nil` 值的列表

## 返回值

[array-reply](/topics/protocol.html#array-reply)：含有给定字段及其值的列表，并保持与请求相同的顺序。

## 例子

	redis> HSET myhash field1 "Hello"
	(integer) 1
	redis> HSET myhash field2 "World"
	(integer) 1
	redis> HMGET myhash field1 field2 nofield
	1) "Hello"
	2) "World"
	3) (nil)
	redis> 