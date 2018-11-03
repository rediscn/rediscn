---
layout: commands
title: memory-doctor 命令
permalink: commands/memory-doctor.html
disqusIdentifier: command_memory-doctor
disqusUrl: http://redis.cn/commands/memory-doctor.html
commandsType: server
discuzTid: 13905
---

The `MEMORY DOCTOR` command reports about different memory-related issues that
the Redis server experiences, and advises about possible remedies.
命令`MEMORY DOCTOR` 返回Redis 服务器遇到的不同类型的内存相关问题，并提供相应的解决建议

## 返回值

[bulk-string-reply](/topics/protocol.html#bulk-string-reply)