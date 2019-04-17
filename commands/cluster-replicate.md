---
layout: commands
title: cluster-replicate 命令
permalink: commands/cluster-replicate.html
disqusIdentifier: command_cluster-replicate
disqusUrl: http://redis.cn/commands/cluster-replicate.html
commandsType: cluster
discuzTid: 928
---

该命令重新配置一个节点成为指定master的salve节点。
如果收到命令的节点是一个*empty master*，那么该节点的角色将由master切换为slave。

一旦一个节点变成另一个master节点的slave，无需通知群集内其他节点这一变化：节点间交换
信息的心跳包会自动将新的配置信息分发至所有节点。

基于如下假设，一个slave节点会接受该命令

1. 指定节点在它的节点信息表中存在

2. 指定节点无法识别接收我们命令的节点实例

3. 指定节点是一个master

如果收到命令的节点不是slave而是master，只要在如下情况下，命令才会执行成功，该节点才会切换为slave：

1. 该节点不保存任何hash槽

2. 该节点是空的，key空间中不存储任何键

如果命令执行成功，新的slave会立即尝试连接它的master以便进行数据复制

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply)：命令执行成功完成回复`OK`，否则返回错误