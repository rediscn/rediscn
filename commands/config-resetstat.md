---
layout: commands
title: config-resetstat 命令
permalink: commands/config-resetstat.html
disqusIdentifier: command_config-resetstat
disqusUrl: http://redis.cn/commands/config-resetstat.html
commandsType: server
discuzTid: 940
---

重置INFO命令统计里面的一些计算器。

被重置的数据如下:

	Keyspace hits
	Keyspace misses
	Number of commands processed
	Number of connections received
	Number of expired keys

## 返回值

[Status code reply](/topics/protocol.html#status-reply): 总是返回 OK.
