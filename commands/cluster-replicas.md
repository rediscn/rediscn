---
layout: commands
title: cluster-replicas 命令
permalink: commands/cluster-replicas.html
disqusIdentifier: command_cluster-replicas
disqusUrl: http://redis.cn/commands/cluster-replicas.html
commandsType: cluster
discuzTid: 13904
tranAuthor：gqhao
---

该命令会列出指定主节点的辅助副本节点，输出格式同命令`CLUSTER NODES`(格式说明请参阅说明文档)

若特定节点状态未知，或在接收命令节点的节点信息表中，该节点不是主节点，则命令失败

请注意，当已经添加，迁移或者删除一个副本时，在群集中未及时更新配置信息的节点上执行`CLUSTER REPLICAS`命令，仍返回原有配置信息。
当然，所有节点最终将会同步群集中其他节点的信息(网络正常情况下，需要几秒钟时间)
## 返回值

该命令返回结果格式同`CLUSTER NODES`