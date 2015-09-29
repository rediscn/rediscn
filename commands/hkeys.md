---
layout: commands
title: hkeys 命令 -- Redis中文资料站
permalink: commands/hkeys.html
disqusIdentifier: command_hkeys
disqusUrl: http://redis.cn/commands/hkeys.html
commandsType: keys
---

Returns all field names in the hash stored at `key`.

@return

@array-reply: list of fields in the hash, or an empty list when `key` does
not exist.

@examples

```cli
HSET myhash field1 "Hello"
HSET myhash field2 "World"
HKEYS myhash
```
