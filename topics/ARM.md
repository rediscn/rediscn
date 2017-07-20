---
layout: topics
title: Redis topic ARM
permalink: topics/ARM.html
disqusIdentifier: topics/ARM
disqusUrl: http://redis.cn/topics/ARM.html
discuzTid: 2019
---

# Redis on ARM

## 基于ARM的Redis

Since the Redis 4.0 version (currently in release candidate state) Redis supports the ARM processor in general, and the Raspberry Pi specifically, as a
main platform, exactly like it happens for Linux/x86. It means that every new
release of Redis is tested on the Pi environment, and that we take this documentation page updated with information about supported devices
and information. While Redis already runs on Android, in the future we look
forward to extend our testing efforts to Android to also make it an officially
supported platform.

自从 Redis 的4.0版本（目前处于候选发布状态）Redis 支持了一般的ARM处理器，特别是将树莓派作为了主要平台，就像支持 Linux/x86 一样。这意味着每个 Redis 的新版本都将在树莓派环境中测试，并且我们会在本文档的页面更新有关支持设备的信息和消息。虽然 Redis 已经在 Android 上运行，但是将来我们期待将我们的测试工作扩展到 Android 上，并将其作为官方支持的平台。

We believe that Redis is ideal for IoT and Embedded devices for several
reasons:

我们认为 Redis 是物联网和嵌入式设备的理想选择的理由如下：

* Redis has a very small memory footprint and CPU requirements. Can run in small devices like the Raspberry Pi Zero without impacting the overall performance, using a small amount of memory, while delivering good performance for many use cases.

  Redis 具有非常小的内存占用和CPU需求。能够运行在非常小型的设备如树莓派0，而不会影响整体的性能，使用更少量的内存的同时，以高性能处理许多用例。

* The data structures of Redis are often a good way to model IoT/embedded use cases. For example in order to accumulate time series data, to receive or queue commands to execute or responses to send back to the remote servers and so forth.

  Redis 的数据结构对物联网和嵌入式用例建模非常有帮助。例如，为了累计时间序列数据，可以接收或排队要执行的命令或者以发送回远程服务器作为响应等等。

* Modeling data inside Redis can be very useful in order to make in-device decisions for appliances that must respond very quickly or when the remote servers are offline.

  Redis 中建模的数据对必须快速响应的设备，或者当远程服务器下线时的设备进行设备内的决策是非常有用的。

* Redis can be used as an interprocess communication system between the processes running in the device.

  Redis 能够被用来作为运行在设备间的内部通信系统。

* The append only file storage of Redis is well suited for the SSD cards.

  Redis 的 AOF 持久化机制非常适合 SSD 卡。

## Redis /proc/cpu/alignment requirements

## Redis 的/proc/cpu/alignment要求 

Linux on ARM allows to trap unaligned accesses and fix them inside the kernel
in order to continue the execution of the offending program instead of
generating a SIGBUS. Redis 4.0 and greater are fixed in order to avoid any kind
of unaligned access, so there is no need to have a specific value for this
kernel configuration. Even when kernel alignment fixing is disabled Redis should run as expected.

ARM 上的 Linux允许捕获未对齐的访问并且在内核中修复他们，是为了以便继续执行非法程序而不是产生一个 SIGBUS 信号。Redis 4.0 以及更高版本已经修复对各种类型的内存未对齐访问，所以不需要为内核配置设置特定的值。即使内核固定对齐模式被禁止，Redis 也能正常运行。

## Building Redis in the Pi

## 在树莓派上安装 Redis

* Grab the latest commit of the Redis 4.0 branch.

  获取最新的 Redis 4.0 分支。

* Just use `make` as usually to create the executable.

  只需使用`make`来创建可执行文件。

There is nothing special in the process. The only difference is that by default, Redis uses the libc allocator instead of defaulting to Jemalloc as it does in other Linux based environments. This is because we believe that for the small use cases inside embedded devices, memory fragmentation is unlikely to be a problem. Moreover Jemalloc on ARM may not be as tested as the libc allocator.

这个过程没有什么特别之处。唯一的不同是，默认情况下，Redis 使用 libc 的内存分配器而不是默认的 Jemalloc，就像它在其他基于Linux平台上一样。这是因为我么认为，对应小型的嵌入式设备的用例，内存碎片不太可能是一个问题。此外，ARM 上的 Jemalloc 可能无法像 libc 的内存分配器那样测试。

## Performance

## 性能

Performance testing of Redis was performed in the Raspberry Pi 3 and in the
original model B Pi. The difference between the two Pis in terms of delivered performance is quite big. The benchmarks were performed via the loopback interface, since most use cases will probably use Redis from within the device and not via the network.

Redis 的性能测试在树莓派3和原型B派中进行。两者不同在交付性能上有相当的的差别。在回路接口执行基准测试，是因为大多数的用例可能会使用设备内的 Redis 而不是通过网络。

Raspberry Pi 3:

树莓派3：

* Test 1 : 5 millions writes with 1 million keys (even distribution among keys).  No persistence, no pipelining. 28,000 ops/sec.

  测试1：写入100万个键（分布在键中）的500万个请求。没有持久化和流水线机制。28,000次/秒。

* Test 2: Like test 1 but with pipelining using groups of 8 operations: 80,000 ops/sec.

  测试2：像测试1一样，但是使用流水线机制，，8个操作一组：80,000次/秒。

* Test 3: Like test 1 but with AOF enabled, fsync 1 sec: 23,000 ops/sec

  测试3：像测试1一样，但是开启 AOF 持久化机制，fsync 1 sec：23,000 次/秒。

* Test 4: Like test 3, but with an AOF rewrite in progress: 21,000 ops/sec

  测试4：像测试3一样，但是同时进行 AOF 重写操作：21,000次/秒。

Raspberry Pi 1 model B:

树莓派1model B：

* Test 1 : 5 millions writes with 1 million keys (even distribution among keys).  No persistence, no pipelining.  2,200 ops/sec.

  测试1：写入100万个键（分布在键中）的500万个请求。没有持久化和流水线机制。2,200 次/秒。

* Test 2: Like test 1 but with pipelining using groups of 8 operations: 8,500 ops/sec.

  测试2：像测试1一样，但是使用流水线机制，，8个操作一组：8,500次/秒。

* Test 3: Like test 1 but with AOF enabled, fsync 1 sec: 1,820 ops/sec

  测试3：像测试1一样，但是开启 AOF 持久化机制，fsync 1 sec：1,820 次/秒。

* Test 4: Like test 3, but with an AOF rewrite in progress: 1,000 ops/sec

  测试4：像测试3一样，但是同时进行 AOF 重写操作：1,000次/秒。

The benchmarks above are referring to simple SET/GET operations. The performance is similar for all the Redis fast operations (not running in linear time). However sorted sets may show slightly slow numbers.

以上基准测试是涉及简单的 SET/GET 操作。所有 Redis 的快速操作（运行呈非线程）的性能都是相似的，然而有序集合可能略微有些慢。
