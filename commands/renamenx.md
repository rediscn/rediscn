---
layout: commands
title: renamenx å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/renamenx.html
disqusIdentifier: command_renamenx
disqusUrl: http://redis.cn/commands/renamenx.html
commandsType: keys
---

Renames `key` to `newkey` if `newkey` does not yet exist.
It returns an error under the same conditions as `RENAME`.

## ·µ»ØÖµ

@integer-reply, specifically:

* `1` if `key` was renamed to `newkey`.
* `0` if `newkey` already exists.

##Àý×Ó

```cli
SET mykey "Hello"
SET myotherkey "World"
RENAMENX mykey myotherkey
GET myotherkey
```
