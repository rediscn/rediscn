---
layout: commands
title: flushall 命令
permalink: commands/flushall.html
disqusIdentifier: command_flushall
disqusUrl: http://redis.cn/commands/flushall.html
commandsType: server
---

删除所有数据库里面的所有数据，注意不是当前数据库，而是所有数据库。

这个命令永远不会出现失败。

这个操作的时间复杂度是`O(N)`,N是数据库的数量。


## 返回

[simple-string-reply](/topics/protocol.html#simple-string-reply)
