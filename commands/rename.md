---
layout: commands
title: rename 命令 -- Redis中文资料站
permalink: commands/rename.html
disqusIdentifier: command_rename
disqusUrl: http://redis.cn/commands/rename.html
commandsType: keys
---

将key重命名为newkey，如果key与newkey相同，将返回一个错误。如果newkey已经存在，则值将被覆盖。

##返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply)

##例子

	redis> SET mykey "Hello"
	OK
	redis> RENAME mykey myotherkey
	OK
	redis> GET myotherkey
	"Hello"
	redis> 