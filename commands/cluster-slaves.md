---
layout: commands
title: cluster-slaves 命令
permalink: commands/cluster-slaves.html
disqusIdentifier: command_cluster-slaves
disqusUrl: http://redis.cn/commands/cluster-slaves.html
commandsType: cluster
discuzTid: 933
---

该命令会列出指定master节点所有slave节点，格式同`CLUSTER NODES`(详见指定格式说明文档)

当指定节点未知或者根据接收命令的节点的节点信息表指定节点不是主节点，命令执行错误。

注意：当一个slave被添加，移动或者删除时，我们在一个配置信息没有更新的群集节点上执行命令`CLUSTER SLAVES`获取将是脏信息。
不过最终(无网络分区的情况下大概几秒钟)所有节点都会同步指定master节点的salve节点信息。

## 返回值

该命令返回结果格式同`CLUSTER NODES`