---
layout: commands
title: info 命令 -- Redis中文资料站
permalink: commands/info.html
disqusIdentifier: command_info
disqusUrl: http://redis.cn/commands/info.html
commandsType: server
---

`INFO`命令以一种易于理解和阅读的格式，返回关于Redis服务器的各种信息和统计数值。

通过给定可选的参数 section ，可以让命令只返回某一部分的信息:

*   `server`:  Redis服务器的一般信息
*   `clients`: 客户端的连接部分
*   `memory`: 内存消耗相关信息
*   `persistence`: RDB和AOF相关信息
*   `stats`: 一般统计
*   `replication`: 主/从复制信息
*   `cpu`: 统计CPU的消耗
*   `commandstats`: Redis命令统计
*   `cluster`: Redis集群信息
*   `keyspace`: 数据库的相关统计

它也可以采取以下值:

*   `all`: 返回所有信息
*   `default`: 值返回默认设置的信息

如果没有使用任何参数时，默认为`default`。

##返回值

[bulk-string-reply](/topics/protocol.html#bulk-string-reply): 文本行的合集

每一行包含了包含一种信息或者属性（从#字符开始）。
所有的属性都是以字段:值（`field:value`）的形式，已`\r\n`结尾。

##例子

	redis> INFO
	# Server
	redis_version:999.999.999
	redis_git_sha1:ceaf58df
	redis_git_dirty:1
	redis_build_id:a5eeeb464ee54856
	redis_mode:standalone
	os:Linux 4.1.5-x86_64-linode61 x86_64
	arch_bits:32
	multiplexing_api:epoll
	gcc_version:4.4.1
	process_id:21798
	run_id:2569bb7433bfe013c2627edf62d9bf21eaf8a010
	tcp_port:6379
	uptime_in_seconds:3348607
	uptime_in_days:38
	hz:10
	lru_clock:491100
	config_file:/etc/redis/6379.conf
	
	# Clients
	connected_clients:8
	client_longest_output_list:0
	client_biggest_input_buf:0
	blocked_clients:0
	
	# Memory
	used_memory:7556576
	used_memory_human:7.21M
	used_memory_rss:10555392
	used_memory_rss_human:10.07M
	used_memory_peak:8370272
	used_memory_peak_human:7.98M
	total_system_memory:4142215168
	total_system_memory_human:3.86G
	used_memory_lua:24576
	used_memory_lua_human:24.00K
	maxmemory:3221225472
	maxmemory_human:3.00G
	maxmemory_policy:unknown
	mem_fragmentation_ratio:1.40
	mem_allocator:jemalloc-3.6.0
	lazyfree_pending_objects:0
	
	# Persistence
	loading:0
	rdb_changes_since_last_save:521
	rdb_bgsave_in_progress:0
	rdb_last_save_time:1460108780
	rdb_last_bgsave_status:ok
	rdb_last_bgsave_time_sec:0
	rdb_current_bgsave_time_sec:-1
	aof_enabled:0
	aof_rewrite_in_progress:0
	aof_rewrite_scheduled:0
	aof_last_rewrite_time_sec:-1
	aof_current_rewrite_time_sec:-1
	aof_last_bgrewrite_status:ok
	aof_last_write_status:ok
	
	# Stats
	total_connections_received:1058
	total_commands_processed:20227305
	instantaneous_ops_per_sec:0
	total_net_input_bytes:1528543656
	total_net_output_bytes:2155353808
	instantaneous_input_kbps:0.00
	instantaneous_output_kbps:0.00
	rejected_connections:0
	sync_full:0
	sync_partial_ok:0
	sync_partial_err:0
	expired_keys:22616
	evicted_keys:0
	keyspace_hits:5059386
	keyspace_misses:1405484
	pubsub_channels:0
	pubsub_patterns:0
	latest_fork_usec:645
	migrate_cached_sockets:0
	
	# Replication
	role:master
	connected_slaves:0
	master_repl_offset:0
	repl_backlog_active:0
	repl_backlog_size:1048576
	repl_backlog_first_byte_offset:0
	repl_backlog_histlen:0
	
	# CPU
	used_cpu_sys:2776.27
	used_cpu_user:2449.24
	used_cpu_sys_children:59.10
	used_cpu_user_children:1237.45
	
	# Cluster
	cluster_enabled:0
	
	# Keyspace
	db0:keys=3790,expires=2,avg_ttl=95446662632
	redis> 

## 注意

请注意不同Redis版本会添加或者删除一些字段。一个健壮的客户端应用解析该命令的结果时，应该跳过未知的字段，并且优雅的处理缺少的字段。

已下描述要求 Redis >= 2.4


下面是所有 **server** 相关的信息:

*   `redis_version`: Redis 服务器版本
*   `redis_git_sha1`:  Git SHA1
*   `redis_git_dirty`: Git dirty flag
*   `os`: Redis 服务器的宿主操作系统
*   `arch_bits`: 架构（32 或 64 位）
*   `multiplexing_api`:  Redis 所使用的事件处理机制
*   `gcc_version`: 编译 Redis 时所使用的 GCC 版本
*   `process_id`:  服务器进程的 PID
*   `run_id`: Redis 服务器的随机标识符（用于 Sentinel 和集群）
*   `tcp_port`: TCP/IP 监听端口
*   `uptime_in_seconds`: 自 Redis 服务器启动以来，经过的秒数
*   `uptime_in_days`: 自 Redis 服务器启动以来，经过的天数
*   `lru_clock`: 以分钟为单位进行自增的时钟，用于 LRU 管理

下面是所有 **clients** 相关的信息:

*   `connected_clients`: 已连接客户端的数量（不包括通过从属服务器连接的客户端）
*   `client_longest_output_list`: 当前连接的客户端当中，最长的输出列表
*   `client_biggest_input_buf`: 当前连接的客户端当中，最大输入缓存
*   `blocked_clients`: 正在等待阻塞命令（BLPOP、BRPOP、BRPOPLPUSH）的客户端的数量

下面是所有 **memory** 相关的信息:

*   `used_memory`:  由 Redis 分配器分配的内存总量，以字节（byte）为单位
*   `used_memory_human`:  以人类可读的格式返回 Redis 分配的内存总量
*   `used_memory_rss`: 从操作系统的角度，返回 Redis 已分配的内存总量（俗称常驻集大小）。这个值和 top 、 ps 等命令的输出一致。
*   `used_memory_peak`: Redis 的内存消耗峰值（以字节为单位）
*   `used_memory_peak_human`: 以人类可读的格式返回 Redis 的内存消耗峰值
*   `used_memory_lua`: Lua 引擎所使用的内存大小（以字节为单位）
*   `mem_fragmentation_ratio`: `used_memory_rss` 和 `used_memory` 之间的比率
*   `mem_allocator`: 在编译时指定的， Redis 所使用的内存分配器。可以是 libc 、 jemalloc 或者 tcmalloc 。
在理想情况下， used_memory_rss 的值应该只比 used_memory 稍微高一点儿。

当 rss > used ，且两者的值相差较大时，表示存在（内部或外部的）内存碎片。

内存碎片的比率可以通过 mem_fragmentation_ratio 的值看出。

当 used > rss 时，表示 Redis 的部分内存被操作系统换出到交换空间了，在这种情况下，操作可能会产生明显的延迟。

当 Redis 释放内存时，分配器可能会，也可能不会，将内存返还给操作系统。

如果 Redis 释放了内存，却没有将内存返还给操作系统，那么 used_memory 的值可能和操作系统显示的 Redis 内存占用并不一致。

查看 used_memory_peak 的值可以验证这种情况是否发生。

下面是所有 **persistence** 相关的信息:

*   `loading`: Flag indicating if the load of a dump file is on-going
*   `rdb_changes_since_last_save`: Number of changes since the last dump
*   `rdb_bgsave_in_progress`: Flag indicating a RDB save is on-going
*   `rdb_last_save_time`: Epoch-based timestamp of last successful RDB save
*   `rdb_last_bgsave_status`: Status of the last RDB save operation
*   `rdb_last_bgsave_time_sec`: Duration of the last RDB save operation in seconds
*   `rdb_current_bgsave_time_sec`: Duration of the on-going RDB save operation if any
*   `aof_enabled`: Flag indicating AOF logging is activated
*   `aof_rewrite_in_progress`: Flag indicating a AOF rewrite operation is on-going
*   `aof_rewrite_scheduled`: Flag indicating an AOF rewrite operation
     will be scheduled once the on-going RDB save is complete.
*   `aof_last_rewrite_time_sec`: Duration of the last AOF rewrite operation in seconds
*   `aof_current_rewrite_time_sec`: Duration of the on-going AOF rewrite operation if any
*   `aof_last_bgrewrite_status`: Status of the last AOF rewrite operation

`changes_since_last_save` refers to the number of operations that produced
some kind of changes in the dataset since the last time either `SAVE` or
`BGSAVE` was called.

If AOF is activated, these additional fields will be added:

*   `aof_current_size`: AOF current file size
*   `aof_base_size`: AOF file size on latest startup or rewrite
*   `aof_pending_rewrite`: Flag indicating an AOF rewrite operation
     will be scheduled once the on-going RDB save is complete.
*   `aof_buffer_length`: Size of the AOF buffer
*   `aof_rewrite_buffer_length`: Size of the AOF rewrite buffer
*   `aof_pending_bio_fsync`: Number of fsync pending jobs in background I/O queue
*   `aof_delayed_fsync`: Delayed fsync counter

If a load operation is on-going, these additional fields will be added:

*   `loading_start_time`: Epoch-based timestamp of the start of the load operation
*   `loading_total_bytes`: Total file size
*   `loading_loaded_bytes`: Number of bytes already loaded
*   `loading_loaded_perc`: Same value expressed as a percentage
*   `loading_eta_seconds`: ETA in seconds for the load to be complete

下面是所有 **stats** 相关的信息:

*   `total_connections_received`: Total number of connections accepted by the server
*   `total_commands_processed`: Total number of commands processed by the server
*   `instantaneous_ops_per_sec`: Number of commands processed per second
*   `rejected_connections`: Number of connections rejected because of `maxclients` limit
*   `expired_keys`: Total number of key expiration events
*   `evicted_keys`: Number of evicted keys due to `maxmemory` limit
*   `keyspace_hits`: Number of successful lookup of keys in the main dictionary
*   `keyspace_misses`: Number of failed lookup of keys in the main dictionary
*   `pubsub_channels`: Global number of pub/sub channels with client subscriptions
*   `pubsub_patterns`: Global number of pub/sub pattern with client subscriptions
*   `latest_fork_usec`: Duration of the latest fork operation in microseconds

下面是所有 **replication** 相关的信息:

*   `role`: Value is "master" if the instance is slave of no one, or "slave" if the instance is enslaved to a master.
    Note that a slave can be master of another slave (daisy chaining).

If the instance is a slave, these additional fields are provided:

*   `master_host`: Host or IP address of the master
*   `master_port`: Master listening TCP port
*   `master_link_status`: Status of the link (up/down)
*   `master_last_io_seconds_ago`: Number of seconds since the last interaction with master
*   `master_sync_in_progress`: Indicate the master is syncing to the slave

If a SYNC operation is on-going, these additional fields are provided:

*   `master_sync_left_bytes`: Number of bytes left before syncing is complete
*   `master_sync_last_io_seconds_ago`: Number of seconds since last transfer I/O during a SYNC operation

If the link between master and slave is down, an additional field is provided:

*   `master_link_down_since_seconds`: Number of seconds since the link is down

The following field is always provided:

*   `connected_slaves`: Number of connected slaves

For each slave, the following line is added:

*   `slaveXXX`: id, IP address, port, state

下面是所有 **cpu** 相关的信息:

*   `used_cpu_sys`: System CPU consumed by the Redis server
*   `used_cpu_user`:User CPU consumed by the Redis server
*   `used_cpu_sys_children`: System CPU consumed by the background processes
*   `used_cpu_user_children`: User CPU consumed by the background processes

The **commandstats** section provides statistics based on the command type,
including the number of calls, the total CPU time consumed by these commands,
and the average CPU consumed per command execution.

For each command type, the following line is added:

*   `cmdstat_XXX`: `calls=XXX,usec=XXX,usec_per_call=XXX`

The **cluster** section currently only contains a unique field:

*   `cluster_enabled`: Indicate Redis cluster is enabled

The **keyspace** section provides statistics on the main dictionary of each database.
The statistics are the number of keys, and the number of keys with an expiration.

For each database, the following line is added:

*   `dbXXX`: `keys=XXX,expires=XXX`

[hcgcpgp]: http://code.google.com/p/google-perftools/
