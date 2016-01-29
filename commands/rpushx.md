---
layout: commands
title: rpushx å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/rpushx.html
disqusIdentifier: command_rpushx
disqusUrl: http://redis.cn/commands/rpushx.html
commandsType: lists
---

Inserts `value` at the tail of the list stored at `key`, only if `key` already
exists and holds a list.
In contrary to `RPUSH`, no operation will be performed when `key` does not yet
exist.

## ·µ»ØÖµ

@integer-reply: the length of the list after the push operation.

##Àý×Ó

```cli
RPUSH mylist "Hello"
RPUSHX mylist "World"
RPUSHX myotherlist "World"
LRANGE mylist 0 -1
LRANGE myotherlist 0 -1
```
