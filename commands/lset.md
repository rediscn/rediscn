---
layout: commands
title: lset 命令
permalink: commands/lset.html
disqusIdentifier: command_lset
disqusUrl: http://redis.cn/commands/lset.html
commandsType: lists
discuzTid: 1001
---

设置 index 位置的list元素的值为 value。 更多关于 index 参数的信息，详见 [LINDEX](/commands/lindex.html)。

当index超出范围时会返回一个error。

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply)

## 例子

	redis> RPUSH mylist "one"
	(integer) 1
	redis> RPUSH mylist "two"
	(integer) 2
	redis> RPUSH mylist "three"
	(integer) 3
	redis> LSET mylist 0 "four"
	OK
	redis> LSET mylist -2 "five"
	OK
	redis> LRANGE mylist 0 -1
	1) "four"
	2) "five"
	3) "three"
	redis> 