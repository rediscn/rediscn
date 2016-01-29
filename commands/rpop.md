---
layout: commands
title: rpop å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/rpop.html
disqusIdentifier: command_rpop
disqusUrl: http://redis.cn/commands/rpop.html
commandsType: lists
---

Removes and returns the last element of the list stored at `key`.

## ·µ»ØÖµ

@bulk-string-reply: the value of the last element, or `nil` when `key` does not exist.

##Àý×Ó

```cli
RPUSH mylist "one"
RPUSH mylist "two"
RPUSH mylist "three"
RPOP mylist
LRANGE mylist 0 -1
```
