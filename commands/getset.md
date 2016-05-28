---
layout: commands
title: getset 命令
permalink: commands/getset.html
disqusIdentifier: command_getset
disqusUrl: http://redis.cn/commands/getset.html
commandsType: strings
---

自动将key对应到value并且返回原来key对应的value。如果key存在但是对应的value不是字符串，就返回错误。

设计模式

[GETSET](/commands/getset.html)可以和[INCR](/commands/incr.html)一起使用实现支持重置的计数功能。举个例子：每当有事件发生的时候，一段程序都会调用[INCR](/commands/incr.html)给key mycounter加1，但是有时我们需要获取计数器的值，并且自动将其重置为0。这可以通过GETSET mycounter "0"来实现：

	INCR mycounter
	GETSET mycounter "0"
	GET mycounter


## 返回值

[bulk-string-reply](/topics/protocol.html#bulk-string-reply): 
返回之前的旧值，如果之前`Key`不存在将返回`nil`。

## 例子

	redis> INCR mycounter
	(integer) 1
	redis> GETSET mycounter "0"
	"1"
	redis> GET mycounter
	"0"
	redis> 
