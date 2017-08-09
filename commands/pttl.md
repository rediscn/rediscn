---
layout: commands
title: pttl 命令
permalink: commands/pttl.html
disqusIdentifier: command_pttl
disqusUrl: http://redis.cn/commands/pttl.html
commandsType: keys
discuzTid: 1020
---

这个命令类似于[TTL](/commands/ttl.html)命令，但它以毫秒为单位返回 key 的剩余生存时间，而不是像[TTL](/commands/ttl.html)命令那样，以秒为单位。

在Redis 2.6和之前版本，如果key不存在或者key存在且无过期时间将返回`-1`。

从 Redis 2.8开始，错误返回值发送了如下变化：

* 如果key不存在返回`-2`
* 如果key存在且无过期时间返回`-1`

##返回值

[integer-reply](/topics/protocol.html#integer-reply): [TTL](/commands/ttl.html)以毫秒为单位,或者返回一个错误值 (参考上面的描述).

##例子

	redis> SET mykey "Hello"
	OK
	redis> EXPIRE mykey 1
	(integer) 1
	redis> PTTL mykey
	(integer) 999
	redis> 
