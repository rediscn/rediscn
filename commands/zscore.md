---
layout: commands
title: zscore å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/zscore.html
disqusIdentifier: command_zscore
disqusUrl: http://redis.cn/commands/zscore.html
commandsType: sortedsets
---

Returns the score of `member` in the sorted set at `key`.

If `member` does not exist in the sorted set, or `key` does not exist, `nil` is
returned.

## ·µ»ØÖµ

@bulk-string-reply: the score of `member` (a double precision floating point number),
represented as string.

##Àý×Ó

```cli
ZADD myzset 1 "one"
ZSCORE myzset "one"
```
