---
layout: commands
title: zcard å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/zcard.html
disqusIdentifier: command_zcard
disqusUrl: http://redis.cn/commands/zcard.html
commandsType: sortedsets
---

Returns the sorted set cardinality (number of elements) of the sorted set stored
at `key`.

## ·µ»ØÖµ

@integer-reply: the cardinality (number of elements) of the sorted set, or `0`
if `key` does not exist.

##Àý×Ó

```cli
ZADD myzset 1 "one"
ZADD myzset 2 "two"
ZCARD myzset
```
