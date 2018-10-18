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

This command is currently implemented only when using **jemalloc** as an
allocator, and evaluates to a benign NOOP for all others.

@return

@simple-string-reply
