---
layout: commands
title: sunionstore 命令
permalink: commands/sunionstore.html
disqusIdentifier: command_sunionstore
disqusUrl: http://redis.cn/commands/sunionstore.html
commandsType: sets
---

该命令作用类似于[SUNION](/commands/sunion.html)命令,不同的是它并不返回结果集,而是将结果存储在destination集合中.

如果destination 已经存在,则将其覆盖.

## 返回值

[integer-reply](/topics/protocol#integer-reply):结果集中元素的个数.

## 举例

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
	redis> SUNIONSTORE key key1 key2
	(integer) 5
	redis> SMEMBERS key
	1) "c"
	2) "e"
	3) "b"
	4) "a"
	5) "d"
	redis>