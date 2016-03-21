---
layout: commands
title: del 命令 -- Redis中文资料站
permalink: commands/del.html
disqusIdentifier: command_del
disqusUrl: http://redis.cn/commands/del.html
commandsType: keys
---

如果删除的key不存在，则直接忽略。

## 返回值

[integer-reply](/topics/protocol.html#integer-reply)：
被删除的keys的数量

## 例子

	redis> SET key1 "Hello"
	OK
	redis> SET key2 "World"
	OK
	redis> DEL key1 key2 key3
	(integer) 2
	redis> 