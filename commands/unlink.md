---
layout: commands
title: unlink 命令
permalink: commands/unlink.html
disqusIdentifier: command_unlink
disqusUrl: http://redis.cn/commands/unlink.html
commandsType: keys
discuzTid: 948
---

This command is very similar to `DEL`: it removes the specified keys.
Just like `DEL` a key is ignored if it does not exist. However the command
performs the actual memory reclaiming in a different thread, so it is not
blocking, while `DEL` is. This is where the command name comes from: the
command just **unlinks** the keys from the keyspace. The actual removal
will happen later asynchronously.

## 返回值

[integer-reply](/topics/protocol.html#integer-reply)：
The number of keys that were unlinked.

## 例子

```cli
SET key1 "Hello"
SET key2 "World"
UNLINK key1 key2 key3
```
