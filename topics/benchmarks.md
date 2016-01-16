---
layout: topics
title: REDIS benchmarks -- Redis中文资料站
permalink: topics/benchmarks.html
disqusIdentifier: topics_benchmarks
disqusUrl: http://redis.cn/topics/benchmarks.html
---

# Redis有多快?

Redis 自带了一个叫 `redis-benchmark` 的工具来模拟 N 个客户端同时发出 M 个请求。 （类似于 Apache ab 程序）。你可以使用 redis-benchmark -h 来查看基准参数。

	以下参数被支持：

    Usage: redis-benchmark [-h <host>] [-p <port>] [-c <clients>] [-n <requests]> [-k <boolean>]

     -h <hostname>      Server hostname (default 127.0.0.1)
     -p <port>          Server port (default 6379)
     -s <socket>        Server socket (overrides host and port)
     -a <password>      Password for Redis Auth
     -c <clients>       Number of parallel connections (default 50)
     -n <requests>      Total number of requests (default 100000)
     -d <size>          Data size of SET/GET value in bytes (default 2)
     -dbnum <db>        SELECT the specified db number (default 0)
     -k <boolean>       1=keep alive 0=reconnect (default 1)
     -r <keyspacelen>   Use random keys for SET/GET/INCR, random values for SADD
      Using this option the benchmark will expand the string __rand_int__
      inside an argument with a 12 digits number in the specified range
      from 0 to keyspacelen-1. The substitution changes every time a command
      is executed. Default tests use this to hit random keys in the
      specified range.
     -P <numreq>        Pipeline <numreq> requests. Default 1 (no pipeline).
     -q                 Quiet. Just show query/sec values
     --csv              Output in CSV format
     -l                 Loop. Run the tests forever
     -t <tests>         Only run the comma separated list of tests. The test
                        names are the same as the ones produced as output.
     -I                 Idle mode. Just open N idle connections and wait.

你需要在基准测试之前启动一个 Redis 实例。

一般这样启动测试：

    redis-benchmark -q -n 100000

这个工具使用起来非常方便，同时你可以使用自己的基准测试工具， 不过开始基准测试时候，我们需要注意一些细节。

只运行一些测试用例的子集
---

你不必每次都运行 redis-benchmark 默认的所有测试。 使用 -t 参数可以选择你需要运行的测试用例，比如下面的范例：

    $ redis-benchmark -t set,lpush -n 100000 -q
    SET: 74239.05 requests per second
    LPUSH: 79239.30 requests per second

在上面的测试中，我们只运行了 SET 和 LPUSH 命令， 并且运行在安静模式中（使用 -q 参数）。
也可以直接指定命令来直接运行，比如下面的范例：

    $ redis-benchmark -n 100000 -q script load "redis.call('set','foo','bar')"
    script load redis.call('set','foo','bar'): 69881.20 requests per second

选择测试键的范围大小
---

默认情况下面，基准测试使用单一的 key。在一个基于内存的数据库里， 单一 key 测试和真实情况下面不会有巨大变化。当然，使用一个大的 key 范围空间， 可以模拟现实情况下面的缓存不命中情况。

这时候我们可以使用 -r 命令。比如，假设我们想设置 10 万随机 key 连续 SET 100 万次，我们可以使用下列的命令：

    $ redis-cli flushall
    OK

    $ redis-benchmark -t set -r 100000 -n 1000000
    ====== SET ======
      1000000 requests completed in 13.86 seconds
      50 parallel clients
      3 bytes payload
      keep alive: 1

    99.76% `<=` 1 milliseconds
    99.98% `<=` 2 milliseconds
    100.00% `<=` 3 milliseconds
    100.00% `<=` 3 milliseconds
    72144.87 requests per second

    $ redis-cli dbsize
    (integer) 99993

使用 pipelining
---

默认情况下，每个客户端都是在一个请求完成之后才发送下一个请求 （benchmark 会模拟 50 个客户端除非使用 -c 指定特别的数量）， 这意味着服务器几乎是按顺序读取每个客户端的命令。Also RTT is payed as well.

真实世界会更复杂，Redis 支持 [/topics/pipelining](pipelining)，使得可以一次性执行多条命令成为可能。 Redis pipelining 可以提高服务器的 TPS。
下面这个案例是在 Macbook air 11" 上使用 pipelining 组织 16 条命令的测试范例：

    $ redis-benchmark -n 1000000 -t set,get -P 16 -q
    SET: 403063.28 requests per second
    GET: 508388.41 requests per second

记得在多条命令需要处理时候使用 pipelining。

陷阱和错误的认识
---------------------------

第一点是显而易见的：基准测试的黄金准则是使用相同的标准。 用相同的任务量测试不同版本的 Redis，或者用相同的参数测试测试不同版本 Redis。 如果把 Redis 和其他工具测试，那就需要小心功能细节差异。

+ Redis 是一个服务器：所有的命令都包含网络或 IPC 消耗。这意味着和它和 SQLite， Berkeley DB， Tokyo/Kyoto Cabinet 等比较起来无意义， 因为大部分的消耗都在网络协议上面。
+ Redis 的大部分常用命令都有确认返回。有些数据存储系统则没有（比如 MongoDB 的写操作没有返回确认）。把 Redis 和其他单向调用命令存储系统比较意义不大。
+ 简单的循环操作 Redis 其实不是对 Redis 进行基准测试，而是测试你的网络（或者 IPC）延迟。想要真正测试 Redis，需要使用多个连接（比如 redis-benchmark)， 或者使用 pipelining 来聚合多个命令，另外还可以采用多线程或多进程。
+ Redis 是一个内存数据库，同时提供一些可选的持久化功能。 如果你想和一个持久化服务器（MySQL, PostgreSQL 等等） 对比的话， 那你需要考虑启用 AOF 和适当的 fsync 策略。
+ Redis 是单线程服务。它并没有设计为多 CPU 进行优化。如果想要从多核获取好处， 那就考虑启用多个实例吧。将单实例 Redis 和多线程数据库对比是不公平的。

一个普遍的误解是 redis-benchmark 特意让基准测试看起来更好， 所表现出来的数据像是人造的，而不是真实产品下面的。

Redis-benchmark 程序可以简单快捷的对给定硬件条件下面的机器计算出性能参数。 但是，通常情况下面这并不是 Redis 服务器可以达到的最大吞吐量。 事实上，使用 pipelining 和更快的客户端（hiredis）可以达到更大的吞吐量。 redis-benchmark 默认情况下面仅仅使用并发来提高吞吐量（创建多条连接）。 它并没有使用 pipelining 或者其他并行技术（仅仅多条连接，而不是多线程）。

如果想使用 pipelining 模式来进行基准测试（了达到更高吞吐量），可以使用 -P 参数。这种方案的确可以提高性能，有很多使用 Redis 的应用在生产环境中这样做。

最后，基准测试需要使用相同的操作和数据来对比，如果这些不一样， 那么基准测试是无意义的。

比如，Redis 和 memcached 可以在单线程模式下面对比 GET/SET 操作。 两者都是内存数据库，协议也基本相同，甚至把多个请求合并为一条请求的方式也类似 （pipelining）。在使用相同数量的连接后，这个对比是很有意义的。

下面这个很不错例子是在 Redis（antirez）和 memcached（dormando）测试的。

[antirez 1 - On Redis, Memcached, Speed, Benchmarks and The Toilet](http://antirez.com/post/redis-memcached-benchmark.html)

[dormando - Redis VS Memcached (slightly better bench)](http://dormando.livejournal.com/525147.html)

[antirez 2 - An update on the Memcached/Redis benchmark](http://antirez.com/post/update-on-memcached-redis-benchmark.html)

你可以发现相同条件下面最终结果是两者差别不大。请注意最终测试时候， 两者都经过了充分优化。

最后，当特别高性能的服务器在基准测试时候（比如 Redis、memcached 这类）， 很难让服务器性能充分发挥，通常情况下，客户端回事瓶颈限制而不是服务器端。 在这种情况下面，客户端（比如 benchmark 程序自身）需要优化，或者使用多实例， 从而能达到最大的吞吐量。

影响 Redis 性能的因素
-----------------------------------

有几个因素直接决定 Redis 的性能。它们能够改变基准测试的结果， 所以我们必须注意到它们。一般情况下，Redis 默认参数已经可以提供足够的性能， 不需要调优。

+ 网络带宽和延迟通常是最大短板。建议在基准测试之前使用 ping 来检查服务端到客户端的延迟。根据带宽，可以计算出最大吞吐量。 比如将 4 KB 的字符串塞入 Redis，吞吐量是 100000 q/s，那么实际需要 3.2 Gbits/s 的带宽，所以需要 10 GBits/s 网络连接， 1 Gbits/s 是不够的。 在很多线上服务中，Redis 吞吐会先被网络带宽限制住，而不是 CPU。 为了达到高吞吐量突破 TCP/IP 限制，最后采用 10 Gbits/s 的网卡， 或者多个 1 Gbits/s 网卡。
+ CPU 是另外一个重要的影响因素，由于是单线程模型，Redis 更喜欢大缓存快速 CPU， 而不是多核。这种场景下面，比较推荐 Intel CPU。AMD CPU 可能只有 Intel CPU 的一半性能（通过对 Nehalem EP/Westmere EP/Sandy 平台的对比）。 当其他条件相当时候，CPU 就成了 redis-benchmark 的限制因素。
+ 在小对象存取时候，内存速度和带宽看上去不是很重要，但是对大对象（> 10 KB）， 它就变得重要起来。不过通常情况下面，倒不至于为了优化 Redis 而购买更高性能的内存模块。
+ Redis 在 VM 上会变慢。虚拟化对普通操作会有额外的消耗，Redis 对系统调用和网络终端不会有太多的 overhead。建议把 Redis 运行在物理机器上， 特别是当你很在意延迟时候。在最先进的虚拟化设备（VMWare）上面，redis-benchmark 的测试结果比物理机器上慢了一倍，很多 CPU 时间被消费在系统调用和中断上面。
+ 如果服务器和客户端都运行在同一个机器上面，那么 TCP/IP loopback 和 unix domain sockets 都可以使用。对 Linux 来说，使用 unix socket 可以比 TCP/IP loopback 快 50%。 默认 redis-benchmark 是使用 TCP/IP loopback。
当大量使用 pipelining 时候，unix domain sockets 的优势就不那么明显了。
+ 当大量使用 pipelining 时候，unix domain sockets 的优势就不那么明显了。
+ 当使用网络连接时，并且以太网网数据包在 1500 bytes 以下时， 将多条命令包装成 pipelining 可以大大提高效率。事实上，处理 10 bytes，100 bytes， 1000 bytes 的请求时候，吞吐量是差不多的，详细可以见下图。

![Data size impact](https://github.com/dspezia/redis-doc/raw/client_command/topics/Data_size.png)

+ 在多核 CPU 服务器上面，Redis 的性能还依赖 NUMA 配置和 处理器绑定位置。 最明显的影响是 redis-benchmark 会随机使用 CPU 内核。为了获得精准的结果， 需要使用固定处理器工具（在 Linux 上可以使用 taskset 或 numactl）。 最有效的办法是将客户端和服务端分离到两个不同的 CPU 来高校使用三级缓存。 这里有一些使用 4 KB 数据 SET 的基准测试，针对三种 CPU（AMD Istanbul, Intel Nehalem EX， 和 Intel Westmere）使用不同的配置。请注意， 这不是针对 CPU 的测试。

![NUMA chart](https://github.com/dspezia/redis-doc/raw/6374a07f93e867353e5e946c1e39a573dfc83f6c/topics/NUMA_chart.gif)

+ 在高配置下面，客户端的连接数也是一个重要的因素。得益于 epoll/kqueue， Redis 的事件循环具有相当可扩展性。Redis 已经在超过 60000 连接下面基准测试过， 仍然可以维持 50000 q/s。一条经验法则是，30000 的连接数只有 100 连接的一半吞吐量。 下面有一个关于连接数和吞吐量的测试。

![connections chart](https://github.com/dspezia/redis-doc/raw/system_info/topics/Connections_chart.png)

+ 在高配置下面，可以通过调优 NIC 来获得更高性能。最高性能在绑定 Rx/Tx 队列和 CPU 内核下面才能达到，还需要开启 RPS（网卡中断负载均衡）。更多信息可以在 [thread](https://groups.google.com/forum/#!msg/redis-db/gUhc19gnYgc/BruTPCOroiMJ) 。Jumbo frames 还可以在大对象使用时候获得更高性能。

+ 在不同平台下面，Redis 可以被编译成不同的内存分配方式（libc malloc, jemalloc, tcmalloc），他们在不同速度、连续和非连续片段下会有不一样的表现。 如果你不是自己编译的 Redis，可以使用 INFO 命令来检查内存分配方式。 请注意，大部分基准测试不会长时间运行来感知不同分配模式下面的差异， 只能通过生产环境下面的 Redis 实例来查看。

其他需要注意的点
------------------------

任何基准测试的一个重要目标是获得可重现的结果，这样才能将此和其他测试进行对比。

+ 一个好的实践是尽可能在隔离的硬件上面测试。如果没法实现，那就需要检测 benchmark 没有受其他服务器活动影响。
+ 有些配置（桌面环境和笔记本，有些服务器也会）会使用可变的 CPU 分配策略。 这种策略可以在 OS 层面配置。有些 CPU 型号相对其他能更好的调整 CPU 负载。 为了达到可重现的测试结果，最好在做基准测试时候设定 CPU 到最高使用限制。
+ 一个重要因素是配置尽可能大内存，千万不要使用 SWAP。注意 32 位和 64 位 Redis 有不同的内存限制。
+ 如果你计划在基准测试时候使用 RDB 或 AOF，请注意不要让系统同时有其他 I/O 操作。 避免将 RDB 或 AOF 文件放到 NAS 或 NFS 共享或其他依赖网络的存储设备上面（比如 Amazon EC2 上 的 EBS）。
+ 将 Redis 日志级别设置到 warning 或者 notice。避免将日志放到远程文件系统。
+ 避免使用检测工具，它们会影响基准测试结果。使用 INFO 来查看服务器状态没问题， 但是使用 MONITOR 将大大影响测试准确度。

# 不同云主机和物理机器上的基准测试结果

* 这些测试模拟了 50 客户端和 200w 请求。
* 使用了 Redis 2.6.14。
* 使用了 loopback 网卡。
* key 的范围是 100 w。
* 同时测试了 有 pipelining 和没有的情况（16 条命令使用 pipelining）。

**Intel(R) Xeon(R) CPU E5520  @ 2.27GHz (with pipelining)**

    $ ./redis-benchmark -r 1000000 -n 2000000 -t get,set,lpush,lpop -P 16 -q
    SET: 552028.75 requests per second
    GET: 707463.75 requests per second
    LPUSH: 767459.75 requests per second
    LPOP: 770119.38 requests per second

**Intel(R) Xeon(R) CPU E5520  @ 2.27GHz (without pipelining)**

    $ ./redis-benchmark -r 1000000 -n 2000000 -t get,set,lpush,lpop -q
    SET: 122556.53 requests per second
    GET: 123601.76 requests per second
    LPUSH: 136752.14 requests per second
    LPOP: 132424.03 requests per second

**Linode 2048 instance (with pipelining)**

    $ ./redis-benchmark -r 1000000 -n 2000000 -t get,set,lpush,lpop -q -P 16
    SET: 195503.42 requests per second
    GET: 250187.64 requests per second
    LPUSH: 230547.55 requests per second
    LPOP: 250815.16 requests per second

**Linode 2048 instance (without pipelining)**

    $ ./redis-benchmark -r 1000000 -n 2000000 -t get,set,lpush,lpop -q
    SET: 35001.75 requests per second
    GET: 37481.26 requests per second
    LPUSH: 36968.58 requests per second
    LPOP: 35186.49 requests per second

## 更多使用 pipeline 的测试

    $ redis-benchmark -n 100000

    ====== SET ======
      100007 requests completed in 0.88 seconds
      50 parallel clients
      3 bytes payload
      keep alive: 1

    58.50% <= 0 milliseconds
    99.17% <= 1 milliseconds
    99.58% <= 2 milliseconds
    99.85% <= 3 milliseconds
    99.90% <= 6 milliseconds
    100.00% <= 9 milliseconds
    114293.71 requests per second

    ====== GET ======
      100000 requests completed in 1.23 seconds
      50 parallel clients
      3 bytes payload
      keep alive: 1

    43.12% <= 0 milliseconds
    96.82% <= 1 milliseconds
    98.62% <= 2 milliseconds
    100.00% <= 3 milliseconds
    81234.77 requests per second

    ====== INCR ======
      100018 requests completed in 1.46 seconds
      50 parallel clients
      3 bytes payload
      keep alive: 1

    32.32% <= 0 milliseconds
    96.67% <= 1 milliseconds
    99.14% <= 2 milliseconds
    99.83% <= 3 milliseconds
    99.88% <= 4 milliseconds
    99.89% <= 5 milliseconds
    99.96% <= 9 milliseconds
    100.00% <= 18 milliseconds
    68458.59 requests per second

    ====== LPUSH ======
      100004 requests completed in 1.14 seconds
      50 parallel clients
      3 bytes payload
      keep alive: 1

    62.27% <= 0 milliseconds
    99.74% <= 1 milliseconds
    99.85% <= 2 milliseconds
    99.86% <= 3 milliseconds
    99.89% <= 5 milliseconds
    99.93% <= 7 milliseconds
    99.96% <= 9 milliseconds
    100.00% <= 22 milliseconds
    100.00% <= 208 milliseconds
    88109.25 requests per second

    ====== LPOP ======
      100001 requests completed in 1.39 seconds
      50 parallel clients
      3 bytes payload
      keep alive: 1

    54.83% <= 0 milliseconds
    97.34% <= 1 milliseconds
    99.95% <= 2 milliseconds
    99.96% <= 3 milliseconds
    99.96% <= 4 milliseconds
    100.00% <= 9 milliseconds
    100.00% <= 208 milliseconds
    71994.96 requests per second

注意：包大小从 256 到 1024 或者 4096 bytes 不会改变结果的量级 （但是到 1024 bytes 后，GETs 操作会变慢）。同样的，50 到 256 客户端的测试结果相同。 10 个客户端时候，吞吐量会变小（译者按：总量到不了最大吞吐量）。

不同机器可以获的不一样的结果，下面是 Intel T5500 1.66 GHz 在 Linux 2.6 下面的结果：

    $ ./redis-benchmark -q -n 100000
    SET: 53684.38 requests per second
    GET: 45497.73 requests per second
    INCR: 39370.47 requests per second
    LPUSH: 34803.41 requests per second
    LPOP: 37367.20 requests per second

另外一个是 64 位 Xeon L5420 2.5 GHz 的结果：

    $ ./redis-benchmark -q -n 100000
    PING: 111731.84 requests per second
    SET: 108114.59 requests per second
    GET: 98717.67 requests per second
    INCR: 95241.91 requests per second
    LPUSH: 104712.05 requests per second
    LPOP: 93722.59 requests per second


# 高性能硬件下面的基准测试

* Redis **2.4.2**
* 默认连接数，数据包大小 256 bytes。
* Linux 是 *SLES10 SP3 2.6.16.60-0.54.5-smp*，CPU 是  *Intel X5670 @ 2.93 GHz*.
* 固定 CPU，但是使用不同 CPU 内核。

使用 unix domain socket：

    $ numactl -C 6 ./redis-benchmark -q -n 100000 -s /tmp/redis.sock -d 256
    PING (inline): 200803.22 requests per second
    PING: 200803.22 requests per second
    MSET (10 keys): 78064.01 requests per second
    SET: 198412.69 requests per second
    GET: 198019.80 requests per second
    INCR: 200400.80 requests per second
    LPUSH: 200000.00 requests per second
    LPOP: 198019.80 requests per second
    SADD: 203665.98 requests per second
    SPOP: 200803.22 requests per second
    LPUSH (again, in order to bench LRANGE): 200000.00 requests per second
    LRANGE (first 100 elements): 42123.00 requests per second
    LRANGE (first 300 elements): 15015.02 requests per second
    LRANGE (first 450 elements): 10159.50 requests per second
    LRANGE (first 600 elements): 7548.31 requests per second

使用 TCP loopback：

    $ numactl -C 6 ./redis-benchmark -q -n 100000 -d 256
    PING (inline): 145137.88 requests per second
    PING: 144717.80 requests per second
    MSET (10 keys): 65487.89 requests per second
    SET: 142653.36 requests per second
    GET: 142450.14 requests per second
    INCR: 143061.52 requests per second
    LPUSH: 144092.22 requests per second
    LPOP: 142247.52 requests per second
    SADD: 144717.80 requests per second
    SPOP: 143678.17 requests per second
    LPUSH (again, in order to bench LRANGE): 143061.52 requests per second
    LRANGE (first 100 elements): 29577.05 requests per second
    LRANGE (first 300 elements): 10431.88 requests per second
    LRANGE (first 450 elements): 7010.66 requests per second
    LRANGE (first 600 elements): 5296.61 requests per second
