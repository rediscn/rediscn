---
layout: commands
title: srandmember 命令
permalink: commands/srandmember.html
disqusIdentifier: command_srandmember
disqusUrl: http://redis.cn/commands/srandmember.html
commandsType: sets
discuzTid: 1062
tranAuthor: wangqiang
---

仅提供key参数，那么随机返回key集合中的一个元素.

Redis 2.6开始，可以接受 count 参数，如果count是整数且小于元素的个数，返回含有 count 个不同的元素的数组，如果count是个整数且大于集合中元素的个数时，仅返回整个集合的所有元素，当count是负数，则会返回一个包含count的绝对值的个数元素的数组，如果count的绝对值大于元素的个数，则返回的结果集里会出现一个元素出现多次的情况.

仅提供key参数时，该命令作用类似于SPOP命令，不同的是SPOP命令会将被选择的随机元素从集合中移除，而SRANDMEMBER仅仅是返回该随记元素，而不做任何操作.

## 返回值

[bulk-string-reply](/topics/protocol.html#bulk-string-reply): 不使用count 参数的情况下该命令返回随机的元素，如果key不存在则返回nil。

[array-reply](/topics/protocol.html#array-reply): 使用count参数,则返回一个随机的元素数组，如果key不存在则返回一个空的数组。

## 举例

	redis> SADD myset one two three
	(integer) 3
	redis> SRANDMEMBER myset
	"one"
	redis> SRANDMEMBER myset 2
	1) "three"
	2) "one"
	redis> SRANDMEMBER myset -5
	1) "one"
	2) "one"
	3) "one"
	4) "one"
	5) "one"
	redis> 

## 传递count参数时的行为规范

当传递了一个值为正数的count参数，返回的元素就好像从集合中移除了每个选中的元素一样（就像在宾果游戏中提取数字一样）。但是**元素不会从集合中移除**。所以基本上：

* 不会返回重复的元素。
* 如果count参数的值大于集合内的元素数量，此命令将会仅返回整个集合，没有额外的元素。

相反，当count参数的值为负数时，此命令的行为将发生改变，并且提取操作就像在每次提取后，重新将取出的元素放回包里一样，因此，可能返回重复的元素，以及总是会返回我们请求的数量的元素，因为我们可以一次又一次地重复相同的元素，除了当集合为空（或者不存在key）的时候，将总是会返回一个空数组。

## 返回元素的分布

当集合中的元素数量很少时，返回元素分布远不够完美，这是因为我们使用了一个近似随机元素函数，它并不能保证良好的分布。

所使用的算法（在dict.c中实现）对哈希表桶进行采样以找到非空桶。一旦找到非空桶，由于我们在哈希表的实现中使用了链接法，因此会检查桶中的元素数量，并且选出一个随机元素。

这意味着，如果你在整个哈希表中有两个非空桶，其中一个有三个元素，另一个只有一个元素，那么其桶中单独存在的元素将以更高的概率返回。
