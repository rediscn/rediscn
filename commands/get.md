---
layout: commands
title: get å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/get.html
disqusIdentifier: command_get
disqusUrl: http://redis.cn/commands/get.html
commandsType: strings
---

Get the value of `key`.
If the key does not exist the special value `nil` is returned.
An error is returned if the value stored at `key` is not a string, because `GET`
only handles string values.

## ·µ»ØÖµ

@bulk-string-reply: the value of `key`, or `nil` when `key` does not exist.

##Àý×Ó

```cli
GET nonexisting
SET mykey "Hello"
GET mykey
```
