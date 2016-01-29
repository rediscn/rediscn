---
layout: commands
title: llen å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/llen.html
disqusIdentifier: command_llen
disqusUrl: http://redis.cn/commands/llen.html
commandsType: lists
---

Returns the length of the list stored at `key`.
If `key` does not exist, it is interpreted as an empty list and `0` is returned.
An error is returned when the value stored at `key` is not a list.

## ·µ»ØÖµ

@integer-reply: the length of the list at `key`.

##Àý×Ó

```cli
LPUSH mylist "World"
LPUSH mylist "Hello"
LLEN mylist
```
