---
layout: commands
title: lrem 命令
permalink: commands/lrem.html
disqusIdentifier: command_lrem
disqusUrl: http://redis.cn/commands/lrem.html
commandsType: lists
discuzTid: 1000
---

从存于 key 的列表里移除前 count 次出现的值为 value 的元素。 这个 count 参数通过下面几种方式影响这个操作：

- count > 0: 从头往尾移除值为 value 的元素。
- count < 0: 从尾往头移除值为 value 的元素。
- count = 0: 移除所有值为 value 的元素。

比如， LREM list -2 "hello" 会从存于 list 的列表里移除最后两个出现的 "hello"。

需要注意的是，如果list里没有存在key就会被当作空list处理，所以当 key 不存在的时候，这个命令会返回 0。

##返回值

[integer-reply](/topics/protocol.html#integer-reply): 被移除的元素个数。

##例子

	redis> RPUSH mylist "hello"
	(integer) 1
	redis> RPUSH mylist "hello"
	(integer) 2
	redis> RPUSH mylist "foo"
	(integer) 3
	redis> RPUSH mylist "hello"
	(integer) 4
	redis> LREM mylist -2 "hello"
	(integer) 2
	redis> LRANGE mylist 0 -1
	1) "hello"
	2) "foo"
	redis> 