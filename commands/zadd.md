---
layout: commands
title: zadd 命令
permalink: commands/zadd.html
disqusIdentifier: command_zadd
disqusUrl: http://redis.cn/commands/zadd.html
commandsType: sortedsets
---

将所有指定成员添加到键为`key`有序集合（sorted set）里面。
添加时可以指定多个分数/成员（score/member）对。
如果指定添加的成员已经是有序集合里面的成员，则会更新改成员的分数（scrore）并更新到正确的排序位置。

如果`key`不存在，将会创建一个新的有序集合（sorted set）并将分数/成员（score/member）对添加到有序集合，就像原来存在一个空的有序集合一样。如果`key`存在，但是类型不是有序集合，将会返回一个错误应答。

分数值是一个双精度的浮点型数字字符串。`+inf`和`-inf`都是有效值。

ZADD 参数（options） (>= Redis 3.0.2)
---

ZADD 命令在`key`后面分数/成员（score/member）对前面支持一些参数，他们是：

* **XX**: 仅仅更新存在的成员，不添加新成员。
* **NX**: 不更新存在的成员。只添加新成员。
* **CH**: 修改返回值为发生变化的成员总数，原始是返回新添加成员的总数 (CH 是 *changed* 的意思)。更改的元素是**新添加的成员**，已经存在的成员**更新分数**。 所以在命令中指定的成员有相同的分数将不被计算在内。注：在通常情况下，`ZADD`返回值只计算新添加成员的数量。
* **INCR**: 当`ZADD`指定这个选项时，成员的操作就等同[ZINCRBY](/commands/zincrby.html)命令，对成员的分数进行递增操作。

分数可以精确的表示的整数的范围
---

Redis 有序集合的分数使用*双精度64位浮点数*。我们支持所有的架构，这表示为一个**IEEE 754 floating point number**，它能包括的整数范围是`-(2^53)` 到 `+(2^53)`。或者说是-9007199254740992 到 9007199254740992。更大的整数在内部用指数形式表示，所以，如果为分数设置一个非常大的整数，你得到的是一个近似的十进制数。

Sorted sets 101
---

有序集合按照分数以递增的方式进行排序。相同的成员（member）只存在一次，有序集合不允许存在重复的成员。
分数可以通过`ZADD`命令进行更新或者也可以通过`ZINCRBY`命令递增来修改之前的值，相应的他们的排序位置也会随着分数变化而改变。

获取一个成员当前的分数可以使用[ZSCORE](/commands/zscore.html)命令，也可以用它来验证成员是否存在。

更多关于有序集合的信息请参考[数据类型-有序集合](/topics/data-types.html#sorted-sets)。

相同分数的成员
---

有序集合里面的成员是不能重复的都是唯一的，但是，不同成员间有可能*有相同的分数*。当多个成员有相同的分数时，他们将是*有序的字典*（ordered lexicographically）（仍由分数作为第一排序条件，然后，相同分数的成员按照字典规则相对排序）。

字典顺序排序用的是二进制，它比较的是字符串的字节数组。

如果用户将所有元素设置相同分数（例如0），有序集合里面的所有元素将按照字典顺序进行排序，范围查询元素可以使用[ZRANGEBYLEX](/commands/zrangebylex.html)命令（注：范围查询分数可以使用[ZRANGEBYSCORE](/commands/zrangebyscore.html)命令）。

## 返回值

[Integer reply](/topics/protocol.html#integer-reply), 包括:

* 添加到有序集合的成员数量，不包括已经存在更新分数的成员。

如果指定`INCR`参数, 返回将会变成[bulk-string-reply](/topics/protocol.html#bulk-string-reply) ：

* 成员的新分数（双精度的浮点型数字）字符串。

## 历史

* `>= 2.4`: 接受多个成员。
  在Redis 2.4以前，命令只能添加或者更新一个成员。

##例子

	redis> ZADD myzset 1 "one"
	(integer) 1
	redis> ZADD myzset 1 "uno"
	(integer) 1
	redis> ZADD myzset 2 "two" 3 "three"
	(integer) 2
	redis> ZRANGE myzset 0 -1 WITHSCORES
	1) "one"
	2) "1"
	3) "uno"
	4) "1"
	5) "two"
	6) "2"
	7) "three"
	8) "3"
	redis> 
