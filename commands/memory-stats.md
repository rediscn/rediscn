---
layout: commands
title: memory-stats 命令
permalink: commands/memory-stats.html
disqusIdentifier: command_memory-stats
disqusUrl: http://redis.cn/commands/memory-stats.html
commandsType: server
discuzTid: 13909
---

命令`MEMORY STATS` 将服务器的内存使用情况以数组情况返回

内存使用信息以指标和相对应值的格式返回，如下指标会被返回

*   `peak.allocated`:redis启动以来，allocator分配的内存峰值，单位字节；同`INFO`的`used_memory_peak`

*	`total.allocated`: allocator 当前分配的内存总字节数；同 `INFO`命令`used_memeory`

*	`startup.allocated`: Redis启动完成消耗的内存字节数；同`INFO`的`used_memory_startup`	 

*	`replication.backlog`: Redis复制积压缓存区内存字节数；同`INFO`的`repl_backlog_size`	 

*	`clients.slaves`: 所有副本节点内存消耗总字节数(查询输出缓冲区，连接内存消耗) 

*	`clients.normal`：Redis所有常规客户端内存消耗总字节数(查询输出缓冲区，连接内存消耗)

*	`aof.buffer`：当前和重写AOF缓冲区内存消耗总字节数；同 `INFO`命令`aof_buffer_length`和`aof_rewrite_buffer_length`之和	 

*	`dbXXX`: 每个数据库中元数据占用的额外内存字节数。（redis的db就是一张hash表，首先就是这张hash表使用的内存，每一个key-value对都有一个dictEntry来记录他们的关系，元信息便包含该db中所有dictEntry使用的内存，
	 redis使用redisObject来描述value所对应的不同数据类型（string、list、hash、set、zset），那么redisObject占用的空间也计算在元信息中。`overhead.hashtable.main`
	 指以上三者之和。`overhead.hashtable.expires` 用于存储key的过期时间耗费的内存资源。)

*	`overhead.total`: Redis 额外内存消耗总字节数，i.e. `startup.allocated`,
     `replication.backlog`, `clients.slaves`, `clients.normal`, `aof.buffer` 以及管理keyspace使用的内部数据接口消耗的内存字节数
	 同`INFO`的`used_memory_overhead`	 

*	`keys.count`：整个redis实例key的个数

*	`keys.bytes-per-key`：每个key平均字节数，**net memory usage**(`total.allocated`
     减去 `startup.allocated`)与`keys.count`的比值

	 
*	`dataset.bytes`:Redis 实例中数据占用的总字节数，计算方法`total.allocated`减去`overhead.total`	 

*	`dataset.percentage`:Redis 数据消耗内存占总内存的百分比

*	`peak.percentage`：当前内存消耗占峰值内存消耗的百分比

*	`fragmentation`：同 `INFO`的 `mem_fragmentation_ratio`
## 返回值

[array-reply](/topics/protocol.html#array-reply): nested list of memory usage metrics and their values

[array-reply](/topics/protocol.html#array-reply): 包含内存使用指标名称和对应值的嵌套列表


关于主页中使用的关键词slave的说明：为了保证Redis 5 的向后兼容性，我们在Redis 5 中继续使用关键词slave。slave 是协议的一部分，我们会在API自然消亡后弃用关键词slave的使用。
