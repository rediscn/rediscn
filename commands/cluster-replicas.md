---
layout: commands
title: cluster-replicas 命令
permalink: commands/cluster-replicas.html
disqusIdentifier: command_cluster-replicas
disqusUrl: http://redis.cn/commands/cluster-replicas.html
commandsType: cluster
discuzTid: 13904

---

The command provides a list of replica nodes replicating from the specified
master node. The list is provided in the same format used by `CLUSTER NODES` (please refer to its documentation for the specification of the format).
该命令会列出指定主节点的辅助副本节点，输出格式同命令`CLUSTER NODES`(格式说明请参阅器说明文档)
The command will fail if the specified node is not known or if it is not
a master according to the node table of the node receiving the command.
若特定节点状态未知，或在接收命令节点的节点信息表中，该节点不是主节点，则命令失败
Note that if a replica is added, moved, or removed from a given master node,
and we ask `CLUSTER REPLICAS` to a node that has not yet received the
configuration update, it may show stale information. However eventually
(in a matter of seconds if there are no network partitions) all the nodes
will agree about the set of nodes associated with a given master.
请注意，当已经添加，迁移或者删除一个副本时，在群集中未及时更新配置信息的节点上执行`CLUSTER REPLICAS`命令，仍返回原有配置信息。
当然，所有节点最终将会同步群集中其他节点的信息(无网络分区情况下，需要几秒钟时间)
## 返回值


The command returns data in the same format as `CLUSTER NODES`.
该命令返回结果格式同`CLUSTER NODES`