---
layout: commands
title: zpopmin 命令
permalink: commands/zpopmin.html
disqusIdentifier: command_zpopmin
disqusUrl: http://redis.cn/commands/zpopmin.html
commandsType: sortedsets
discuzTid: 13929
---

Removes and returns up to `count` members with the lowest scores in the sorted
set stored at `key`.

When left unspecified, the default value for `count` is 1. Specifying a `count`
value that is higher than the sorted set's cardinality will not produce an
error. When returning multiple elements, the one with the lowest score will
be the first, followed by the elements with greater scores.

## 返回值

[array-reply](/topics/protocol.html#array-reply): list of popped elements and scores.

## 例子

	redis> ZADD myzset 1 "one"
	(integer) 1
	redis> ZADD myzset 2 "two"
	(integer) 1
	redis> ZADD myzset 3 "three"
	(integer) 1
	redis> ZPOPMIN myzset
	1) "1"
	2) "one"
	redis> 
