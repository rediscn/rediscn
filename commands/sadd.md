---
layout: commands
title: sadd å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/sadd.html
disqusIdentifier: command_sadd
disqusUrl: http://redis.cn/commands/sadd.html
commandsType: sets
---

Add the specified members to the set stored at `key`.
Specified members that are already a member of this set are ignored.
If `key` does not exist, a new set is created before adding the specified
members.

An error is returned when the value stored at `key` is not a set.

## ·µ»ØÖµ

@integer-reply: the number of elements that were added to the set, not including
all the elements already present into the set.

@history

* `>= 2.4`: Accepts multiple `member` arguments.
  Redis versions before 2.4 are only able to add a single member per call.

##Àý×Ó

```cli
SADD myset "Hello"
SADD myset "World"
SADD myset "World"
SMEMBERS myset
```
