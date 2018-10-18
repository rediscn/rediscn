---
layout: commands
title: sinterstore 命令
permalink: commands/sinterstore.html
disqusIdentifier: command_sinterstore
disqusUrl: http://redis.cn/commands/sinterstore.html
commandsType: sets
discuzTid: 1054
---

这个命令与[SINTER](/commands/sinter.html)命令类似, 但是它并不是直接返回结果集,而是将结果保存在 destination集合中.

如果destination 集合存在, 则会被重写.

## 返回值

[integer-reply](/topics/protocol.html#integer-reply): 结果集中成员的个数.

## 例子

	redis> SADD key1 "a"
	(integer) 1
	redis> SADD key1 "b"
	(integer) 1
	redis> SADD key1 "c"
	(integer) 1
	redis> SADD key2 "c"
	(integer) 1
	redis> SADD key2 "d"
	(integer) 1
	redis> SADD key2 "e"
	(integer) 1
	redis> SINTERSTORE key key1 key2
	(integer) 1
	redis> SMEMBERS key
	1) "c"
	redis> 