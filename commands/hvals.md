---
layout: commands
title: hvals å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/hvals.html
disqusIdentifier: command_hvals
disqusUrl: http://redis.cn/commands/hvals.html
commandsType: hashes
---

Returns all values in the hash stored at `key`.

## ·µ»ØÖµ

@array-reply: list of values in the hash, or an empty list when `key` does
not exist.

##Àý×Ó

```cli
HSET myhash field1 "Hello"
HSET myhash field2 "World"
HVALS myhash
```
