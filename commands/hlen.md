---
layout: commands
title: hlen å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/hlen.html
disqusIdentifier: command_hlen
disqusUrl: http://redis.cn/commands/hlen.html
commandsType: hashes
---

Returns the number of fields contained in the hash stored at `key`.

## ·µ»ØÖµ

@integer-reply: number of fields in the hash, or `0` when `key` does not exist.

##Àý×Ó

```cli
HSET myhash field1 "Hello"
HSET myhash field2 "World"
HLEN myhash
```
