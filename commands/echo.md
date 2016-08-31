---
layout: commands
title: echo 命令
permalink: commands/echo.html
disqusIdentifier: command_echo
disqusUrl: http://redis.cn/commands/echo.html
commandsType: connection
discuzTid: 951
---

返回消息

## 返回值

[Bulk reply](/topics/protocol.html#bulk-reply)

## 例子

	redis> ECHO HelloWorld!
	HelloWorld!
	redis> 