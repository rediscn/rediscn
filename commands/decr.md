---
layout: commands
title: decr 命令
permalink: commands/decr.html
disqusIdentifier: command_decr
disqusUrl: http://redis.cn/commands/decr.html
commandsType: strings
discuzTid: 946
---

对key对应的数字做减1操作。如果key不存在，那么在操作之前，这个key对应的值会被置为0。如果key有一个错误类型的value或者是一个不能表示成数字的字符串，就返回错误。这个操作最大支持在64位有符号的整型数字。

查看命令[INCR](/commands/incr.html)了解关于增减操作的额外信息。

## 返回值

数字：减小之后的value

## 例子

	redis> SET mykey "10"
	OK
	redis> DECR mykey
	(integer) 9
	redis> SET mykey "234293482390480948029348230948"
	OK
	redis> DECR mykey
	ERR value is not an integer or out of range
	redis> 