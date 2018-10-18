---
layout: commands
title: pfadd 命令
permalink: commands/pfadd.html
disqusIdentifier: command_pfadd
disqusUrl: http://redis.cn/commands/pfadd.html
commandsType: hyperloglog
discuzTid: 1014
---

将除了第一个参数以外的参数存储到以第一个参数为变量名的HyperLogLog结构中.

这个命令的一个副作用是它可能会更改这个HyperLogLog的内部来反映在每添加一个唯一的对象时估计的基数(集合的基数).

如果一个HyperLogLog的估计的近似基数在执行命令过程中发了变化， [PFADD](/commands/pfadd.html) 返回1，否则返回0，如果指定的key不存在，这个命令会自动创建一个空的HyperLogLog结构（指定长度和编码的字符串）.

如果在调用该命令时仅提供变量名而不指定元素也是可以的，如果这个变量名存在，则不会有任何操作，如果不存在，则会创建一个数据结构（返回1）.

了解更多HyperLogLog数据结构，请查阅[PFCOUNT](/commands/pfcount.html)命令页面.

## 返回值

[integer-reply](/topics/protocol.html#integer-reply)

- 如果 HyperLogLog 的内部被修改了,那么返回 1,否则返回 0 .

## 例子

	redis> PFADD hll a b c d e f g
	(integer) 1
	redis> PFCOUNT hll
	(integer) 7
	redis> 
