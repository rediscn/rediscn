---
layout: commands
title: pfcount 命令
permalink: commands/pfcount.html
disqusIdentifier: command_pfcount
disqusUrl: http://redis.cn/commands/pfcount.html
commandsType: hyperloglog
discuzTid: 1015
---

当参数为一个key时,返回存储在HyperLogLog结构体的该变量的近似基数，如果该变量不存在,则返回0.

当参数为多个key时，返回这些HyperLogLog并集的近似基数，这个值是将所给定的所有key的HyperLoglog结构合并到一个临时的HyperLogLog结构中计算而得到的.

HyperLogLog可以使用固定且很少的内存（每个HyperLogLog结构需要12K字节再加上key本身的几个字节）来存储集合的唯一元素.

返回的可见集合基数并不是精确值， 而是一个带有 0.81% 标准错误（standard error）的近似值.

例如为了记录一天会执行多少次各不相同的搜索查询， 一个程序可以在每次执行搜索查询时调用一次[PFADD](/commands/pfadd.html)， 并通过调用[PFCOUNT](/commands/pfcount.html)命令来获取这个记录的近似结果.

注意: 这个命令的一个副作用是可能会导致HyperLogLog内部被更改，出于缓存的目的,它会用8字节的来记录最近一次计算得到基数,所以[PFCOUNT](/commands/pfcount.html)命令在技术上是个写命令.

## 返回值

[integer-reply](/topics/protocol.html#integer-reply):

[PFADD](/commands/pfadd.html)添加的唯一元素的近似数量.

## 例子

	redis> PFADD hll foo bar zap
	(integer) 1
	redis> PFADD hll zap zap zap
	(integer) 0
	redis> PFADD hll foo bar
	(integer) 0
	redis> PFCOUNT hll
	(integer) 3
	redis> PFADD some-other-hll 1 2 3
	(integer) 1
	redis> PFCOUNT hll some-other-hll
	(integer) 6
	redis> 

##性能

当调用[PFCOUNT](/commands/pfcount.html)命令时指定一个key为参数,性能表现很好，甚至和处理一个HyperLogLog所需要的时间一样短.这可能和[PFCOUNT](/commands/pfcount.html)命令能够直接使用缓存的的估计基数有关，大多数的[PFADD](/commands/pfadd.html)也不会更新任何寄存器，所以这个值也很少被更改.理论上能达到每秒几百次操作.

当调用[PFCOUNT](/commands/pfcount.html)命令时指定多个key,由于要在多个HperLogLog结构中执行一比较慢合并操作,而且这个通过并集计算得到的基数是不能够被缓存, [PFCOUNT](/commands/pfcount.html)命令还要消耗毫秒量级的时间来进行多个key的并集操作，消耗的时间会比较长一些，所以不要滥用这种多个key的方式.

使用者需要明白这个命令来处理1个key和多个key执行的语义是不同的，并且执行的性能也不相同.

更多的信息请参考[这篇文章](http://antirez.com/news/75). 源代码 hyperloglog.c文件也很简单易理解， 包含了稀松与密集两种实现的编码.