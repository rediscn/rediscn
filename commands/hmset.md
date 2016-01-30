---
layout: commands
title: hmset 命令 -- Redis中文资料站
permalink: commands/hmset.html
disqusIdentifier: command_hmset
disqusUrl: http://redis.cn/commands/hmset.html
commandsType: hashes
---

设置 `key` 指定的哈希集中指定字段的值。该命令将重写所有在哈希集中存在的字段。如果 `key` 指定的哈希集不存在，会创建一个新的哈希集并与 `key` 关联

##返回值

[simple-string-reply](/topics/protocol#simple-string-reply)

##例子

	redis> HMSET myhash field1 "Hello" field2 "World"
	OK
	redis> HGET myhash field1
	"Hello"
	redis> HGET myhash field2
	"World"
	redis> 