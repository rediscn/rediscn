---
layout: commands
title: smembers å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/smembers.html
disqusIdentifier: command_smembers
disqusUrl: http://redis.cn/commands/smembers.html
commandsType: sets
---

Returns all the members of the set value stored at `key`.

This has the same effect as running `SINTER` with one argument `key`.

## ·µ»ØÖµ

@array-reply: all elements of the set.

##Àý×Ó

```cli
SADD myset "Hello"
SADD myset "World"
SMEMBERS myset
```
