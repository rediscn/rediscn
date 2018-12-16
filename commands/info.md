---
layout: commands
title: info 命令
permalink: commands/info.html
disqusIdentifier: command_info
disqusUrl: http://redis.cn/commands/info.html
commandsType: server
discuzTid: 990
tranAuthor: wangqiang
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

## 返回值

[bulk-string-reply](/topics/protocol.html#bulk-string-reply): 文本行的合集

每一行包含了包含一种信息或者属性（从#字符开始）。
所有的属性都是以字段:值（`field:value`）的形式，以`\r\n`结尾。

## 例子

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

以下是Redis >= 2.4的字段说明。

下面是所有 **server** 相关的信息:

*   `redis_version`: Redis 服务器版本
*   `redis_git_sha1`:  Git SHA1
*   `redis_git_dirty`: Git dirty flag
*   `redis_build_id`: 构建ID
*   `redis_mode`: 服务器模式（standalone，sentinel或者cluster）
*   `os`: Redis 服务器的宿主操作系统
*   `arch_bits`: 架构（32 或 64 位）
*   `multiplexing_api`:  Redis 所使用的事件处理机制
*   `atomicvar_api`:  Redis使用的Atomicvar API
*   `gcc_version`: 编译 Redis 时所使用的 GCC 版本
*   `process_id`:  服务器进程的 PID
*   `run_id`: Redis 服务器的随机标识符（用于 Sentinel 和集群）
*   `tcp_port`: TCP/IP 监听端口
*   `uptime_in_seconds`: 自 Redis 服务器启动以来，经过的秒数
*   `uptime_in_days`: 自 Redis 服务器启动以来，经过的天数
*   `hz`: 服务器的频率设置
*   `lru_clock`: 以分钟为单位进行自增的时钟，用于 LRU 管理
*   `executable`: 服务器的可执行文件路径
*   `config_file`: 配置文件路径

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
*   `used_memory_peak_perc`: 使用内存占峰值内存的百分比
*   `used_memory_overhead`: 服务器为管理其内部数据结构而分配的所有开销的总和（以字节为单位）
*   `used_memory_startup`: Redis在启动时消耗的初始内存大小（以字节为单位）
*   `used_memory_dataset`: 以字节为单位的数据集大小（used_memory减去used_memory_overhead）
*   `used_memory_dataset_perc`: used_memory_dataset占净内存使用量的百分比（used_memory减去used_memory_startup）
*   `total_system_memory`: Redis主机具有的内存总量
*   `total_system_memory_human`: 以人类可读的格式返回 Redis主机具有的内存总量
*   `used_memory_lua`: Lua 引擎所使用的内存大小（以字节为单位）
*   `used_memory_lua_human`: 以人类可读的格式返回 Lua 引擎所使用的内存大小
*   `maxmemory`: maxmemory配置指令的值
*   `maxmemory_human`: 以人类可读的格式返回 maxmemory配置指令的值
*   `maxmemory_policy`: maxmemory-policy配置指令的值
*   `mem_fragmentation_ratio`: `used_memory_rss` 和 `used_memory` 之间的比率
*   `mem_allocator`: 在编译时指定的， Redis 所使用的内存分配器。可以是 libc 、 jemalloc 或者 tcmalloc 。
*   `active_defrag_running`: 指示活动碎片整理是否处于活动状态的标志
*   `lazyfree_pending_objects`: 等待释放的对象数（由于使用ASYNC选项调用UNLINK或FLUSHDB和FLUSHALL）

在理想情况下， used_memory_rss 的值应该只比 used_memory 稍微高一点儿。

当 rss > used ，且两者的值相差较大时，表示存在（内部或外部的）内存碎片。

内存碎片的比率可以通过 mem_fragmentation_ratio 的值看出。

当 used > rss 时，表示 Redis 的部分内存被操作系统换出到交换空间了，在这种情况下，操作可能会产生明显的延迟。

由于Redis无法控制其分配的内存如何映射到内存页，因此常住内存（used_memory_rss）很高通常是内存使用量激增的结果。

当 Redis 释放内存时，内存将返回给分配器，分配器可能会，也可能不会，将内存返还给操作系统。

如果 Redis 释放了内存，却没有将内存返还给操作系统，那么 used_memory 的值可能和操作系统显示的 Redis 内存占用并不一致。

查看 used_memory_peak 的值可以验证这种情况是否发生。

要获得有关服务器内存的其他内省信息，可以参考[`MEMORY STATS`](/commands/memory-stats)和[`MEMORY DOCTOR`](/commands/memory-doctor)。

下面是所有 **persistence** 相关的信息:

*   `loading`: 指示转储文件（dump）的加载是否正在进行的标志
*   `rdb_changes_since_last_save`: 自上次转储以来的更改次数
*   `rdb_bgsave_in_progress`: 指示RDB文件是否正在保存的标志
*   `rdb_last_save_time`: 上次成功保存RDB的基于纪年的时间戳
*   `rdb_last_bgsave_status`: 上次RDB保存操作的状态
*   `rdb_last_bgsave_time_sec`: 上次RDB保存操作的持续时间（以秒为单位）
*   `rdb_current_bgsave_time_sec`: 正在进行的RDB保存操作的持续时间（如果有）
*   `rdb_last_cow_size`: 上次RDB保存操作期间copy-on-write分配的字节大小
*   `aof_enabled`: 表示AOF记录已激活的标志
*   `aof_rewrite_in_progress`: 表示AOF重写操作正在进行的标志
*   `aof_rewrite_scheduled`: 表示一旦进行中的RDB保存操作完成，就会安排进行AOF重写操作的标志
*   `aof_last_rewrite_time_sec`: 上次AOF重写操作的持续时间，以秒为单位
*   `aof_current_rewrite_time_sec`: 正在进行的AOF重写操作的持续时间（如果有）
*   `aof_last_bgrewrite_status`: 上次AOF重写操作的状态
*   `aof_last_write_status`: 上一次AOF写入操作的状态
*   `aof_last_cow_size`: 上次AOF重写操作期间copy-on-write分配的字节大小

`changes_since_last_save`指的是从上次调用`SAVE`或者`BGSAVE`以来，在数据集中产生某种变化的操作的数量。

如果启用了AOF，则会添加以下这些额外的字段：

*   `aof_current_size`: 当前的AOF文件大小
*   `aof_base_size`: 上次启动或重写时的AOF文件大小
*   `aof_pending_rewrite`: 指示AOF重写操作是否会在当前RDB保存操作完成后立即执行的标志。
*   `aof_buffer_length`: AOF缓冲区大小
*   `aof_rewrite_buffer_length`: AOF重写缓冲区大小
*   `aof_pending_bio_fsync`: 在后台IO队列中等待fsync处理的任务数
*   `aof_delayed_fsync`: 延迟fsync计数器

如果正在执行加载操作，将会添加这些额外的字段：

*   `loading_start_time`: 加载操作的开始时间（基于纪元的时间戳）
*   `loading_total_bytes`: 文件总大小
*   `loading_loaded_bytes`: 已经加载的字节数
*   `loading_loaded_perc`: 已经加载的百分比
*   `loading_eta_seconds`: 预计加载完成所需的剩余秒数

下面是所有 **stats** 相关的信息:

*   `total_connections_received`: 服务器接受的连接总数
*   `total_commands_processed`: 服务器处理的命令总数
*   `instantaneous_ops_per_sec`: 每秒处理的命令数
*   `rejected_connections`: 由于`maxclients`限制而拒绝的连接数
*   `expired_keys`: key到期事件的总数
*   `evicted_keys`: 由于`maxmemory`限制而导致被驱逐的key的数量
*   `keyspace_hits`: 在主字典中成功查找到key的次数
*   `keyspace_misses`: 在主字典中查找key失败的次数
*   `pubsub_channels`: 拥有客户端订阅的全局pub/sub通道数
*   `pubsub_patterns`: 拥有客户端订阅的全局pub/sub模式数
*   `latest_fork_usec`: 最新fork操作的持续时间，以微秒为单位

下面是所有 **replication** 相关的信息:

*   `role`: 如果实例不是任何节点的从节点，则值是"master"，如果实例从某个节点同步数据，则是"slave"。
    请注意，一个从节点可以是另一个从节点的主节点（菊花链）。

如果实例是从节点，则会提供以下这些额外字段：

*   `master_host`: 主节点的Host名称或IP地址
*   `master_port`: 主节点监听的TCP端口
*   `master_link_status`: 连接状态（up或者down）
*   `master_last_io_seconds_ago`: 自上次与主节点交互以来，经过的秒数
*   `master_sync_in_progress`: 指示主节点正在与从节点同步

如果SYNC操作正在进行，则会提供以下这些字段：

*   `master_sync_left_bytes`: 同步完成前剩余的字节数
*   `master_sync_last_io_seconds_ago`: 在SYNC操作期间自上次传输IO以来的秒数

如果主从节点之间的连接断开了，则会提供一个额外的字段：

*   `master_link_down_since_seconds`: 自连接断开以来，经过的秒数

以下字段将始终提供：

*   `connected_slaves`: 已连接的从节点数

对每个从节点，将会添加以下行：

*   `slaveXXX`: id，地址，端口号，状态

下面是所有 **cpu** 相关的信息:

*   `used_cpu_sys`: 由Redis服务器消耗的系统CPU
*   `used_cpu_user`: 由Redis服务器消耗的用户CPU
*   `used_cpu_sys_children`: 由后台进程消耗的系统CPU
*   `used_cpu_user_children`: 由后台进程消耗的用户CPU

**commandstats**部分提供基于命令类型的统计，包含调用次数，这些命令消耗的总CPU时间，以及每个命令执行所消耗的平均CPU。

对于每一个命令类型，添加以下行：

*   `cmdstat_XXX`: `calls=XXX,usec=XXX,usec_per_call=XXX`

**cluster**部分当前只包含一个唯一的字段：

*   `cluster_enabled`: 表示已启用Redis集群

**keyspace**部分提供有关每个数据库的主字典的统计，统计信息是key的总数和过期的key的总数。

对于每个数据库，提供以下行：

*   `dbXXX`: `keys=XXX,expires=XXX`

[hcgcpgp]: http://code.google.com/p/google-perftools/
