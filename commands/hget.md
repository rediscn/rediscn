---
layout: commands
title: hget 命令 -- Redis中文资料站
permalink: commands/hget.html
disqusIdentifier: command_hget
disqusUrl: http://redis.cn/commands/hget.html
commandsType: hashes
---

Returns the value associated with `field` in the hash stored at `key`.

@return

@bulk-string-reply: the value associated with `field`, or `nil` when `field` is not
present in the hash or `key` does not exist.

@examples

```cli
HSET myhash field1 "foo"
HGET myhash field1
HGET myhash field2
```
