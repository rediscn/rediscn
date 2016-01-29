---
layout: commands
title: zremrangebyrank å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/zremrangebyrank.html
disqusIdentifier: command_zremrangebyrank
disqusUrl: http://redis.cn/commands/zremrangebyrank.html
commandsType: sortedsets
---

Removes all elements in the sorted set stored at `key` with rank between `start`
and `stop`.
Both `start` and `stop` are `0` -based indexes with `0` being the element with
the lowest score.
These indexes can be negative numbers, where they indicate offsets starting at
the element with the highest score.
For example: `-1` is the element with the highest score, `-2` the element with
the second highest score and so forth.

## ·µ»ØÖµ

@integer-reply: the number of elements removed.

##Àý×Ó

```cli
ZADD myzset 1 "one"
ZADD myzset 2 "two"
ZADD myzset 3 "three"
ZREMRANGEBYRANK myzset 0 1
ZRANGE myzset 0 -1 WITHSCORES
```
