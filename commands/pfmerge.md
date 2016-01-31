---
layout: commands
title: pfmerge 命令 -- Redis中文资料站
permalink: commands/pfmerge.html
disqusIdentifier: command_pfmerge
disqusUrl: http://redis.cn/commands/pfmerge.html
commandsType: hyperloglog
---

将多个 HyperLogLog 合并（merge）为一个 HyperLogLog ， 合并后的 HyperLogLog 的基数接近于所有输入 HyperLogLog 的可见集合（observed set）的并集.

合并得出的 HyperLogLog 会被储存在目标变量（第一个参数）里面， 如果该键并不存在， 那么命令在执行之前， 会先为该键创建一个空的.

##返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply): 这个命令只会返回 OK.

##例子

	redis> PFADD hll1 foo bar zap a
	(integer) 1
	redis> PFADD hll2 a b c foo
	(integer) 1
	redis> PFMERGE hll3 hll1 hll2
	OK
	redis> PFCOUNT hll3
	(integer) 6
	redis> 


