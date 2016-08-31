---
layout: commands
title: hgetall 命令
permalink: commands/hgetall.html
disqusIdentifier: command_hgetall
disqusUrl: http://redis.cn/commands/hgetall.html
commandsType: hashes
discuzTid: 975
---

返回 key 指定的哈希集中所有的字段和值。返回值中，每个字段名的下一个是它的值，所以返回值的长度是哈希集大小的两倍

## 返回值

[array-reply](/topics/protocol.html#array-reply)：哈希集中字段和值的列表。当 key 指定的哈希集不存在时返回空列表。

## 例子
	
	redis> HSET myhash field1 "Hello"
	(integer) 1
	redis> HSET myhash field2 "World"
	(integer) 1
	redis> HGETALL myhash
	1) "field1"
	2) "Hello"
	3) "field2"
	4) "World"
	redis> 