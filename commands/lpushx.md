---
layout: commands
title: lpushx 命令
permalink: commands/lpushx.html
disqusIdentifier: command_lpushx
disqusUrl: http://redis.cn/commands/lpushx.html
commandsType: lists
discuzTid: 998
---

只有当 key 已经存在并且存着一个 list 的时候，在这个 key 下面的 list 的头部插入 value。 与 LPUSH 相反，当 key 不存在的时候不会进行任何操作。

##返回值

[integer-reply](/topics/protocol.html#integer-reply): 在 push 操作后的 list 长度。

##例子

	redis> LPUSH mylist "World"
	(integer) 1
	redis> LPUSHX mylist "Hello"
	(integer) 2
	redis> LPUSHX myotherlist "Hello"
	(integer) 0
	redis> LRANGE mylist 0 -1
	1) "Hello"
	2) "World"
	redis> LRANGE myotherlist 0 -1
	(empty list or set)
	redis> 