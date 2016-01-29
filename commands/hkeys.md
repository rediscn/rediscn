---
layout: commands
title: hkeys å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/hkeys.html
disqusIdentifier: command_hkeys
disqusUrl: http://redis.cn/commands/hkeys.html
commandsType: hashes
---

Returns all field names in the hash stored at `key`.

## ·µ»ØÖµ

@array-reply: list of fields in the hash, or an empty list when `key` does
not exist.

##Àý×Ó

```cli
HSET myhash field1 "Hello"
HSET myhash field2 "World"
HKEYS myhash
```
