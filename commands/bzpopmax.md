---
layout: commands
title: BZPOPMAX 命令
permalink: commands/bzpopmax.html
disqusIdentifier: command_bzpopmax
disqusUrl: http://redis.cn/commands/bzpopmax.html
commandsType: sortedsets
discuzTid: 13899
---


`BZPOPMAX` is the blocking variant of the sorted set `ZPOPMAX` primitive.
`BZPOPMAX` 是有序集合命令 `ZPOPMAX`带有阻塞功能的版本。

It is the blocking version because it blocks the connection when there are no
members to pop from any of the given sorted sets.
A member with the highest score is popped from first sorted set that is
non-empty, with the given keys being checked in the order that they are given.
在参数中的所有有序集合均为空的情况下，阻塞连接。参数中包含多个有序集合时，按照参数中key的顺序，返回第一个非空key中分数最大的成员和对应的分数


The `timeout` argument is interpreted as an integer value specifying the maximum
number of seconds to block. A timeout of zero can be used to block indefinitely.
参数 `timeout` 可以理解为客户端被阻塞的最大秒数值，0 表示永久阻塞。

See the [BZPOPMIN documentation][cb] for the exact semantics, since `BZPOPMAX`
is identical to `BZPOPMIN` with the only difference being that it pops members
with the highest scores instead of popping the ones with the lowest scores.
详细说明请参照[BZPOPMIN 说明文档][cb]，`BZPOPMAX`返回非空有序集合 key中分数最大的成员，而`BZPOPMIN`返回该key中分数最小的成员，除此之外，两条命令无其他差别。 

[cb]: [/commands/bzpopmin.html](/commands/bzpopmin.html)

## 返回值

[array-reply](/topics/protocol.html#array-reply): specifically:

* A `nil` multi-bulk when no element could be popped and the timeout expired.
当有序集合无结果返回且超时设置过期时返回 `nil`
* A three-element multi-bulk with the first element being the name of the key
  where a member was popped, the second element being the score of the popped
  member, and the third element being the popped member itself.
返回格式化后输出结果，格式如下，第一部分key名称，第二部分成员名称，第三部分分数  

## 例子

```
redis> DEL zset1 zset2
(integer) 0
redis> ZADD zset1 0 a 1 b 2 c
(integer) 3
redis> BZPOPMAX zset1 zset2 0
1) "zet1"
2) "2"
2) "c"
```
