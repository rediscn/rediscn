---
layout: commands
title: hgetall 命令 -- Redis中文资料站
permalink: commands/hgetall.html
disqusIdentifier: command_hgetall
disqusUrl: http://redis.cn/commands/hgetall.html
commandsType: hashes
---

Returns all fields and values of the hash stored at `key`.
In the returned value, every field name is followed by its value, so the length
of the reply is twice the size of the hash.

@return

@array-reply: list of fields and their values stored in the hash, or an
empty list when `key` does not exist.

@examples

```cli
HSET myhash field1 "Hello"
HSET myhash field2 "World"
HGETALL myhash
```
