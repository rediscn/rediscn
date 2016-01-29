---
layout: commands
title: zrevrangebyscore å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/zrevrangebyscore.html
disqusIdentifier: command_zrevrangebyscore
disqusUrl: http://redis.cn/commands/zrevrangebyscore.html
commandsType: sortedsets
---

Returns all the elements in the sorted set at `key` with a score between `max`
and `min` (including elements with score equal to `max` or `min`).
In contrary to the default ordering of sorted sets, for this command the
elements are considered to be ordered from high to low scores.

The elements having the same score are returned in reverse lexicographical
order.

Apart from the reversed ordering, `ZREVRANGEBYSCORE` is similar to
`ZRANGEBYSCORE`.

## ·µ»ØÖµ

@array-reply: list of elements in the specified score range (optionally
with their scores).

##Àý×Ó

```cli
ZADD myzset 1 "one"
ZADD myzset 2 "two"
ZADD myzset 3 "three"
ZREVRANGEBYSCORE myzset +inf -inf
ZREVRANGEBYSCORE myzset 2 1
ZREVRANGEBYSCORE myzset 2 (1
ZREVRANGEBYSCORE myzset (2 (1
```
