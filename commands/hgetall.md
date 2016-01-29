---
layout: commands
title: hgetall å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/hgetall.html
disqusIdentifier: command_hgetall
disqusUrl: http://redis.cn/commands/hgetall.html
commandsType: hashes
---

Returns all fields and values of the hash stored at `key`.
In the returned value, every field name is followed by its value, so the length
of the reply is twice the size of the hash.

## ·µ»ØÖµ

@array-reply: list of fields and their values stored in the hash, or an
empty list when `key` does not exist.

##Àý×Ó

```cli
HSET myhash field1 "Hello"
HSET myhash field2 "World"
HGETALL myhash
```
