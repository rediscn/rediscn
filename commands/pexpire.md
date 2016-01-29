---
layout: commands
title: pexpire å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/pexpire.html
disqusIdentifier: command_pexpire
disqusUrl: http://redis.cn/commands/pexpire.html
commandsType: keys
---

This command works exactly like `EXPIRE` but the time to live of the key is
specified in milliseconds instead of seconds.

@integer-reply, specifically:

* `1` if the timeout was set.
* `0` if `key` does not exist or the timeout could not be set.

##Àý×Ó

```cli
SET mykey "Hello"
PEXPIRE mykey 1500
TTL mykey
PTTL mykey
```
