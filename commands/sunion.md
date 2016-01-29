---
layout: commands
title: sunion å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/sunion.html
disqusIdentifier: command_sunion
disqusUrl: http://redis.cn/commands/sunion.html
commandsType: sets
---

Returns the members of the set resulting from the union of all the given sets.

For example:

```
key1 = {a,b,c,d}
key2 = {c}
key3 = {a,c,e}
SUNION key1 key2 key3 = {a,b,c,d,e}
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
SUNION key1 key2
```
