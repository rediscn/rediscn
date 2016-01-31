---
layout: commands
title: pexpire 命令 -- Redis中文资料站
permalink: commands/pexpire.html
disqusIdentifier: command_pexpire
disqusUrl: http://redis.cn/commands/pexpire.html
commandsType: keys
---

这个命令和[EXPIRE](/commands/expire.html)命令的作用类似，但是它以毫秒为单位设置 key 的生存时间，而不像[EXPIRE](/commands/expire.html)命令那样，以秒为单位。


##返回值

[integer-reply](/topics/protocol.html#integer-reply), 只有以下两种值:

- 设置成功，返回 1
- key 不存在或设置失败，返回 0

##例子

	redis> SET mykey "Hello"
	OK
	redis> PEXPIRE mykey 1500
	(integer) 1
	redis> TTL mykey
	(integer) 1
	redis> PTTL mykey
	(integer) 1499
	redis> 