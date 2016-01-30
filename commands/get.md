---
layout: commands
title: get 命令 -- Redis中文资料站
permalink: commands/get.html
disqusIdentifier: command_get
disqusUrl: http://redis.cn/commands/get.html
commandsType: strings
---

返回`key`的`value`。如果key不存在，返回特殊值`nil`。如果`key`的`value`不是string，就返回错误，因为`GET`只处理string类型的`values`。

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply):key对应的value，或者nil（key不存在时）

## 例子

	redis> GET nonexisting
	(nil)
	redis> SET mykey "Hello"
	OK
	redis> GET mykey
	"Hello"
	redis> 