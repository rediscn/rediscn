---
layout: commands
title: llen 命令
permalink: commands/llen.html
disqusIdentifier: command_llen
disqusUrl: http://redis.cn/commands/llen.html
commandsType: lists
---

返回存储在 key 里的list的长度。 如果 key 不存在，那么就被看作是空list，并且返回长度为 0。 当存储在 key 里的值不是一个list的话，会返回error。

## 返回值

[integer-reply](/topics/protocol.html#integer-reply): key对应的list的长度。

## 例子

	redis> LPUSH mylist "World"
	(integer) 1
	redis> LPUSH mylist "Hello"
	(integer) 2
	redis> LLEN mylist
	(integer) 2
	redis> 