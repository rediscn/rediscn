---
layout: commands
title: type 命令
permalink: commands/type.html
disqusIdentifier: command_type
disqusUrl: http://redis.cn/commands/type.html
commandsType: keys
discuzTid: 1072
---

返回`key`所存储的`value`的数据结构类型，它可以返回`string`, `list`, `set`, `zset` 和 `hash`等不同的类型。

返回值

[simple-string-reply](/topics/protocol#simple-string-reply): 
返回当前`key`的数据类型，如果`key`不存在时返回`none`。

例子

	redis> SET key1 "value"
	OK
	redis> LPUSH key2 "value"
	(integer) 1
	redis> SADD key3 "value"
	(integer) 1
	redis> TYPE key1
	string
	redis> TYPE key2
	list
	redis> TYPE key3
	set
	redis> 