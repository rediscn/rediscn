---
layout: commands
title: incrby 命令
permalink: commands/incrby.html
disqusIdentifier: command_incrby
disqusUrl: http://redis.cn/commands/incrby.html
commandsType: strings
---

将key对应的数字加decrement。如果key不存在，操作之前，key就会被置为0。如果key的value类型错误或者是个不能表示成数字的字符串，就返回错误。这个操作最多支持64位有符号的正型数字。

查看命令[INCR](/commands/incr.html)了解关于增减操作的额外信息。

##返回值

[integer-reply](/topics/protocol.html#integer-reply)：
增加之后的value值。

##例子

	redis> SET mykey "10"
	OK
	redis> INCRBY mykey 5
	(integer) 15
	redis> 