---
layout: commands
title: hexists 命令 -- Redis中文资料站
permalink: commands/hexists.html
disqusIdentifier: command_hexists
disqusUrl: http://redis.cn/commands/hexists.html
commandsType: hashes
---

Returns if `field` is an existing field in the hash stored at `key`.

@return

@integer-reply, specifically:

* `1` if the hash contains `field`.
* `0` if the hash does not contain `field`, or `key` does not exist.

@examples

```cli
HSET myhash field1 "foo"
HEXISTS myhash field1
HEXISTS myhash field2
```
