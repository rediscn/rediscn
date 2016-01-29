---
layout: commands
title: psetex å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/psetex.html
disqusIdentifier: command_psetex
disqusUrl: http://redis.cn/commands/psetex.html
commandsType: strings
---

`PSETEX` works exactly like `SETEX` with the sole difference that the expire
time is specified in milliseconds instead of seconds.

##Àý×Ó

```cli
PSETEX mykey 1000 "Hello"
PTTL mykey
GET mykey
```
