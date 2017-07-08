---
layout: commands
title: cluster-info 命令
permalink: commands/cluster-info.html
disqusIdentifier: command_cluster-info
disqusUrl: http://redis.cn/commands/cluster-info.html
commandsType: cluster
discuzTid: 924
tranAuthor: lidongliang
---

`CLUSTER INFO` 命令使用 `INFO` 风格的形式展现了关于Redis集群的重要参数。下面是该命令的典型输出，后面是对每个输出项的说明。

```
cluster_state:ok
cluster_slots_assigned:16384
cluster_slots_ok:16384
cluster_slots_pfail:0
cluster_slots_fail:0
cluster_known_nodes:6
cluster_size:3
cluster_current_epoch:6
cluster_my_epoch:2
cluster_stats_messages_sent:1483972
cluster_stats_messages_received:1483968
```

* `cluster_state`:  `ok`状态表示集群可以正常接受查询请求。`fail` 状态表示，至少有一个哈希槽没有被绑定（说明有哈希槽没有被绑定到任意一个节点），或者在错误的状态（节点服务但是带有FAIL 标记），或者当前节点无法联系到多数master节点。.
* `cluster_slots_assigned`: 已分配到集群节点的哈希槽数量（不是没有被绑定的数量）。16384个哈希槽全部被分配到集群节点是集群正常运行的必要条件.
* `cluster_slots_ok`: 哈希槽状态不是`FAIL` 和 `PFAIL` 的数量.
* `cluster_slots_pfail`: 哈希槽状态是 `PFAIL`的数量。只要哈希槽状态没有被升级到`FAIL`状态，这些哈希槽仍然可以被正常处理。`PFAIL`状态表示我们当前不能和节点进行交互，但这种状态只是临时的错误状态。
* `cluster_slots_fail`: 哈希槽状态是`FAIL`的数量。如果值不是0，那么集群节点将无法提供查询服务，除非`cluster-require-full-coverage`被设置为`no` .
* `cluster_known_nodes`: 集群中节点数量，包括处于`握手`状态还没有成为集群正式成员的节点.
* `cluster_size`: 至少包含一个哈希槽且能够提供服务的master节点数量.
* `cluster_current_epoch`: 节点本地`Current Epoch`变量的值。这个值在节点失败过程时创建一个带版本的递增变量时有用。
* `cluster_my_epoch`: 当前正在使用的节点的`Config Epoch`值. 这个是关联在本节点的版本值.
* `cluster_stats_messages_sent`: 通过node-to-node二进制总线发送的消息数量.
* `cluster_stats_messages_received`: 通过node-to-node二进制总线接收的消息数量.

更多关于`Current Epoch` 和 `Config Epoch`变量的说明，请参考Redis集群规范文档.

@return

@bulk-string-reply: 行的格式如 `<field>:<value>` ,行后面跟着一个 `CRLF`。