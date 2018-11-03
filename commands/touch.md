---
layout: commands
title: touch 命令
permalink: commands/touch.html
disqusIdentifier: command_touch
disqusUrl: http://redis.cn/commands/touch.html
commandsType: keys
discuzTid: 13914
---

Alters the last access time of a key(s).
A key is ignored if it does not exist.
修改指定key(s) 最后访问时间
若key不存在，不做操作

## 返回值

[integer-reply](/topics/protocol.html#integer-reply): The number of keys that were touched.
## 返回值
[integer-reply](/topics/protocol.html#integer-reply): 操作的key的数量

## 例子

	redis> SET key1 "Hello"
	"OK"
	redis> SET key2 "World"
	"OK"
	redis> TOUCH key1 key2
	(integer) 2
	redis> 
