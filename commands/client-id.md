---
layout: commands
title: client-id 命令
permalink: commands/client-id.html
disqusIdentifier: command_id
disqusUrl: http://redis.cn/commands/client-id.html
commandsType: server
discuzTid: 13901
---

The command just returns the ID of the current connection. Every connection
ID has certain guarantees:

1. It is never repeated, so if `CLIENT ID` returns the same number, the caller can be sure that the underlying client did not disconnect and reconnect the connection, but it is still the same connection.
2. The ID is monotonically incremental. If the ID of a connection is greater than the ID of another connection, it is guaranteed that the second connection was established with the server at a later time.

This command is especially useful together with `CLIENT UNBLOCK` which was
introduced also in Redis 5 together with `CLIETN ID`. Check the `CLIENT UNBLOCK` command page for a pattern involving the two commands.

## 例子

```cli
CLIENT ID
```
