---
layout: commands
title: rename å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/rename.html
disqusIdentifier: command_rename
disqusUrl: http://redis.cn/commands/rename.html
commandsType: keys
---

Renames `key` to `newkey`.
It returns an error when the source and destination names are the same, or when
`key` does not exist.
If `newkey` already exists it is overwritten, when this happens `RENAME` executes an implicit `DEL` operation, so if the deleted key contains a very big value it may cause high latency even if `RENAME` itself is usually a constant-time operation.

## ·µ»ØÖµ

@simple-string-reply

##Àý×Ó

```cli
SET mykey "Hello"
RENAME mykey myotherkey
GET myotherkey
```
