---
layout: commands
title: ltrim 命令
permalink: commands/ltrim.html
disqusIdentifier: command_ltrim
disqusUrl: http://redis.cn/commands/ltrim.html
commandsType: lists
discuzTid: 1002
---

修剪(trim)一个已存在的 list，这样 list 就会只包含指定范围的指定元素。start 和 stop 都是由0开始计数的， 这里的 0 是列表里的第一个元素（表头），1 是第二个元素，以此类推。

例如： `LTRIM foobar 0 2` 将会对存储在 foobar 的列表进行修剪，只保留列表里的前3个元素。

start 和 end 也可以用负数来表示与表尾的偏移量，比如 -1 表示列表里的最后一个元素， -2 表示倒数第二个，等等。

超过范围的下标并不会产生错误：如果 start 超过列表尾部，或者 start > end，结果会是列表变成空表（即该 key 会被移除）。 如果 end 超过列表尾部，Redis 会将其当作列表的最后一个元素。

`LTRIM` 的一个常见用法是和 [LPUSH](/commands/lpush.html) / [RPUSH](/commands/rpush.html) 一起使用。 例如：

- LPUSH mylist someelement
- LTRIM mylist 0 99

这一对命令会将一个新的元素 push 进列表里，并保证该列表不会增长到超过100个元素。这个是很有用的，比如当用 Redis 来存储日志。 需要特别注意的是，当用这种方式来使用 LTRIM 的时候，操作的复杂度是 O(1) ， 因为平均情况下，每次只有一个元素会被移除。

##返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply)

##例子

	redis> RPUSH mylist "one"
	(integer) 1
	redis> RPUSH mylist "two"
	(integer) 2
	redis> RPUSH mylist "three"
	(integer) 3
	redis> LTRIM mylist 1 -1
	OK
	redis> LRANGE mylist 0 -1
	1) "two"
	2) "three"
	redis> 
