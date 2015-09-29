---
layout: commands
title: lset 命令 -- Redis中文资料站
permalink: commands/lset.html
disqusIdentifier: command_lset
disqusUrl: http://redis.cn/commands/lset.html
commandsType: lists
---

Sets the list element at `index` to `value`.
For more information on the `index` argument, see `LINDEX`.

An error is returned for out of range indexes.

@return

@simple-string-reply

@examples

```cli
RPUSH mylist "one"
RPUSH mylist "two"
RPUSH mylist "three"
LSET mylist 0 "four"
LSET mylist -2 "five"
LRANGE mylist 0 -1
```
