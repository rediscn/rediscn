---
layout: commands
title: zscore 命令 -- Redis中文资料站
permalink: commands/zscore.html
disqusIdentifier: command_zscore
disqusUrl: http://redis.cn/commands/zscore.html
commandsType: sortedsets
---

Returns the score of `member` in the sorted set at `key`.

If `member` does not exist in the sorted set, or `key` does not exist, `nil` is
returned.

@return

@bulk-string-reply: the score of `member` (a double precision floating point number),
represented as string.

@examples

```cli
ZADD myzset 1 "one"
ZSCORE myzset "one"
```
