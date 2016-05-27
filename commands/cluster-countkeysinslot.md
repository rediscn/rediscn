---
layout: commands
title: cluster-countkeysinslot 命令 -- Redis中文资料站
permalink: commands/cluster-countkeysinslot.html
disqusIdentifier: command_cluster-countkeysinslot
disqusUrl: http://redis.cn/commands/cluster-countkeysinslot.html
commandsType: cluster
---

返回连接节点负责的指定hash slot的key的数量。该命令只查询连接节点的数据集，所以如果连接节点没有分配到该hash slot会返回0。

```
> CLUSTER COUNTKEYSINSLOT 7000
(integer) 50341
```

@return

@integer-reply: 返回连接节点负责的指定hash slot的key的数量, 如果hash slot不合法则返回错误

--------------------------------------


Returns the number of keys in the specified Redis Cluster hash slot. The
command only queries the local data set, so contacting a node
that is not serving the specified hash slot will always result in a count of
zero being returned.

```
> CLUSTER COUNTKEYSINSLOT 7000
(integer) 50341
```

@return

@integer-reply: The number of keys in the specified hash slot, or an error if the hash slot is invalid.
