---
layout: commands
title: hstrlen å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/hstrlen.html
disqusIdentifier: command_hstrlen
disqusUrl: http://redis.cn/commands/hstrlen.html
commandsType: hashes
---

Returns the string length of the value associated with `field` in the hash stored at `key`. If the `key` or the `field` do not exist, 0 is returned.

## ·µ»ØÖµ

@integer-reply: the string length of the value associated with `field`, or zero when `field` is not present in the hash or `key` does not exist at all.

##Àý×Ó

```cli
HMSET myhash f1 HelloWorld f2 99 f3 -256
HSTRLEN myhash f1
HSTRLEN myhash f2
HSTRLEN myhash f3
```
