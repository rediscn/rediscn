---
layout: commands
title: exists 命令 -- Redis中文资料站
permalink: commands/exists.html
disqusIdentifier: command_exists
disqusUrl: http://redis.cn/commands/exists.html
commandsType: keys
---

返回key是否存在。

## 返回值 ##

[integer-reply](/topics/protocol.html#integer-reply)，如下的整数结果

- 1 如果key存在
- 0 如果key不存在

## 例子 ##

	redis> SET key1 "Hello"
	OK
	redis> EXISTS key1
	(integer) 1
	redis> EXISTS key2
	(integer) 0
	redis> 