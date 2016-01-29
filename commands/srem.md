---
layout: commands
title: srem å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/srem.html
disqusIdentifier: command_srem
disqusUrl: http://redis.cn/commands/srem.html
commandsType: sets
---

Remove the specified members from the set stored at `key`.
Specified members that are not a member of this set are ignored.
If `key` does not exist, it is treated as an empty set and this command returns
`0`.

An error is returned when the value stored at `key` is not a set.

## ·µ»ØÖµ

@integer-reply: the number of members that were removed from the set, not
including non existing members.

@history

* `>= 2.4`: Accepts multiple `member` arguments.
  Redis versions older than 2.4 can only remove a set member per call.

##Àý×Ó

```cli
SADD myset "one"
SADD myset "two"
SADD myset "three"
SREM myset "one"
SREM myset "four"
SMEMBERS myset
```
