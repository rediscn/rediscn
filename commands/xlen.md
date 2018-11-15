---
layout: commands
title: xlen 命令
permalink: commands/xlen.html
disqusIdentifier: command_xlen
disqusUrl: http://redis.cn/commands/xlen.html
commandsType: streams
discuzTid: 13921
---

返回流中的条目数。如果指定的key不存在，则此命令返回0，就好像该流为空。
但是请注意，与其他的Redis类型不同，零长度流是可能的，所以你应该调用`TYPE` 或者 `EXISTS`
来检查一个key是否存在。

一旦内部没有任何的条目（例如调用`XDEL`后），流不会被自动删除，因为可能还存在与其相关联的消费者组。

## 返回值

[integer-reply](/topics/protocol.html#integer-reply)：

## 例子

	redis> XADD mystream * item 1
	"1539863829481-0"
	redis> XADD mystream * item 2
	"1539863829482-0"
	redis> XADD mystream * item 3
	"1539863829482-1"
	redis> XLEN mystream
	(integer) 3
	redis> 
