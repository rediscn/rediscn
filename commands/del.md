---
layout: commands
title: del å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/del.html
disqusIdentifier: command_del
disqusUrl: http://redis.cn/commands/del.html
commandsType: keys
---

Removes the specified keys.
A key is ignored if it does not exist.

## ·µ»ØÖµ

@integer-reply: The number of keys that were removed.

##Àý×Ó

```cli
SET key1 "Hello"
SET key2 "World"
DEL key1 key2 key3
```
