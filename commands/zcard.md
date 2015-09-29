---
layout: commands
title: zcard 命令 -- Redis中文资料站
permalink: commands/zcard.html
disqusIdentifier: command_zcard
disqusUrl: http://redis.cn/commands/zcard.html
commandsType: sortedsets
---

Returns the sorted set cardinality (number of elements) of the sorted set stored
at `key`.

@return

@integer-reply: the cardinality (number of elements) of the sorted set, or `0`
if `key` does not exist.

@examples

```cli
ZADD myzset 1 "one"
ZADD myzset 2 "two"
ZCARD myzset
```
