---
layout: commands
title: hexists 命令
permalink: commands/hexists.html
disqusIdentifier: command_hexists
disqusUrl: http://redis.cn/commands/hexists.html
commandsType: hashes
discuzTid: 973
---

返回hash里面field是否存在

## 返回值

[integer-reply](/topics/protocol.html#integer-reply), 含义如下：

- 1 hash里面包含该field。
- 0 hash里面不包含该field或者key不存在。

## 例子

	redis> HSET myhash field1 "foo"
	(integer) 1
	redis> HEXISTS myhash field1
	(integer) 1
	redis> HEXISTS myhash field2
	(integer) 0
	redis> 