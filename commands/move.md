---
layout: commands
title: move 命令
permalink: commands/move.html
disqusIdentifier: command_move
disqusUrl: http://redis.cn/commands/move.html
commandsType: keys
discuzTid: 1006
---

将当前数据库的 key 移动到给定的数据库 db 当中。

如果当前数据库(源数据库)和给定数据库(目标数据库)有相同名字的给定 key ，或者 key 不存在于当前数据库，那么 MOVE 没有任何效果。

因此，也可以利用这一特性，将 `MOVE` 当作锁(locking)原语(primitive)。

##返回值

[integer-reply](/topics/protocol.html#integer-reply):

- 移动成功返回 1
- 失败则返回 0
