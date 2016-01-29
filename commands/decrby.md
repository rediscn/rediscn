---
layout: commands
title: decrby å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/decrby.html
disqusIdentifier: command_decrby
disqusUrl: http://redis.cn/commands/decrby.html
commandsType: strings
---

Decrements the number stored at `key` by `decrement`.
If the key does not exist, it is set to `0` before performing the operation.
An error is returned if the key contains a value of the wrong type or contains a
string that can not be represented as integer.
This operation is limited to 64 bit signed integers.

See `INCR` for extra information on increment/decrement operations.

## ·µ»ØÖµ

@integer-reply: the value of `key` after the decrement

##Àý×Ó

```cli
SET mykey "10"
DECRBY mykey 3
```
