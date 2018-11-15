---
layout: commands
title: memory-malloc-stats 命令
permalink: commands/memory-malloc-stats.html
disqusIdentifier: command_memory-malloc-stats
disqusUrl: http://redis.cn/commands/memory-malloc-stats.html
commandsType: server
discuzTid: 13907
tranAuthor: gqhao
---

命令`MEMORY MALLOC-STATS` 提供内存分配情况的内部统计报表

该命令目前仅实现了**jemalloc**作为内存分配器的内存统计，对其他分配器暂不支持哈

## 返回值

[bulk-string-reply](/topics/protocol.html#bulk-string-reply): 内存分配器的内部统计报表
