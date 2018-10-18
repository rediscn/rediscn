---
layout: commands
title: swapdb 命令
permalink: commands/swapdb.html
disqusIdentifier: command_swapdb
disqusUrl: http://redis.cn/commands/swapdb.html
commandsType: connection
discuzTid: 13913
---

This command swaps two Redis databases, so that immediately all the
clients connected to a given database will see the data of the other database, and
the other way around. Example:

    SWAPDB 0 1

This will swap database 0 with database 1. All the clients connected with database 0 will immediately see the new data, exactly like all the clients connected with database 1 will see the data that was formerly of database 0.

##返回值

@simple-string-reply: `OK` if `SWAPDB` was executed correctly.

## 例子

```
SWAPDB 0 1
```
