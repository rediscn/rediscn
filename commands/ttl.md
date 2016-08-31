---
layout: commands
title: ttl 命令
permalink: commands/ttl.html
disqusIdentifier: command_ttl
disqusUrl: http://redis.cn/commands/ttl.html
commandsType: keys
discuzTid: 1071
---

返回key剩余的过期时间。
这种反射能力允许Redis客户端检查指定key在数据集里面剩余的有效期。

在Redis 2.6和之前版本，如果key不存在或者已过期时返回`-1`。

从Redis2.8开始，错误返回值的结果有如下改变：

* 如果key不存在或者已过期，返回 `-2` 
* 如果key没有设置过期时间（永久有效），返回 `-1` 。

另见[PTTL](/commands/pttl.html)命令返回相同的信息，只不过他的时间单位是毫秒（仅适用于Redis 2.6及更高版本）。

## 返回值

[Integer reply](/topics/protocol.html#integer-reply)： key有效的秒数（TTL in seconds）,或者一个负值的错误 (参考上文)。

##例子
	
	redis> SET mykey "Hello"
	OK
	redis> EXPIRE mykey 10 # 设置mykey 10秒后过期
	(integer) 1
	redis> TTL mykey # 查看mykey剩余的过期时间
	(integer) 10
	redis> 
