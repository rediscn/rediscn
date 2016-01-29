---
layout: commands
title: sinterstore å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/sinterstore.html
disqusIdentifier: command_sinterstore
disqusUrl: http://redis.cn/commands/sinterstore.html
commandsType: sets
---

This command is equal to `SINTER`, but instead of returning the resulting set,
it is stored in `destination`.

If `destination` already exists, it is overwritten.

## ·µ»ØÖµ

@integer-reply: the number of elements in the resulting set.

##Àý×Ó

```cli
SADD key1 "a"
SADD key1 "b"
SADD key1 "c"
SADD key2 "c"
SADD key2 "d"
SADD key2 "e"
SINTERSTORE key key1 key2
SMEMBERS key
```
