---
layout: commands
title: BZPOPMIN 命令
permalink: commands/bzpopmin.html
disqusIdentifier: command_bzpopmin
disqusUrl: http://redis.cn/commands/bzpopmin.html
commandsType: sortedsets
discuzTid: 13900
---


`BZPOPMIN` is the blocking variant of the sorted set `ZPOPMIN` primitive
`BZPOPMIN` 是有序集合命令 `ZPOPMIN`带有阻塞功能的版本。

It is the blocking version because it blocks the connection when there are no
members to pop from any of the given sorted sets.
A member with the lowest score is popped from first sorted set that is
non-empty, with the given keys being checked in the order that they are given.
在参数中的所有有序集合均为空的情况下，阻塞连接。参数中包含多个有序集合时，按照参数中key的顺序，返回第一个非空key中分数最小的成员和对应的分数

The `timeout` argument is interpreted as an integer value specifying the maximum
number of seconds to block. A timeout of zero can be used to block indefinitely.
参数 `timeout` 可以理解为客户端被阻塞的最大秒数值，0 表示永久阻塞。

See the [BLPOP documentation][cl] for the exact semantics, since `BZPOPMIN` is
identical to `BLPOP` with the only difference being the data structure being
popped from.

详细说明请参照[BLPOP 说明文档][cb]，`BZPOPMIN`适用有序集合类型的key，BLPOP适用列表类型的key，除此之外，两条命令无其他差别。 

[cl]: /commands/blpop

## 返回值

[array-reply](/topics/protocol.html#array-reply)

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
redis> BZPOPMIN zset1 zset2 0
1) "zet1"
2) "0"
2) "a"
```
