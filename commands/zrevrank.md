---
layout: commands
title: zrevrank å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/zrevrank.html
disqusIdentifier: command_zrevrank
disqusUrl: http://redis.cn/commands/zrevrank.html
commandsType: sortedsets
---

Returns the rank of `member` in the sorted set stored at `key`, with the scores
ordered from high to low.
The rank (or index) is 0-based, which means that the member with the highest
score has rank `0`.

Use `ZRANK` to get the rank of an element with the scores ordered from low to
high.

## ·µ»ØÖµ

* If `member` exists in the sorted set, @integer-reply: the rank of `member`.
* If `member` does not exist in the sorted set or `key` does not exist,
  @bulk-string-reply: `nil`.

##Àý×Ó

```cli
ZADD myzset 1 "one"
ZADD myzset 2 "two"
ZADD myzset 3 "three"
ZREVRANK myzset "one"
ZREVRANK myzset "four"
```
