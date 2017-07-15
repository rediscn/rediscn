---
layout: commands
title: cluster-nodes 命令
permalink: commands/cluster-nodes.html
disqusIdentifier: command_cluster-nodes
disqusUrl: http://redis.cn/commands/cluster-nodes.html
commandsType: cluster
discuzTid: 927
tranAuthor: lidongliang

---

集群中的每个节点都有当前集群配置的一个视图（快照），视图的信息由该节点所有已知节点提供，包括与每个节点的连接状态，每个节点的标记位（flags)，属性和已经分配的哈希槽等等。

`CLUSTER NODES`提供了当前连接节点所属集群的配置信息，信息格式和Redis集群在磁盘上存储使用的序列化格式完全一样（在磁盘存储信息的结尾还存储了一些额外信息）.

通常，如果你想知道哈希槽与节点的关联关系，你应该使用`CLUSTER SLOTS` 命令。`CLUSTER NODES`主要是用于管理任务，调试和配置监控。`redis-trib`也会使用该命令管理集群.

## 序列化格式

（该命令的）输出是空格分割的CSV字符串，每行代表集群中的一个节点。下面是一个示例:

	07c37dfeb235213a872192d90877d0cd55635b91 127.0.0.1:30004 slave e7d1eecce10fd6bb5eb35b9f99a514335d9ba9ca 0 1426238317239 4 connected
	67ed2db8d677e59ec4a4cefb06858cf2a1a89fa1 127.0.0.1:30002 master - 0 1426238316232 2 connected 5461-10922
	292f8b365bb7edb5e285caf0b7e6ddc7265d2f4f 127.0.0.1:30003 master - 0 1426238318243 3 connected 10923-16383
	6ec23923021cf3ffec47632106199cb7f496ce01 127.0.0.1:30005 slave 67ed2db8d677e59ec4a4cefb06858cf2a1a89fa1 0 1426238316232 5 connected
	824fe116063bc5fcf9f4ffd895bc17aee7731ac3 127.0.0.1:30006 slave 292f8b365bb7edb5e285caf0b7e6ddc7265d2f4f 0 1426238317741 6 connected
	e7d1eecce10fd6bb5eb35b9f99a514335d9ba9ca 127.0.0.1:30001 myself,master - 0 0 1 connected 0-5460


每行的组成结构如下:


	<id> <ip:port> <flags> <master> <ping-sent> <pong-recv> <config-epoch> <link-state> <slot> <slot> ... <slot>


每项的含义如下:

1. `id`: 节点ID,是一个40字节的随机字符串，这个值在节点启动的时候创建，并且永远不会改变（除非使用`CLUSTER RESET HARD`命令）。
2. `ip:port`: 客户端与节点通信使用的地址.
3. `flags`: 逗号分割的标记位，可能的值有: `myself`, `master`, `slave`, `fail?`, `fail`, `handshake`, `noaddr`, `noflags`. 下一部分将详细介绍这些标记.
4. `master`: 如果节点是slave，并且已知master节点，则这里列出master节点ID,否则的话这里列出"-"。
5. `ping-sent`: 最近一次发送ping的时间，这个时间是一个unix毫秒时间戳，0代表没有发送过.
6. `pong-recv`: 最近一次收到pong的时间，使用unix时间戳表示.
7. `config-epoch`: 节点的epoch值（or of the current master if the node is a slave）。每当节点发生失败切换时，都会创建一个新的，独特的，递增的epoch。如果多个节点竞争同一个哈希槽时，epoch值更高的节点会抢夺到。
8. `link-state`:  node-to-node集群总线使用的链接的状态，我们使用这个链接与集群中其他节点进行通信.值可以是 `connected` 和 `disconnected`.
9. `slot`: 哈希槽值或者一个哈希槽范围. 从第9个参数开始，后面最多可能有16384个 数(limit never reached)。代表当前节点可以提供服务的所有哈希槽值。如果只是一个值,那就是只有一个槽会被使用。如果是一个范围，这个值表示为`起始槽-结束槽`，节点将处理包括起始槽和结束槽在内的所有哈希槽。

各flags的含义 (上面所说数据项3):

* `myself`: 当前连接的节点.
* `master`: 节点是master.
* `slave`: 节点是slave.
* `fail?`: 节点处于`PFAIL` 状态。 当前节点无法联系，但逻辑上是可达的 (非 `FAIL` 状态).
* `fail`: 节点处于`FAIL` 状态. 大部分节点都无法与其取得联系将会将改节点由 `PFAIL` 状态升级至`FAIL`状态。
* `handshake`: 还未取得信任的节点，当前正在与其进行握手.
* `noaddr`: 没有地址的节点（No address known for this node）.
* `noflags`: 连个标记都没有（No flags at all）.

## 发布的config epochs的说明

 slave节点在广播时，总是使用其所属master节点的config epochs值（主要是让master节点判断一下，其所持有的数据是否已经过期），所以如果你想知道slave节点本身真实的config epochs值（虽然没有什么意义，因为slave节点本身不处理哈希槽），你必须直连到该slave节点，然后执行`CLUSTER NODE`命令。除了直连的节点之前，命令打印出的epochs值仅仅是其他节点在心跳包中发出的值，这个值是其所属master节点的config epochs值。

## 特殊的哈希槽条目格式

通常情况下每个节点分配的哈希槽形式如下:

1. 单哈希槽，如: 3894
2. 范围，如: 3900-4000

但是还有两个特殊状态，是在节点被重启后，需要与其他节点确认错误的信息时（从AOF/RDB文件恢复时，发现keys的分布与节点哈希槽配置不匹配），或者当前节点正在重新分片时的需要的状态，分别是**迁入（importing）**和**迁出（migrating）**。

这两个状态的含义在Redis集群规范中也有解释，下面再详细介绍一下:

* **Importing**  槽位还没有被分配给该节点,但是正在被迁入至当前节点。只有使用`ASK`命令时，才能查询这些正在迁入的槽位。
* **Migrating** 槽位属于当前节点，但是正在被迁移至其他节点。只有当请求的所有key都在当前节点时，请求才会被正确响应，否则的话将使用**ASK redirection**强制客户端重定向至迁入节点。

状态为importing和migrating的节点在收到`CLUSTER NODES`命令后，输出如下:

* **迁入节点输出:** `[slot_number-<-importing_from_node_id]`
* **迁出节点输出:** `[slot_number->-migrating_to_node_id]`

下面是一个简单示例:

* `[93-<-292f8b365bb7edb5e285caf0b7e6ddc7265d2f4f]`
* `[1002-<-67ed2db8d677e59ec4a4cefb06858cf2a1a89fa1]`
* `[77->-e7d1eecce10fd6bb5eb35b9f99a514335d9ba9ca]`
* `[16311->-292f8b365bb7edb5e285caf0b7e6ddc7265d2f4f]`

请注意，输出的字符串不包含任何空格，所以`CLUSTER NODES`的输出仅仅是一个空格分割的CSV，即便是特殊状态的节点也遵循这个规律。.

备注:

1. 只有节点为`myself`的节点才会才会被迁出和迁入，相对于节点的哈希槽，这是哈希槽所属节点的本地局部变量(Migration and importing slots are only added to the node flagged as `myself`. This information is local to a node, for its own slots)。
2.  如果一个节点正在迁出或者迁入哈希槽，则这些信息只会在**额外信息**有所反映。如果哈希槽被分配到一个节点，并且正在迁出时，哈希槽的状态跟没有发生迁移时的状态一样，不会有什么特殊提示给客户端。

##返回值

[bulk-string-reply](http://www.redis.cn/topics/protocol.html#bulk-string-reply): 序列化的集群配置信息.
