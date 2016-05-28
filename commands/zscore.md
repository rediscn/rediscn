---
layout: commands
title: zscore 命令
permalink: commands/zscore.html
disqusIdentifier: command_zscore
disqusUrl: http://redis.cn/commands/zscore.html
commandsType: sortedsets
---

返回有序集key中，成员member的score值。

如果member元素不是有序集key的成员，或key不存在，返回nil。

##返回值

[bulk-string-reply](/topics/protocol#bulk-string-reply): member成员的score值（double型浮点数），以字符串形式表示。

##例子

	redis> ZADD myzset 1 "one"
	(integer) 1
	redis> ZSCORE myzset "one"
	"1"
	redis> 
