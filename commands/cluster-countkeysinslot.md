---
layout: commands
title: cluster-countkeysinslot 命令
permalink: commands/cluster-countkeysinslot.html
disqusIdentifier: command_cluster-countkeysinslot
disqusUrl: http://redis.cn/commands/cluster-countkeysinslot.html
commandsType: cluster
discuzTid: 919
---

返回连接节点负责的指定hash slot的key的数量。该命令只查询连接节点的数据集，所以如果连接节点指派到该hash slot会返回0。


	> CLUSTER COUNTKEYSINSLOT 7000
	(integer) 50341


## 返回值

[Integer reply](/topics/protocol.html#integer-reply): 返回连接节点负责的指定hash slot的key的数量, 如果hash slot不合法则返回错误
