---
layout: commands
title: strlen å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/strlen.html
disqusIdentifier: command_strlen
disqusUrl: http://redis.cn/commands/strlen.html
commandsType: strings
---

Returns the length of the string value stored at `key`.
An error is returned when `key` holds a non-string value.

## ·µ»ØÖµ

@integer-reply: the length of the string at `key`, or `0` when `key` does not
exist.

##Àý×Ó

```cli
SET mykey "Hello world"
STRLEN mykey
STRLEN nonexisting
```
