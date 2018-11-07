---
layout: commands
title: memory-purge 命令
permalink: commands/memory-purge.html
disqusIdentifier: command_memory-purge
disqusUrl: http://redis.cn/commands/memory-purge.html
commandsType: server
discuzTid: 13908
tranAuthor：gqhao
---

命令`MEMORY PURGE` 尝试清除脏页以便内存分配器回收使用

该命令目前仅实现了**jemalloc**作为内存分配器的内存统计，对其他服务器暂不支持哈。 
   
## 返回值

[simple-string-reply](/topics/protocol.html#字符串)
