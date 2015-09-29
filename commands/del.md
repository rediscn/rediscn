---
layout: commands
title: del 命令 -- Redis中文资料站
permalink: commands/del.html
disqusIdentifier: command_del
disqusUrl: http://redis.cn/commands/del.html
commandsType: keys
---

Removes the specified keys.
A key is ignored if it does not exist.

@return

@integer-reply: The number of keys that were removed.

@examples

```cli
SET key1 "Hello"
SET key2 "World"
DEL key1 key2 key3
```
