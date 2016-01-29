---
layout: commands
title: pexpireat å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/pexpireat.html
disqusIdentifier: command_pexpireat
disqusUrl: http://redis.cn/commands/pexpireat.html
commandsType: keys
---

`PEXPIREAT` has the same effect and semantic as `EXPIREAT`, but the Unix time at
which the key will expire is specified in milliseconds instead of seconds.

## ·µ»ØÖµ

@integer-reply, specifically:

* `1` if the timeout was set.
* `0` if `key` does not exist or the timeout could not be set (see: `EXPIRE`).

##Àý×Ó

```cli
SET mykey "Hello"
PEXPIREAT mykey 1555555555005
TTL mykey
PTTL mykey
```
