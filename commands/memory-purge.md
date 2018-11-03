---
layout: commands
title: memory-purge 命令
permalink: commands/memory-purge.html
disqusIdentifier: command_memory-purge
disqusUrl: http://redis.cn/commands/memory-purge.html
commandsType: server
discuzTid: 13908
---

The `MEMORY PURGE` command attempts to purge dirty pages so these can be
reclaimed by the allocator.
命令`MEMORY PURGE` 尝试清除脏页以便内存分配器回收使用
This command is currently implemented only when using **jemalloc** as an
allocator, and evaluates to a benign NOOP for all others.
该命令目前仅实现了**jemalloc**作为内存分配器的内存统计，    
## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply)
[simple-string-reply](/topics/protocol.html#字符串)
