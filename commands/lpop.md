---
layout: commands
title: lpop å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/lpop.html
disqusIdentifier: command_lpop
disqusUrl: http://redis.cn/commands/lpop.html
commandsType: lists
---

Removes and returns the first element of the list stored at `key`.

## ·µ»ØÖµ

@bulk-string-reply: the value of the first element, or `nil` when `key` does not exist.

##Àý×Ó

```cli
RPUSH mylist "one"
RPUSH mylist "two"
RPUSH mylist "three"
LPOP mylist
LRANGE mylist 0 -1
```
