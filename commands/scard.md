---
layout: commands
title: scard 命令 -- Redis中文资料站
permalink: commands/scard.html
disqusIdentifier: command_scard
disqusUrl: http://redis.cn/commands/scard.html
commandsType: sets
---

Returns the set cardinality (number of elements) of the set stored at `key`.

@return

@integer-reply: the cardinality (number of elements) of the set, or `0` if `key`
does not exist.

@examples

```cli
SADD myset "Hello"
SADD myset "World"
SCARD myset
```
