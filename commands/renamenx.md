---
layout: commands
title: renamenx 命令 -- Redis中文资料站
permalink: commands/renamenx.html
disqusIdentifier: command_renamenx
disqusUrl: http://redis.cn/commands/renamenx.html
commandsType: keys
---

Renames `key` to `newkey` if `newkey` does not yet exist.
It returns an error under the same conditions as `RENAME`.

@return

@integer-reply, specifically:

* `1` if `key` was renamed to `newkey`.
* `0` if `newkey` already exists.

@examples

```cli
SET mykey "Hello"
SET myotherkey "World"
RENAMENX mykey myotherkey
GET myotherkey
```
