---
layout: commands
title: command-count 命令
permalink: commands/command-count.html
disqusIdentifier: command_command-count
disqusUrl: http://redis.cn/commands/command-count.html
commandsType: server
discuzTid: 936
---

返回Redis服务器命令的总数


## 返回值

[Integer reply](/topics/protocol.html#integer-reply): 命令的总数

## 例子

	redis> COMMAND COUNT
	(integer) 197
	redis> 
