---
layout: commands
title: unlink 命令
permalink: commands/unlink.html
disqusIdentifier: command_unlink
disqusUrl: http://redis.cn/commands/unlink.html
commandsType: keys
discuzTid: 13937
tranAuthor: gqhao
---

该命令和`DEL`十分相似：删除指定的key(s),若key不存在则该key被跳过。但是，相比`DEL`会产生阻塞，该命令会在另一个线程中回收内存，因此它是非阻塞的。
这也是该命令名字的由来：仅将keys从keyspace元数据中删除，真正的删除会在后续异步操作。


## 返回值
[integer-reply](/topics/protocol.html#integer-reply)：unlink的keys的数量.

## 例子

	redis> SET key1 "Hello"
	"OK"
	redis> SET key2 "World"
	"OK"
	redis> UNLINK key1 key2 key3
	(integer) 2
	redis> 
