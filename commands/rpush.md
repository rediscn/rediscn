---
layout: commands
title: rpush 命令
permalink: commands/rpush.html
disqusIdentifier: command_rpush
disqusUrl: http://redis.cn/commands/rpush.html
commandsType: lists
discuzTid: 1034
---

向存于 key 的列表的尾部插入所有指定的值。如果 key 不存在，那么会创建一个空的列表然后再进行 push 操作。 当 key 保存的不是一个列表，那么会返回一个错误。

可以使用一个命令把多个元素打入队列，只需要在命令后面指定多个参数。元素是从左到右一个接一个从列表尾部插入。 比如命令 RPUSH mylist a b c 会返回一个列表，其第一个元素是 a ，第二个元素是 b ，第三个元素是 c。

##返回值

[integer-reply](/topics/protocol.html#integer-reply): 在 push 操作后的列表长度。

##历史

>= 2.4: 接受多个 value 参数。 在老于 2.4 的 Redis 版本中，一条命令只能 push 单一个值。

##例子
	
	redis> RPUSH mylist "hello"
	(integer) 1
	redis> RPUSH mylist "world"
	(integer) 2
	redis> LRANGE mylist 0 -1
	1) "hello"
	2) "world"
	redis> 