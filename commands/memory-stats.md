---
layout: commands
title: memory-stats 命令
permalink: commands/memory-stats.html
disqusIdentifier: command_memory-stats
disqusUrl: http://redis.cn/commands/memory-stats.html
commandsType: server
discuzTid: 13909
---

The `MEMORY STATS` command returns an @array-reply about the memory usage of the
server.
命令`MEMORY STATS` 将服务器的内存使用情况以数组情况返回

The information about memory usage is provided as metrics and their respective
values. The following metrics are reported:
内存使用信息以指标和相对应值的格式返回，如下指标会被返回

*   `peak.allocated`: Peak memory consumed by Redis in bytes (see `INFO`'s
     `used_memory`)
*   `peak.allocated`:redis启动以来，allocator分配的内存峰值，单位字节；同`INFO`的`used_memory_peak`

*   `total.allocated`: Total number of bytes allocated by Redis using its
     allocator (see `INFO`'s `used_memory`)
*	`total.allocated`: allocator 当前分配的内存总字节数；同 `INFO`命令`used_memeory`

*   `startup.allocated`: Initial amount of memory consumed by Redis at startup
     in bytes (see `INFO`'s `used_memory_startup`)
*	`startup.allocated`: Redis启动完成消耗的内存字节数；同`INFO`的`used_memory_startup`	 

*   `replication.backlog`: Size in bytes of the replication backlog (see
     `INFO`'s `repl_backlog_size`)
*	`replication.backlog`: Redis复制积压缓存区内存字节数；同`INFO`的`repl_backlog_size`	 

*   `clients.slaves`: The total size in bytes of all replicas overheads (output
     and query buffers, connection contexts)
*	`clients.slaves`: 所有副本节点内存消耗总字节数(查询输出缓冲区，连接内存消耗) 
	 
*   `clients.normal`: The total size in bytes of all clients overheads (output
     and query buffers, connection contexts)
*	`clients.normal`：Redis所有常规客户端内存消耗总字节数(查询输出缓冲区，连接内存消耗)

*   `aof.buffer`: The summed size in bytes of the current and rewrite AOF
     buffers (see `INFO`'s `aof_buffer_length` and `aof_rewrite_buffer_length`,
     respectively)
*	`aof.buffer`：当前和重写AOF缓冲区内存消耗总字节数；同 `INFO`命令`aof_buffer_length`和`aof_rewrite_buffer_length`之和	 

*   `dbXXX`: For each of the server's databases, the overheads of the main and
     expiry dictionaries (`overhead.hashtable.main` and
    `overhead.hashtable.expires`, respectively) are reported in bytes
*	`dbXXX`: 每个数据库中元数据占用的额外内存字节数
	
*   `overhead.total`: The sum of all overheads, i.e. `startup.allocated`,
     `replication.backlog`, `clients.slaves`, `clients.normal`, `aof.buffer` and
     those of the internal data structures that are used in managing the
     Redis keyspace (see `INFO`'s `used_memory_overhead`)
*	`overhead.total`: Redis 额外内存消耗总字节数，i.e. `startup.allocated`,
     `replication.backlog`, `clients.slaves`, `clients.normal`, `aof.buffer` 以及管理keyspace使用的内部数据接口消耗的内存字节数
	 同`INFO`的`used_memory_overhead`	 
*   `keys.count`: The total number of keys stored across all databases in the
     server
*	`keys.count`：整个redis实例key的个数

*   `keys.bytes-per-key`: The ratio between **net memory usage** (`total.allocated`
     minus `startup.allocated`) and `keys.count` 
*	`keys.bytes-per-key`：每个key平均字节数，**net memory usage**(`total.allocated`
     - `startup.allocated`)与`keys.count`的比值

*   `dataset.bytes`: The size in bytes of the dataset, i.e. `overhead.total`
     subtracted from `total.allocated` (see `INFO`'s `used_memory_dataset`)
	 
*	`dataset.bytes`:Redis 实例中数据占用的总字节数，计算方法`total.allocated`减去`overhead.total`	 

*   `dataset.percentage`: The percentage of `dataset.bytes` out of the net
     memory usage
*	`dataset.percentage`:Redis 数据消耗内存占总内存的百分比

*   `peak.percentage`: The percentage of `peak.allocated` out of
     `total.allocated`
*	`peak.percentage`：当前内存消耗占峰值内存消耗的百分比

*   `fragmentation`: See `INFO`'s `mem_fragmentation_ratio`
*	`fragmentation`：同 `INFO`的 `mem_fragmentation_ratio`
## 返回值

[array-reply](/topics/protocol.html#array-reply): nested list of memory usage metrics and their values

[array-reply](/topics/protocol.html#array-reply): 包含内存使用指标名称和对应值的嵌套列表


**A note about the word slave used in this man page**: Starting with Redis 5, if not for backward compatibility, the Redis project no longer uses the word slave. Unfortunately in this command the word slave is part of the protocol, so we'll be able to remove such occurrences only when this API will be naturally deprecated.
**关于主页中使用的关键词slave的说明：如果不是为了保证Redis 5 的向后兼容性，我们会在Redis 5弃用关键词slave。很遗憾，slave 是协议的一部分，因此我们会在API自然消亡后弃用关键词slave的使用。
