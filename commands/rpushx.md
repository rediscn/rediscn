---
layout: commands
title: rpushx 命令 -- Redis中文资料站
permalink: commands/rpushx.html
disqusIdentifier: command_rpushx
disqusUrl: http://redis.cn/commands/rpushx.html
commandsType: keys
---

Inserts `value` at the tail of the list stored at `key`, only if `key` already
exists and holds a list.
In contrary to `RPUSH`, no operation will be performed when `key` does not yet
exist.

@return

@integer-reply: the length of the list after the push operation.

@examples

```cli
RPUSH mylist "Hello"
RPUSHX mylist "World"
RPUSHX myotherlist "World"
LRANGE mylist 0 -1
LRANGE myotherlist 0 -1
```
