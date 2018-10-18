---
layout: commands
title: mget 命令
permalink: commands/mget.html
disqusIdentifier: command_mget
disqusUrl: http://redis.cn/commands/mget.html
commandsType: strings
discuzTid: 1003
---

返回所有指定的key的value。对于每个不对应string或者不存在的key，都返回特殊值`nil`。正因为此，这个操作从来不会失败。

## 返回值

[array-reply](/topics/protocol.html#array-reply): 指定的key对应的values的list

## 例子

	redis> SET key1 "Hello"
	OK
	redis> SET key2 "World"
	OK
	redis> MGET key1 key2 nonexisting
	1) "Hello"
	2) "World"
	3) (nil)
	redis> 