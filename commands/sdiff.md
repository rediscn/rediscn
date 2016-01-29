---
layout: commands
title: sdiff å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/sdiff.html
disqusIdentifier: command_sdiff
disqusUrl: http://redis.cn/commands/sdiff.html
commandsType: sets
---

Returns the members of the set resulting from the difference between the first
set and all the successive sets.

For example:

```
key1 = {a,b,c,d}
key2 = {c}
key3 = {a,c,e}
SDIFF key1 key2 key3 = {b,d}
```

Keys that do not exist are considered to be empty sets.

## ·µ»ØÖµ

@array-reply: list with members of the resulting set.

##Àý×Ó

```cli
SADD key1 "a"
SADD key1 "b"
SADD key1 "c"
SADD key2 "c"
SADD key2 "d"
SADD key2 "e"
SDIFF key1 key2
```
