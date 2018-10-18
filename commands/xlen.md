---
layout: commands
title: xlen 命令
permalink: commands/xlen.html
disqusIdentifier: command_xlen
disqusUrl: http://redis.cn/commands/xlen.html
commandsType: streams
discuzTid: 13921
---

Returns the number of entries inside a stream. If the specified key does not
exist the command returns zero, as if the stream was empty.
However note that unlike other Redis types, zero-length streams are
possible, so you should call `TYPE` or `EXISTS` in order to check if
a key exists or not.

Streams are not auto-deleted once they have no entries inside (for instance
after an `XDEL` call), because the stream may have consumer groups
associated with it.

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
