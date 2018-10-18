---
layout: commands
title: rpop 命令
permalink: commands/rpop.html
disqusIdentifier: command_rpop
disqusUrl: http://redis.cn/commands/rpop.html
commandsType: lists
discuzTid: 1032
---

移除并返回存于 key 的 list 的最后一个元素。

## 返回值

[bulk-string-reply](/topics/protocol.html#bulk-string-reply): 
最后一个元素的值，或者当 key 不存在的时候返回 nil。

## 例子
	
	redis> RPUSH mylist "one"
	(integer) 1
	redis> RPUSH mylist "two"
	(integer) 2
	redis> RPUSH mylist "three"
	(integer) 3
	redis> RPOP mylist
	"three"
	redis> LRANGE mylist 0 -1
	1) "one"
	2) "two"
	redis> 