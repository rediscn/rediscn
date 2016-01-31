---
layout: commands
title: pexpireat 命令 -- Redis中文资料站
permalink: commands/pexpireat.html
disqusIdentifier: command_pexpireat
disqusUrl: http://redis.cn/commands/pexpireat.html
commandsType: keys
---

`PEXPIREAT` 这个命令和[EXPIREAT](/commands/expireat.html)命令类似，但它以毫秒为单位设置 key 的过期 `unix` 时间戳，而不是像[EXPIREAT](/commands/expireat.html)那样，以秒为单位。

##返回值

[integer-reply](/topics/protocol.html#integer-reply), 只有以下两种值:

- 如果生存时间设置成功，返回 1 。
- 当 key 不存在或没办法设置生存时间时，返回 0 。 (查看: [EXPIRE](/commands/expire.html)命令获取更多信息).

##例子

	redis> SET mykey "Hello"
	OK
	redis> PEXPIREAT mykey 1555555555005
	(integer) 1
	redis> TTL mykey
	(integer) 192569170
	redis> PTTL mykey
	(integer) 192569169649
	redis> 