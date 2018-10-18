---
layout: commands
title: ping 命令
permalink: commands/ping.html
disqusIdentifier: command_ping
disqusUrl: http://redis.cn/commands/ping.html
commandsType: connection
discuzTid: 1017
---

如果后面没有参数时返回`PONG`，否则会返回后面带的参数。

这个命令经常用来测试一个连接是否还是可用的，或者用来测试一个连接的延时。

如果客户端处于频道订阅模式下，它将是一个multi-bulk返回，第一次时返回"pong"，之后返回空（empty bulk），除非命令后面更随了参数。

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply)

## 例子

	redis> PING
	PONG
	redis> PING "hello world"
	"hello world"
	redis>