---
layout: commands
title: expireat 命令
permalink: commands/expireat.html
disqusIdentifier: command_expireat
disqusUrl: http://redis.cn/commands/expireat.html
commandsType: keys
---

[EXPIREAT](/commands/expireat.html) 的作用和 [EXPIRE](/commands/expire.html)类似，都用于为 key 设置生存时间。不同在于 [EXPIREAT](/commands/expireat.html) 命令接受的时间参数是 UNIX 时间戳 Unix timestamp 。

## 返回值 ##

[integer-reply](/topics/protocol.html#integer-reply)，如下的整数结果

1 如果设置了过期时间
0 如果没有设置过期时间，或者不能设置过期时间

## 例子 ##

	redis> SET mykey "Hello"
	OK
	redis> EXISTS mykey
	(integer) 1
	redis> EXPIREAT mykey 1293840000
	(integer) 1
	redis> EXISTS mykey
	(integer) 0
	redis> 