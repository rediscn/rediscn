---
layout: commands
title: hget å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/hget.html
disqusIdentifier: command_hget
disqusUrl: http://redis.cn/commands/hget.html
commandsType: hashes
---

Returns the value associated with `field` in the hash stored at `key`.

## ·µ»ØÖµ

@bulk-string-reply: the value associated with `field`, or `nil` when `field` is not
present in the hash or `key` does not exist.

##Àý×Ó

```cli
HSET myhash field1 "foo"
HGET myhash field1
HGET myhash field2
```
