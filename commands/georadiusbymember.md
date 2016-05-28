---
layout: commands
title: georadiusbymember 命令
permalink: commands/georadiusbymember.html
disqusIdentifier: command_georadiusbymember
disqusUrl: http://redis.cn/commands/georadiusbymember.html
commandsType: geo
---

这个命令和 [GEORADIUS](/commands/georadius.html) 命令一样， 都可以找出位于指定范围内的元素， 但是 `GEORADIUSBYMEMBER` 的中心点是由给定的位置元素决定的， 而不是像 [GEORADIUS](/commands/georadius.html) 那样， 使用输入的经度和纬度来决定中心点

指定成员的位置被用作查询的中心。

关于 `GEORADIUSBYMEMBER` 命令的更多信息， 请参考 [GEORADIUS](/commands/georadius.html) 命令的文档。

## 例子

	redis> GEOADD Sicily 13.583333 37.316667 "Agrigento"
	(integer) 1
	redis> GEOADD Sicily 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"
	(integer) 2
	redis> GEORADIUSBYMEMBER Sicily Agrigento 100 km
	1) "Agrigento"
	2) "Palermo"
	redis> 
