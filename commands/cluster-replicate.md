---
layout: commands
title: cluster-replicate 命令
permalink: commands/cluster-replicate.html
disqusIdentifier: command_cluster-replicate
disqusUrl: http://redis.cn/commands/cluster-replicate.html
commandsType: cluster
discuzTid: 928
---

The command reconfigures a node as a slave of the specified master.
If the node receiving the command is an *empty master*, as a side effect
of the command, the node role is changed from master to slave.
该命令重新配置一个节点成为指定master的salve节点。
如果收到命令的节点是一个*empty master*，那么该节点的角色将由master切换为slave。

Once a node is turned into the slave of another master node, there is no need
to inform the other cluster nodes about the change: heartbeat packets exchanged
between nodes will propagate the new configuration automatically.
一旦一个节点变成另一个master节点的slave，无需通知群集内其他节点这一变化：节点间交换
信息的心跳包会自动将新的配置信息分发至所有节点。

A slave will always accept the command, assuming that:
基于如下假设，一个slave节点会接受该命令
1. The specified node ID exists in its nodes table.
1. 指定节点在它的节点信息表中存在

2. The specified node ID does not identify the instance we are sending the command to.
2. 指定节点无法识别接收我们命令的节点实例

3. The specified node ID is a master.
3. 指定节点是一个master

If the node receiving the command is not already a slave, but is a master,
the command will only succeed, and the node will be converted into a slave,
only if the following additional conditions are met:
如果收到命令的节点不是slave而是master，只要在如下情况下，命令才会执行成功，该节点才会切换为slave：
1. The node is not serving any hash slots.
1. 该节点不保存任何hash槽

2. The node is empty, no keys are stored at all in the key space.
2. 该节点是空的，key空间中不存储任何键

If the command succeeds the new slave will immediately try to contact its master in order to replicate from it.
如果命令执行成功，新的slave会立即尝试连接它的master以便进行数据复制
@return

@simple-string-reply: `OK` if the command was executed successfully, otherwise an error is returned.
@simple-string-reply：命令执行成功完成回复`OK`，否则返回错误