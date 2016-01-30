---
layout: commands
title: hget 命令 -- Redis中文资料站
permalink: commands/hget.html
disqusIdentifier: command_hget
disqusUrl: http://redis.cn/commands/hget.html
commandsType: hashes
---

返回 key 指定的哈希集中该字段所关联的值

## 返回值

[bulk-string-reply](/topics/protocol.html#bulk-string-reply)：该字段所关联的值。当字段不存在或者 key 不存在时返回nil。

## 例子

	redis> HSET myhash field1 "foo"
	(integer) 1
	redis> HGET myhash field1
	"foo"
	redis> HGET myhash field2
	(nil)
	redis> 
