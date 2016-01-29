---
layout: commands
title: sinter å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/sinter.html
disqusIdentifier: command_sinter
disqusUrl: http://redis.cn/commands/sinter.html
commandsType: sets
---

Returns the members of the set resulting from the intersection of all the given
sets.

For example:

```
key1 = {a,b,c,d}
key2 = {c}
key3 = {a,c,e}
SINTER key1 key2 key3 = {c}
```

Keys that do not exist are considered to be empty sets.
With one of the keys being an empty set, the resulting set is also empty (since
set intersection with an empty set always results in an empty set).

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
SINTER key1 key2
```
