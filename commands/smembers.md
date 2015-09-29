---
layout: commands
title: smembers 命令 -- Redis中文资料站
permalink: commands/smembers.html
disqusIdentifier: command_smembers
disqusUrl: http://redis.cn/commands/smembers.html
commandsType: keys
---

Returns all the members of the set value stored at `key`.

This has the same effect as running `SINTER` with one argument `key`.

@return

@array-reply: all elements of the set.

@examples

```cli
SADD myset "Hello"
SADD myset "World"
SMEMBERS myset
```
