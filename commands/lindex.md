---
layout: commands
title: lindex 命令 -- Redis中文资料站
permalink: commands/lindex.html
disqusIdentifier: command_lindex
disqusUrl: http://redis.cn/commands/lindex.html
commandsType: lists
---

返回列表里的元素的索引 index 存储在 key 里面。 下标是从0开始索引的，所以 0 是表示第一个元素， 1 表示第二个元素，并以此类推。 负数索引用于指定从列表尾部开始索引的元素。在这种方法下，-1 表示最后一个元素，-2 表示倒数第二个元素，并以此往前推。

当 key 位置的值不是一个列表的时候，会返回一个error。

## 返回值

[bulk-reply](/topics/protocol.html#bulk-reply)：请求的对应元素，或者当 index 超过范围的时候返回 nil。

## 例子

	redis> LPUSH mylist "World"
	(integer) 1
	redis> LPUSH mylist "Hello"
	(integer) 2
	redis> LINDEX mylist 0
	"Hello"
	redis> LINDEX mylist -1
	"World"
	redis> LINDEX mylist 3
	(nil)
	redis> 
