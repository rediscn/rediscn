---
layout: commands
title: hexists å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/hexists.html
disqusIdentifier: command_hexists
disqusUrl: http://redis.cn/commands/hexists.html
commandsType: hashes
---

Returns if `field` is an existing field in the hash stored at `key`.

## ·µ»ØÖµ

@integer-reply, specifically:

* `1` if the hash contains `field`.
* `0` if the hash does not contain `field`, or `key` does not exist.

##Àý×Ó

```cli
HSET myhash field1 "foo"
HEXISTS myhash field1
HEXISTS myhash field2
```
