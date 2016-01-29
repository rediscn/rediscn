---
layout: commands
title: scard å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/scard.html
disqusIdentifier: command_scard
disqusUrl: http://redis.cn/commands/scard.html
commandsType: sets
---

Returns the set cardinality (number of elements) of the set stored at `key`.

## ·µ»ØÖµ

@integer-reply: the cardinality (number of elements) of the set, or `0` if `key`
does not exist.

##Àý×Ó

```cli
SADD myset "Hello"
SADD myset "World"
SCARD myset
```
