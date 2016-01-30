---
layout: commands
title: hincrby 命令 -- Redis中文资料站
permalink: commands/hincrby.html
disqusIdentifier: command_hincrby
disqusUrl: http://redis.cn/commands/hincrby.html
commandsType: hashes
---

增加 `key` 指定的哈希集中指定字段的数值。如果 `key` 不存在，会创建一个新的哈希集并与 `key` 关联。如果字段不存在，则字段的值在该操作执行前被设置为 0

`HINCRBY` 支持的值的范围限定在 64位 有符号整数

## 返回值

[integer-reply](/topics/protocol.html#integer-reply)：增值操作执行后的该字段的值。

## 例子
	
	redis> HSET myhash field 5
	(integer) 1
	redis> HINCRBY myhash field 1
	(integer) 6
	redis> HINCRBY myhash field -1
	(integer) 5
	redis> HINCRBY myhash field -10
	(integer) -5
	redis> 