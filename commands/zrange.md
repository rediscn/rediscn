---
layout: commands
title: zrange 命令
permalink: commands/zrange.html
disqusIdentifier: command_zrange
disqusUrl: http://redis.cn/commands/zrange.html
commandsType: sortedsets
discuzTid: 1083
tranAuthor: wangqiang
---

返回存储在有序集合`key`中的指定范围的元素。
返回的元素可以认为是按得分从最低到最高排列。
如果得分相同，将按字典排序。

当你需要元素从最高分到最低分排列时，请参阅`ZREVRANGE`（相同的得分将使用字典倒序排序）。

参数`start`和`stop`都是基于零的索引，即`0`是第一个元素，`1`是第二个元素，以此类推。
它们也可以是负数，表示从有序集合的末尾的偏移量，其中`-1`是有序集合的最后一个元素，`-2`是倒数第二个元素，等等。

`start`和`stop`都是**全包含的区间**，因此例如`ZRANGE myzset 0 1`将会返回有序集合的第一个和第二个元素。

超出范围的索引不会产生错误。
如果`start`参数的值大于有序集合中的最大索引，或者`start > stop`，将会返回一个空列表。
如果`stop`的值大于有序集合的末尾，Redis会将其视为有序集合的最后一个元素。

可以传递`WITHSCORES`选项，以便将元素的分数与元素一起返回。这样，返回的列表将包含`value1,score1,...,valueN,scoreN`，而不是`value1,...,valueN`。
客户端类库可以自由地返回更合适的数据类型（建议：具有值和得分的数组或记录）。

## 返回值

[array-reply](/topics/protocol.html#array-reply)：给定范围内的元素列表（如果指定了`WITHSCORES`选项，将同时返回它们的得分）。

## 例子

```cli
ZADD myzset 1 "one"
ZADD myzset 2 "two"
ZADD myzset 3 "three"
ZRANGE myzset 0 -1
ZRANGE myzset 2 3
ZRANGE myzset -2 -1
```

以下例子使用`WITHSCORES`展示了该命令如何始终返回一个数组，但这次填充了*element_1*, *score_1*, *element_2*, *score_2*, ..., *element_N*, *score_N*。

```cli
ZRANGE myzset 0 1 WITHSCORES
```
