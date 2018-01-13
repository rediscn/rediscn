---
layout: topics
title: REDIS sentinel-old
permalink: topics/replication.html
disqusIdentifier: topics_replication
disqusUrl: http://redis.cn/topics/replication.html
discuzTid: 864
---

> 翻译自 [Redis Replication](https://redis.io/topics/replication)

# 复制
在 Redis 复制的基础上，使用和配置主从复制非常简单，能使得从 Redis 服务器（下文称 slave）能精确得复制主 Redis 服务器（下文称 master）的内容。每次当 slave 和 master 之间的连接断开时， slave 会自动重连到 master 上，并且无论这期间 master 发生了什么， slave 都将尝试让自身成为 master 的精确副本。

这个系统的运行依靠三个主要的机制：

* 当一个 master 实例和一个 slave 实例连接正常时， master 会发送一连串的命令流来保持对 slave 的更新，以便于将自身数据集的改变复制给 slave ， ：包括客户端的写入、key 的过期或被逐出等等。

* 当 master 和 slave 之间的连接断开之后，因为网络问题、或者是主从意识到连接超时， slave 重新连接上 master 并会尝试进行部分重同步：这意味着它会尝试只获取在断开连接期间内丢失的命令流。

* 当无法进行部分重同步时， slave 会请求进行全量重同步。这会涉及到一个更复杂的过程，例如 master 需要创建所有数据的快照，将之发送给 slave ，之后在数据集更改时持续发送命令流到 slave 。

Redis使用默认的异步复制，其特点是高延迟和高性能，是绝大多数 Redis 用例的自然复制模式。但是，从 Redis 服务器会异步地确认其从主 Redis 服务器周期接收到的数据量。

客户端可以使用 [WAIT](https://redis.io/commands/wait) 命令来请求同步复制某些特定的数据。但是，WAIT 命令只能确保在其他 Redis 实例中有指定数量的已确认的副本：在故障转移期间，由于不同原因的故障转移或是由于 Redis 持久性的实际配置，故障转移期间确认的写入操作可能仍然会丢失。你可以查看 Sentinel 或 Redis 集群文档，了解关于高可用性和故障转移的更多信息。本文的其余部分主要描述 Redis 基本复制功能的基本特性。

接下来的是一些关于 Redis 复制的非常重要的事实：

* Redis 使用异步复制，slave 和 master 之间异步地确认处理的数据量

* 一个 master 可以拥有多个 slave 

*  slave 可以接受其他 slave 的连接。除了多个 slave 可以连接到同一个 master 之外， slave 之间也可以像层叠状的结构（cascading-like structure）连接到其他 slave 。自 Redis 4.0 起，所有的 sub-slave 将会从 master 收到完全一样的复制流。

* Redis 复制在 master 侧是非阻塞的。这意味着 master 在一个或多个 slave 进行初次同步或者是部分重同步时，可以继续处理查询请求。

* 复制在 slave 侧大部分也是非阻塞的。当 slave 进行初次同步时，它可以使用旧数据集处理查询请求，假设你在 redis.conf 中配置了让 Redis 这样做的话。否则，你可以配置如果复制流断开， Redis slave 会返回一个 error 给客户端。但是，在初次同步之后，旧数据集必须被删除，同时加载新的数据集。 slave 在这个短暂的时间窗口内（如果数据集很大，会持续较长时间），会阻塞到来的连接请求。自 Redis 4.0 开始，可以配置 Redis 使删除旧数据集的操作在另一个不同的线程中进行，但是，加载新数据集的操作依然需要在主线程中进行并且会阻塞 slave 。

* 复制既可以被用在可伸缩性，以便只读查询可以有多个 slave 进行（例如 O(N) 复杂度的慢操作可以被下放到 slave ），或者仅用于数据安全。

* 可以使用复制来避免 master 将全部数据集写入磁盘造成的开销：一种典型的技术是配置你的 master Redis.conf 以避免对磁盘进行持久化，然后连接一个 slave ，其配置为不定期保存或是启用 AOF。但是，这个设置必须小心处理，因为重新启动的 master 程序将从一个空数据集开始：如果一个 slave 试图与它同步，那么这个 slave 也会被清空。

## 当 master 关闭持久化时，复制的安全性
在使用 Redis 复制功能时的设置中，强烈建议在 master 和在 slave 中启用持久化。当不可能启用时，例如由于非常慢的磁盘性能而导致的延迟问题，**应该配置实例来避免重置后自动重启**。

为了更好地理解为什么关闭了持久化并配置了自动重启的 master 是危险的，检查以下故障模式，这些故障模式中数据会从 master 和所有 slave 中被删除：

1. 我们设置节点 A 为 master 并关闭它的持久化设置，节点 B 和 C 从 节点 A 复制数据。

2. 节点 A 崩溃，但是他有一些自动重启的系统可以重启进程。但是由于持久化被关闭了，节点重启后其数据集合为空。

3. 节点 B 和 节点 C 会从节点 A 复制数据，但是节点 A 的数据集是空的，因此复制的结果是它们会销毁自身之前的数据副本。

当 Redis Sentinel 被用于高可用并且 master 关闭持久化，这时如果允许自动重启进程也是很危险的。例如， master 可以重启的足够快以致于 Sentinel 没有探测到故障，因此上述的故障模式也会发生。

任何时候数据安全性都是很重要的，所以如果 master 使用复制功能的同时未配置持久化，那么自动重启进程这项应该被禁用。

## Redis 复制功能是如何工作的
每一个 Redis  master 都有一个 replication ID ：这是一个较大的伪随机字符串，标记了一个给定的数据集。每个 master 也持有一个偏移量，master 将自己产生的复制流发送给 slave 时，发送多少个字节的数据，自身的偏移量就会增加多少，目的是当有新的操作修改自己的数据集时，它可以以此更新 slave 的状态。复制偏移量即使在没有一个 slave 连接到 master 时，也会自增，所以基本上每一对给定的

> Replication ID, offset

都会标识一个 master 数据集的确切版本。

当 slave 连接到 master 时，它们使用 PSYNC 命令来发送它们记录的旧的 master replication ID 和它们至今为止处理的偏移量。通过这种方式， master 能够仅发送 slave 所需的增量部分。但是如果 master 的缓冲区中没有足够的命令积压缓冲记录，或者如果 slave 引用了不再知道的历史记录（replication ID），则会转而进行一个全量重同步：在这种情况下， slave 会得到一个完整的数据集副本，从头开始。

下面是一个全量同步的工作细节：

 master 开启一个后台保存进程，以便于生产一个 RDB 文件。同时它开始缓冲所有从客户端接收到的新的写入命令。当后台保存完成时， master 将数据集文件传输给 slave， slave将之保存在磁盘上，然后加载文件到内存。再然后 master 会发送所有缓冲的命令发给 slave。这个过程以指令流的形式完成并且和 Redis 协议本身的格式相同。

你可以用 telnet 自己进行尝试。在服务器正在做一些工作的同时连接到 Redis 端口并发出 [SYNC](https://redis.io/commands/sync) 命令。你将会看到一个批量传输，并且之后每一个 master 接收到的命令都将在 telnet 回话中被重新发出。事实上 SYNC 是一个旧协议，在新的 Redis 实例中已经不再被使用，但是其仍然向后兼容：但它不允许部分重同步，所以现在 **PSYNC** 被用来替代 SYNC。

之前说过，当主从之间的连接因为一些原因崩溃之后， slave 能够自动重连。如果 master 收到了多个 slave 要求同步的请求，它会执行一个单独的后台保存，以便于为多个 slave 服务。

## 无需磁盘参与的复制
正常情况下，一个全量重同步要求在磁盘上创建一个 RDB 文件，然后将它从磁盘加载进内存，然后 slave以此进行数据同步。

如果磁盘性能很低的话，这对 master 是一个压力很大的操作。Redis 2.8.18 是第一个支持无磁盘复制的版本。在此设置中，子进程直接发送 RDB 文件给 slave，无需使用磁盘作为中间储存介质。

## 配置
配置基本的 Redis 复制功能是很简单的：只需要将以下内容加进 slave 的配置文件：

> slaveof 192.168.1.1 6379

当然你需要用你自己的 master  IP 地址（或者主机名）和端口替换掉 192.168.1.1 6379。另一种方法，你也可以使用 [SLAVEOF](https://redis.io/commands/slaveof) 命令， master 会开启一个跟 slave 间的同步。

还有一些参数用于调节内存中保存的缓冲积压部分（replication backlog），以便执行部分重同步。详见 redis.conf 和 Redis Distribution 了解更多信息。

无磁盘复制可以使用 repl-diskless-sync 配置参数。repl-diskless-sync-delay 参数可以延迟启动数据传输，目的可以在第一个 slave就绪后，等待更多的 slave就绪。可以在 Redis Distribution 例子中的 redis.conf 中看到更多细节信息。

## 只读性质的 slave
自从 Redis 2.6 之后， slave 支持只读模式且默认开启。redis.conf 文件中的 slave-read-only 变量控制这个行为，且可以在运行时使用 [CONFIG SET](https://redis.io/commands/config-set) 来随时开启或者关闭。

只读模式下的 slave 将会拒绝所有写入命令，因此实践中不可能由于某种出错而将数据写入 slave 。但这并不意味着该特性旨在将一个 slave 实例暴露到 Internet ，或者更广泛地说，将之暴露在存在不可信客户端的网络，因为像 **DEBUG** 或者 **CONFIG** 这样的管理员命令仍在启用。但是，在 redis.conf 文件中使用 rename-command 指令可以禁用上述管理员命令以提高只读实例的安全性。

您也许想知道为什么可以还原只读设置，并有可以通过写入操作来设置 slave 实例。如果 slave 跟 master 在同步或者 slave 在重启，那么这些写操作将会无效，但是将短暂数据存储在 writable slave 中还是有一些合理的用例的。

例如，计算 slow Set 或者 Sorted Set 的操作并将它们存储在本地 key 中是多次观察到的使用 writable slave 的用例。

但是注意，4.0 版本之前的 writable slaves 不能用生存时间来淘汰 key 。这意味着，如果你使用 [EXPIRE](https://redis.io/commands/expire) 或者其他命令为 key 设置了最大 TTL 的话，你将会在键值计数（count of keys）中看到这个 key ，并且它还在内存中。所以总的来说，将 writable slaves 和设置过 TTL 的 key 混用将会导致问题。

Redis 4.0 RC3 及更高版本彻底解决了这个问题，现在 writable slaves 能够像 master 一样驱逐 TTL 设置过的 key 了，但 DB 编号大于 63（但默认情况下，Redis实例只有16个数据库）的 key 除外。

另请注意，由于 Redis 4.0 writable slaves 仅能本地，并且不会将数据传播到与该实例相连的 sub-slave 上。sub-slave 将总是接收与最顶层 master 向 intermediate slaves 发送的复制流相同的复制流。所以例如在以下设置中： 

> A ---> B ----> C

及时节点 B 是可写的，C 也不会看到 B 的写入，而是将拥有和 master 实例 A 相同的数据集。

## 设置一个 slave 对 master 进行验证
如果你的 master 通过 requirepass 设置了密码，则在所有同步操作中配置 slave 使用该密码是很简单的。

要在正在运行的实例上执行此操作，请使用 redis-cli 并输入：

> config set masterauth <password>

要永久设置的话，请将其添加到您的配置文件中：

> masterauth <password>

## 允许只写入 N 个附加的副本

从Redis 2.8开始，只有当至少有 N 个 slave 连接到 master 时，才有可能配置 Redis master 接受写查询。

但是，由于 Redis 使用异步复制，因此无法确保 slave 是否实际接收到给定的写命令，因此总会有一个数据丢失窗口。

以下是该特性的工作原理：

* Redis slave 每秒钟都会 ping master，确认已处理的复制流的数量。
* Redis master 会记得上一次从每个 slave 都收到 ping 的时间。
* 用户可以配置一个最小的 slave 数量，使得它滞后 <= 最大秒数。

如果至少有N个从站，并且滞后小于M秒，则写入将被接受。

您可能认为这是一个尽力而为的数据安全机制，对于给定的写入来说，不能保证一致性，但至少数据丢失的时间窗限制在给定的秒数内。一般来说，绑定的数据丢失比不绑定的更好。

如果条件不满足，master 将会回复一个 error 并且写入将不被接受。

这个特性有两个配置参数：
* min-slaves-to-write <slave 数量>
* min-slaves-max-lag <秒数>

有关更多信息，请查看随 Redis 源代码发行版一起提供的示例 redis.conf 文件。

## Redis 复制如何处理 key 的过期
Redis 的过期机制可以限制 key 的生存时间。此功能取决于 Redis 实例计算时间的能力，但是，即使使用 Lua 脚本更改了这些 key，Redis slaves 也能正确地复制具有过期时间的 key。

为了实现这样的功能，Redis 不能依靠主从使用同步时钟，因为这是一个无法解决的并且会导致 race condition 和数据集不一致的问题，所以 Redis 使用三种主要的技术使过期的 key 的复制能够正确工作：

* slave 不会让 key 过期，而是等待 master 让 key 过期。当一个 master 让一个 key 到期（或由于 LRU 算法将之驱逐）时，它会合成一个 DEL 命令并传输到所有的 slave。

* 但是，由于这是 master 驱动的 key 过期行为，master 无法及时提供 DEL 命令，所以有时候 slave 的内存中仍然可能存在在逻辑上已经过期的 key 。为了处理这个问题，slave 使用它的逻辑时钟以报告只有在不违反数据集的一致性的读取操作（从主机的新命令到达）中才存在 key。用这种方法，slave 避免报告逻辑过期的 key 仍然存在。在实际应用中，使用 slave 程序进行缩放的 HTML 碎片缓存，将避免返回已经比期望的时间更早的数据项。

* 在Lua脚本执行期间，不执行任何 key 过期操作。当一个Lua脚本运行时，从概念上讲，master 中的时间是被冻结的，这样脚本运行的时候，一个给定的键要么存在要么不存在。这可以防止 key 在脚本中间过期，保证将相同的脚本发送到 slave ，从而在二者的数据集中产生相同的效果。

一旦一个 slave 被提升为一个 master ，它将开始独立地过期 key，而不需要任何旧 master 的帮助。

## 在 Docker 和 NAT 中配置复制

当使用 Docker 或其他类型的容器使用端口转发或网络地址转换时，Redis 复制需要特别小心，特别是在使用 Redis Sentinel 或其他系统（其中扫描 master INFO 或 ROLE 命令的输出情况以便于发现 slave 地址的）。

问题是 ROLE 命令和 INFO 输出的复制部分在发布到 master 实例中时，将显示 slave 具有的用于连接到 master 的 IP 地址，而在使用 NAT 的环境中，和 slave 实例的逻辑地址（客户机用来连接 slave 的地址）相比较可能会不同。

类似地，slaves 将以 redis.conf 文件中监听的端口为序列出，在重新映射端口的情况下，该端口可能与转发的端口不同。

为了解决这两个问题，从 Redis 3.2.2 开始，可以强制一个 slave 向 master 通告一对任意的 IP 和端口。使用的两个配置指令是：

> slave-announce-ip 5.5.5.5
> slave-announce-port 1234

在近期 Redis distributions 中的 redis.conf 的样例中可以找到记录。

## INFO 和 ROLE 命令

有两个 Redis 命令可以提供有关主从实例当前复制参数的很多信息。一个是INFO。如果使用复制参数像 INFO replication 调用该命令，，则只显示与复制相关的信息。另一个更加 computer-friendly 的命令是 ROLE，它提供 master 和 slave 的复制状态以及它们的复制偏移量，连接的 slaves 列表等等。

## 重新启动和故障转移后的部分重同步

从 Redis 4.0 开始，当一个实例在故障转移后被提升为 master 时，它仍然能够与旧 master 的 slaves 进行部分重同步。为此，slave 会记住旧 master 的旧 replication ID 和复制偏移量，因此即使询问旧的 replication ID，其也可以将部分复制缓冲提供给连接的 slave 。

但是，升级的 slave 的新 replication ID 将不同，因为它构成了数据集的不同历史记录。例如，master 可以返回可用，并且可以在一段时间内继续接受写入命令，因此在被提升的 slave 中使用相同的 replication ID 将违反一对复制标识和偏移对只能标识单一数据集的规则。

另外，slave 在关机并重新启动后，能够在 RDB 文件中存储所需信息，以便与 master 进行重同步。这在升级的情况下很有用。当需要时，最好使用 SHUTDOWN 命令来执行 slave 的保存和退出操作。

