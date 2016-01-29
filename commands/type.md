---
layout: commands
title: type å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/type.html
disqusIdentifier: command_type
disqusUrl: http://redis.cn/commands/type.html
commandsType: keys
---

Returns the string representation of the type of the value stored at `key`.
The different types that can be returned are: `string`, `list`, `set`, `zset`
and `hash`.

## ·µ»ØÖµ

@simple-string-reply: type of `key`, or `none` when `key` does not exist.

##Àý×Ó

```cli
SET key1 "value"
LPUSH key2 "value"
SADD key3 "value"
TYPE key1
TYPE key2
TYPE key3
```
