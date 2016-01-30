---
layout: commands
title: flushdb 命令 -- Redis中文资料站
permalink: commands/flushdb.html
disqusIdentifier: command_flushdb
disqusUrl: http://redis.cn/commands/flushdb.html
commandsType: server
---

删除当前数据库里面的所有数据。

这个命令永远不会出现失败。

这个操作的时间复杂度是`O(N)`,N是当前数据库的keys数量。

## 返回

[simple-string-reply](/topics/protocol.html#simple-string-reply)

