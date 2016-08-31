---
layout: commands
title: sismember 命令
permalink: commands/sismember.html
disqusIdentifier: command_sismember
disqusUrl: http://redis.cn/commands/sismember.html
commandsType: sets
discuzTid: 1055
---

返回成员 member 是否是存储的集合 key的成员.

##返回值

[integer-reply](/topics/protocol.html#integer-reply),详细说明:

- 如果member元素是集合key的成员，则返回1
- 如果member元素不是key的成员，或者集合key不存在，则返回0

##举例
	
	redis> SADD myset "one"
	(integer) 1
	redis> SISMEMBER myset "one"
	(integer) 1
	redis> SISMEMBER myset "two"
	(integer) 0
	redis> 