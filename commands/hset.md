---
layout: commands
title: hset å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/hset.html
disqusIdentifier: command_hset
disqusUrl: http://redis.cn/commands/hset.html
commandsType: hashes
---

Sets `field` in the hash stored at `key` to `value`.
If `key` does not exist, a new key holding a hash is created.
If `field` already exists in the hash, it is overwritten.

## ·µ»ØÖµ

@integer-reply, specifically:

* `1` if `field` is a new field in the hash and `value` was set.
* `0` if `field` already exists in the hash and the value was updated.

##Àý×Ó

```cli
HSET myhash field1 "Hello"
HGET myhash field1
```
