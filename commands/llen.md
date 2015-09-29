---
layout: commands
title: llen 命令 -- Redis中文资料站
permalink: commands/llen.html
disqusIdentifier: command_llen
disqusUrl: http://redis.cn/commands/llen.html
commandsType: keys
---

Returns the length of the list stored at `key`.
If `key` does not exist, it is interpreted as an empty list and `0` is returned.
An error is returned when the value stored at `key` is not a list.

@return

@integer-reply: the length of the list at `key`.

@examples

```cli
LPUSH mylist "World"
LPUSH mylist "Hello"
LLEN mylist
```
