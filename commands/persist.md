---
layout: commands
title: persist 命令
permalink: commands/persist.html
disqusIdentifier: command_persist
disqusUrl: http://redis.cn/commands/persist.html
commandsType: keys
---

移除给定key的生存时间，将这个 key 从『易失的』(带生存时间 key )转换成『持久的』(一个不带生存时间、永不过期的 key )。

##返回值

[integer-reply](/topics/protocol.html#integer-reply), 只有以下两种值:

- 当生存时间移除成功时，返回 1 .
- 如果 key 不存在或 key 没有设置生存时间，返回 0 .

##例子

	redis> SET mykey "Hello"
	OK
	redis> EXPIRE mykey 10
	(integer) 1
	redis> TTL mykey
	(integer) 10
	redis> PERSIST mykey
	(integer) 1
	redis> TTL mykey
	(integer) -1
	redis> 
