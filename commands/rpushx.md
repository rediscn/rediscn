---
layout: commands
title: rpushx 命令
permalink: commands/rpushx.html
disqusIdentifier: command_rpushx
disqusUrl: http://redis.cn/commands/rpushx.html
commandsType: lists
---

将值 value 插入到列表 key 的表尾, 当且仅当 key 存在并且是一个列表。 和 [RPUSH](/commands/rpush.html) 命令相反, 当 key 不存在时，RPUSHX 命令什么也不做。

##返回值

[integer-reply](/topics/protocol.html#integer-reply): RPUSHX 命令执行之后，表的长度。

##例子

	redis> RPUSH mylist "Hello"
	(integer) 1
	redis> RPUSHX mylist "World"
	(integer) 2
	redis> RPUSHX myotherlist "World"
	(integer) 0
	redis> LRANGE mylist 0 -1
	1) "Hello"
	2) "World"
	redis> LRANGE myotherlist 0 -1
	(empty list or set)
	redis> 