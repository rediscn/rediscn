---
layout: commands
title: lpop 命令
permalink: commands/lpop.html
disqusIdentifier: command_lpop
disqusUrl: http://redis.cn/commands/lpop.html
commandsType: lists
---

移除并且返回 key 对应的 list 的第一个元素。

## 返回值

[bulk-string-reply](/topics/protocol.html#bulk-string-reply): 返回第一个元素的值，或者当 key 不存在时返回 nil。

## 例子

	redis> RPUSH mylist "one"
	(integer) 1
	redis> RPUSH mylist "two"
	(integer) 2
	redis> RPUSH mylist "three"
	(integer) 3
	redis> LPOP mylist
	"one"
	redis> LRANGE mylist 0 -1
	1) "two"
	2) "three"
	redis> 


