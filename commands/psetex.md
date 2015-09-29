---
layout: commands
title: psetex 命令 -- Redis中文资料站
permalink: commands/psetex.html
disqusIdentifier: command_psetex
disqusUrl: http://redis.cn/commands/psetex.html
commandsType: strings
---

`PSETEX` works exactly like `SETEX` with the sole difference that the expire
time is specified in milliseconds instead of seconds.

@examples

```cli
PSETEX mykey 1000 "Hello"
PTTL mykey
GET mykey
```
