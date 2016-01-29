---
layout: commands
title: sismember å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/sismember.html
disqusIdentifier: command_sismember
disqusUrl: http://redis.cn/commands/sismember.html
commandsType: sets
---

Returns if `member` is a member of the set stored at `key`.

## ·µ»ØÖµ

@integer-reply, specifically:

* `1` if the element is a member of the set.
* `0` if the element is not a member of the set, or if `key` does not exist.

##Àý×Ó

```cli
SADD myset "one"
SISMEMBER myset "one"
SISMEMBER myset "two"
```
