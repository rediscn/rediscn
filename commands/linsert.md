---
layout: commands
title: linsert 命令
permalink: commands/linsert.html
disqusIdentifier: command_linsert
disqusUrl: http://redis.cn/commands/linsert.html
commandsType: lists
discuzTid: 994
---

把 value 插入存于 key 的列表中在基准值 pivot 的前面或后面。

当 key 不存在时，这个list会被看作是空list，任何操作都不会发生。

当 key 存在，但保存的不是一个list的时候，会返回error。

## 返回值

[integer-reply](/topics/protocol.html#integer-reply): 经过插入操作后的list长度，或者当 pivot 值找不到的时候返回 -1。

## 例子

	redis> RPUSH mylist "Hello"
	(integer) 1
	redis> RPUSH mylist "World"
	(integer) 2
	redis> LINSERT mylist BEFORE "World" "There"
	(integer) 3
	redis> LRANGE mylist 0 -1
	1) "Hello"
	2) "There"
	3) "World"
	redis> 