---
layout: commands
title: zpopmax 命令
permalink: commands/zpopmax.html
disqusIdentifier: command_zpopmax
disqusUrl: http://redis.cn/commands/zpopmax.html
commandsType: sortedsets
discuzTid: 13928
---

Removes and returns up to `count` members with the highest scores in the sorted
set stored at `key`.

When left unspecified, the default value for `count` is 1. Specifying a `count`
value that is higher than the sorted set's cardinality will not produce an
error. When returning multiple elements, the one with the highest score will
be the first, followed by the elements with lower scores.

## 返回值

[array-reply](/topics/protocol.html#array-reply): list of popped elements and scores.

## 例子

	redis> ZADD myzset 1 "one"
	(integer) 1
	redis> ZADD myzset 2 "two"
	(integer) 1
	redis> ZADD myzset 3 "three"
	(integer) 1
	redis> ZPOPMAX myzset
	1) "3"
	2) "three"
	redis> 
