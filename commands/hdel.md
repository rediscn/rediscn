---
layout: commands
title: hdel 命令
permalink: commands/hdel.html
disqusIdentifier: command_hdel
disqusUrl: http://redis.cn/commands/hdel.html
commandsType: hashes
discuzTid: 972
---

从 key 指定的哈希集中移除指定的域。在哈希集中不存在的域将被忽略。

如果 key 指定的哈希集不存在，它将被认为是一个空的哈希集，该命令将返回0。

返回值

[integer-reply](/topics/protocol.html#integer-reply)：
返回从哈希集中成功移除的域的数量，不包括指出但不存在的那些域

历史

*   在 2.4及以上版本中 ：可接受多个域作为参数。小于 2.4版本 的 Redis 每次调用只能移除一个域
要在早期版本中以原子方式从哈希集中移除多个域，可用 [MULTI](/commands/multi.html)/[EXEC](/commands/exec.html)块。

例子

	redis> HSET myhash field1 "foo"
	(integer) 1
	redis> HDEL myhash field1
	(integer) 1
	redis> HDEL myhash field2
	(integer) 0
	redis> 
