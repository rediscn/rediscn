---
layout: commands
title: srandmember 命令
permalink: commands/srandmember.html
disqusIdentifier: command_srandmember
disqusUrl: http://redis.cn/commands/srandmember.html
commandsType: sets
discuzTid: 1062
---

仅提供key参数,那么随机返回key集合中的一个元素.

Redis 2.6开始, 可以接受 count 参数,如果count是整数且小于元素的个数，返回含有 count 个不同的元素的数组,如果count是个整数且大于集合中元素的个数时,仅返回整个集合的所有元素,当count是负数,则会返回一个包含count的绝对值的个数元素的数组，如果count的绝对值大于元素的个数,则返回的结果集里会出现一个元素出现多次的情况.

仅提供key参数时,该命令作用类似于SPOP命令, 不同的是SPOP命令会将被选择的随机元素从集合中移除, 而SRANDMEMBER仅仅是返回该随记元素,而不做任何操作.

## 返回值

[bulk-string-reply](/topics/protocol.html#bulk-string-reply): 不使用count 参数的情况下该命令返回随机的元素,如果key不存在则返回nil.

[array-reply](/topics/protocol.html#array-reply): 使用count参数,则返回一个随机的元素数组,如果key不存在则返回一个空的数组.

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

## Specification of the behavior when count is passed

When a count argument is passed and is positive, the elements are returned
as if every selected element is removed from the set (like the extraction
of numbers in the game of Bingo). However elements are **not removed** from
the Set. So basically:

* No repeated elements are returned.
* If count is bigger than the number of elements inside the Set, the command will only return the whole set without additional elements.

When instead the count is negative, the behavior changes and the extraction happens as if you put the extracted element inside the bag again after every extraction, so repeated elements are possible, and the number of elements requested is always returned as we can repeat the same elements again and again, with the exception of an empty Set (non existing key) that will always produce an empty array as a result.

## Distribution of returned elements

The distribution of the returned elements is far from perfect when the number of elements in the set is small, this is due to the fact that we used an approximated random element function that does not really guarantees good distribution.

The algorithm used, that is implemented inside dict.c, samples the hash table buckets to find a non-empty one. Once a non empty bucket is found, since we use chaining in our hash table implementation, the number of elements inside the bucked is checked and a random element is selected.

This means that if you have two non-empty buckets in the entire hash table, and one has three elements while one has just one, the element that is alone in its bucket will be returned with much higher probability.
