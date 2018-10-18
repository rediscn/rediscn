---
layout: commands
title: touch 命令
permalink: commands/touch.html
disqusIdentifier: command_touch
disqusUrl: http://redis.cn/commands/touch.html
commandsType: keys
discuzTid: 13914
---

Alters the last access time of a key(s).
A key is ignored if it does not exist.

## 返回值

@integer-reply: The number of keys that were touched.

## 例子

```cli
SET key1 "Hello"
SET key2 "World"
TOUCH key1 key2
```
