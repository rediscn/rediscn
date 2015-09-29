---
layout: commands
title: hlen 命令 -- Redis中文资料站
permalink: commands/hlen.html
disqusIdentifier: command_hlen
disqusUrl: http://redis.cn/commands/hlen.html
commandsType: hashes
---

Returns the number of fields contained in the hash stored at `key`.

@return

@integer-reply: number of fields in the hash, or `0` when `key` does not exist.

@examples

```cli
HSET myhash field1 "Hello"
HSET myhash field2 "World"
HLEN myhash
```
