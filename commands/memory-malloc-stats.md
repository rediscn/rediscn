---
layout: commands
title: memory-malloc-stats 命令
permalink: commands/memory-malloc-stats.html
disqusIdentifier: command_memory-malloc-stats
disqusUrl: http://redis.cn/commands/memory-malloc-stats.html
commandsType: server
discuzTid: 13907
---

The `MEMORY MALLOC-STATS` command provides an internal statistics report from
the memory allocator.

This command is currently implemented only when using **jemalloc** as an
allocator, and evaluates to a benign NOOP for all others.

@return

@bulk-string-reply: the memory allocator's internal statistics report
