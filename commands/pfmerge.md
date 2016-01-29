---
layout: commands
title: pfmerge å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/pfmerge.html
disqusIdentifier: command_pfmerge
disqusUrl: http://redis.cn/commands/pfmerge.html
commandsType: hyperloglog
---

Merge multiple HyperLogLog values into an unique value that will approximate
the cardinality of the union of the observed Sets of the source HyperLogLog
structures.

The computed merged HyperLogLog is set to the destination variable, which is
created if does not exist (defaulting to an empty HyperLogLog).

## ·µ»ØÖµ

@simple-string-reply: The command just returns `OK`.

##Àý×Ó

```cli
PFADD hll1 foo bar zap a
PFADD hll2 a b c foo
PFMERGE hll3 hll1 hll2
PFCOUNT hll3
```
