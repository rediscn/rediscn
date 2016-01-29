---
layout: commands
title: lpushx å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/lpushx.html
disqusIdentifier: command_lpushx
disqusUrl: http://redis.cn/commands/lpushx.html
commandsType: lists
---

Inserts `value` at the head of the list stored at `key`, only if `key` already
exists and holds a list.
In contrary to `LPUSH`, no operation will be performed when `key` does not yet
exist.

## ·µ»ØÖµ

@integer-reply: the length of the list after the push operation.

##Àý×Ó

```cli
LPUSH mylist "World"
LPUSHX mylist "Hello"
LPUSHX myotherlist "Hello"
LRANGE mylist 0 -1
LRANGE myotherlist 0 -1
```
