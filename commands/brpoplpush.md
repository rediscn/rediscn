---
layout: commands
title: brpoplpush 命令
permalink: commands/brpoplpush.html
disqusIdentifier: command_brpoplpush
disqusUrl: http://redis.cn/commands/brpoplpush.html
commandsType: lists
---

`BRPOPLPUSH` 是 [RPOPLPUSH](/commands/rpoplpush.html) 的阻塞版本。 当 source 包含元素的时候，这个命令表现得跟 [RPOPLPUSH](/commands/rpoplpush.html) 一模一样。 当 source 是空的时候，Redis将会阻塞这个连接，直到另一个客户端 push 元素进入或者达到 timeout 时限。 timeout 为 0 能用于无限期阻塞客户端。

查看 [RPOPLPUSH](/commands/rpoplpush.html) 以了解更多信息。

## 返回值

[批量回复(bulk-reply)](/topics/protocol.html#bulk-reply): 元素从 source 中弹出来，并压入 destination 中。 如果达到 timeout 时限，会返回一个[空的多批量回复(nil-reply)](/topics/protocol.html#nil-reply)。

## 模式：可靠的队列
请参考[RPOPLPUSH](/commands/rpoplpush.html) 命令文档。

## 模式：循环列表
请参考[RPOPLPUSH](/commands/rpoplpush.html) 命令文档。