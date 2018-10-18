---
layout: commands
title: sadd 命令
permalink: commands/sadd.html
disqusIdentifier: command_sadd
disqusUrl: http://redis.cn/commands/sadd.html
commandsType: sets
discuzTid: 1036
---

添加一个或多个指定的member元素到集合的 key中.指定的一个或者多个元素member 如果已经在集合key中存在则忽略.如果集合key 不存在，则新建集合key,并添加member元素到集合key中.

如果key 的类型不是集合则返回错误.

## 返回值

[integer-reply](/topics/protocol.html#integer-reply):返回新成功添加到集合里元素的数量，不包括已经存在于集合中的元素.

##历史

>= 2.4: 接受多个member 参数. Redis 2.4 以前的版本每次只能添加一个member元素.

## 例子

	redis> SADD myset "Hello"
	(integer) 1
	redis> SADD myset "World"
	(integer) 1
	redis> SADD myset "World"
	(integer) 0
	redis> SMEMBERS myset
	1) "World"
	2) "Hello"
	redis> 
