---
layout: commands
title: lrange 命令
permalink: commands/lrange.html
disqusIdentifier: command_lrange
disqusUrl: http://redis.cn/commands/lrange.html
commandsType: lists
discuzTid: 999
---

返回存储在 key 的列表里指定范围内的元素。 start 和 end 偏移量都是基于0的下标，即list的第一个元素下标是0（list的表头），第二个元素下标是1，以此类推。

偏移量也可以是负数，表示偏移量是从list尾部开始计数。 例如， -1 表示列表的最后一个元素，-2 是倒数第二个，以此类推。

##在不同编程语言里，关于求范围函数的一致性

需要注意的是，如果你有一个list，里面的元素是从0到100，那么 `LRANGE list 0 10` 这个命令会返回11个元素，即最右边的那个元素也会被包含在内。 在你所使用的编程语言里，这一点**可能是也可能不是**跟那些求范围有关的函数都是一致的。（像Ruby的 Range.new，Array#slice 或者Python的 range() 函数。）

##超过范围的下标

当下标超过list范围的时候不会产生error。 如果start比list的尾部下标大的时候，会返回一个空列表。 如果stop比list的实际尾部大的时候，Redis会当它是最后一个元素的下标。

## 返回值

[array-reply](/topics/protocol.html#array-reply): 指定范围里的列表元素。

## 例子

	redis> RPUSH mylist "one"
	(integer) 1
	redis> RPUSH mylist "two"
	(integer) 2
	redis> RPUSH mylist "three"
	(integer) 3
	redis> LRANGE mylist 0 0
	1) "one"
	redis> LRANGE mylist -3 2
	1) "one"
	2) "two"
	3) "three"
	redis> LRANGE mylist -100 100
	1) "one"
	2) "two"
	3) "three"
	redis> LRANGE mylist 5 10
	(empty list or set)
	redis> 

