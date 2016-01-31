---
layout: commands
title: setex 命令 -- Redis中文资料站
permalink: commands/setex.html
disqusIdentifier: command_setex
disqusUrl: http://redis.cn/commands/setex.html
commandsType: strings
---

设置key对应字符串value，并且设置key在给定的seconds时间之后超时过期。这个命令等效于执行下面的命令：

	SET mykey value
	EXPIRE mykey seconds

SETEX是原子的，也可以通过把上面两个命令放到[MULTI](/commands/multi.html)/[EXEC](/commands/exec.html)块中执行的方式重现。相比连续执行上面两个命令，它更快，因为当Redis当做缓存使用时，这个操作更加常用。

## 返回值 ##

[simple-string-reply](/topics/protocol.html#simple-string-reply)

## 例子 ##

redis> SETEX mykey 10 "Hello"
OK
redis> TTL mykey
(integer) 10
redis> GET mykey
"Hello"
redis> 
