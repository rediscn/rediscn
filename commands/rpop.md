---
layout: commands
title: rpop 命令 -- Redis中文资料站
permalink: commands/rpop.html
disqusIdentifier: command_rpop
disqusUrl: http://redis.cn/commands/rpop.html
commandsType: lists
---

Removes and returns the last element of the list stored at `key`.

@return

@bulk-string-reply: the value of the last element, or `nil` when `key` does not exist.

@examples

```cli
RPUSH mylist "one"
RPUSH mylist "two"
RPUSH mylist "three"
RPOP mylist
LRANGE mylist 0 -1
```
