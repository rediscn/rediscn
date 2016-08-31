---
layout: commands
title: renamenx 命令
permalink: commands/renamenx.html
disqusIdentifier: command_renamenx
disqusUrl: http://redis.cn/commands/renamenx.html
commandsType: keys
discuzTid: 1029
---

当且仅当 newkey 不存在时，将 key 改名为 newkey 。

当 key 不存在时，返回一个错误。

##返回值

[integer-reply](/topics/protocol.html#integer-reply)：

- 修改成功时，返回 1 。
- 如果 newkey 已经存在，返回 0 。

##例子

	redis> SET mykey "Hello"
	OK
	redis> SET myotherkey "World"
	OK
	redis> RENAMENX mykey myotherkey
	(integer) 0
	redis> GET myotherkey
	"World"
	redis> 