---
layout: commands
title: hset 命令
permalink: commands/hset.html
disqusIdentifier: command_hset
disqusUrl: http://redis.cn/commands/hset.html
commandsType: hashes
discuzTid: 983
---

设置 key 指定的哈希集中指定字段的值。

如果 key 指定的哈希集不存在，会创建一个新的哈希集并与 key 关联。

如果字段在哈希集中存在，它将被重写。

##返回值

[integer-reply](/topics/protocol.html#integer-reply)：含义如下

- 1如果field是一个新的字段
- 0如果field原来在map里面已经存在

##例子

	redis> HSET myhash field1 "Hello"
	(integer) 1
	redis> HGET myhash field1
	"Hello"
	redis> 