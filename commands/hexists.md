---
layout: commands
title: hexists 命令 -- Redis中文资料站
permalink: commands/hexists.html
disqusIdentifier: command_hexists
disqusUrl: http://redis.cn/commands/hexists.html
commandsType: hashes
---

返回hash里面key是否存在的标志

## 返回值

[integer-reply](/topics/protocol.html#integer-reply), 含义如下：

- 1 哈希集中含有该字段。
- 0 哈希集中不含有该存在字段，或者key不存在。

## 例子

	redis> HSET myhash field1 "foo"
	(integer) 1
	redis> HEXISTS myhash field1
	(integer) 1
	redis> HEXISTS myhash field2
	(integer) 0
	redis> 