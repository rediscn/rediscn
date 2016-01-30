---
layout: commands
title: hstrlen 命令 -- Redis中文资料站
permalink: commands/hstrlen.html
disqusIdentifier: command_hstrlen
disqusUrl: http://redis.cn/commands/hstrlen.html
commandsType: hashes
---

返回hash指定field的value的字符串长度，如果hash或者field不存在，返回0.


## 返回值

[integer-reply](/topics/protocol.html#integer-reply):返回hash指定field的value的字符串长度，如果hash或者field不存在，返回0.

## 例子

	
	redis> HMSET myhash f1 HelloWorld f2 99 f3 -256
	OK
	redis> HSTRLEN myhash f1
	(integer) 10
	redis> HSTRLEN myhash f2
	(integer) 2
	redis> HSTRLEN myhash f3
	(integer) 4
	redis> 