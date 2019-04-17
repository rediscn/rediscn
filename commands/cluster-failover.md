---
layout: commands
title: cluster-failover 命令
permalink: commands/cluster-failover.html
disqusIdentifier: command_cluster-failover
disqusUrl: http://redis.cn/commands/cluster-failover.html
commandsType: cluster
discuzTid: 921
---

该命令只能在群集slave节点执行，让slave节点进行一次人工故障切换。

人工故障切换是预期的操作，而非发生了真正的故障，目的是以一种安全的方式(数据无丢失)将当前master节点和其中一个slave节点(执行cluster-failover的节点)交换角色。
流程如下：
1. 当前slave节点告知其master节点停止处理来自客户端的请求

2. master 节点将当前*replication offset* 回复给该slave节点

3. 该slave节点在未应用至replication offset之前不做任何操作，以保证master传来的数据均被处理。 

4. 该slave 节点进行故障转移，从群集中大多数的master节点获取epoch，然后广播自己的最新配置

5. 原master节点收到配置更新:解除客户端的访问阻塞，回复重定向信息，以便客户端可以和新master通信。


当该slave节点(将切换为新master节点)处理完来自master的所有复制，客户端的访问将会自动由原master节点切换至新master节点

## FORCE 选项:master节点down的情况下的人工故障转移

该命令有如下两个选项:**FORCE**和**TAKEOVER**

**FORCE** 选项：slave节点不和master协商(master也许已不可达)，从上如4步开始进行故障切换。当master已不可用，而我们想要做人工故障转移时，该选项很有用。

但是，即使使用**FORCE**选项，我们依然需要群集中大多数master节点有效，以便对这次切换进行验证，同时为将成为新master的salve节点生成新的配置epoch。

## TAKEOVER 选项: 忽略群集一致验证的的人工故障切换

有时会有这种情况,群集中master节点不够，我们想在未和群集中其余master节点验证的情况下进行故障切换。
实际用途举例:群集中主节点和从节点在不同的数据中心，当所有主节点down掉或被网络分区隔离，需要用该参数将slave节点
批量切换为master节点。

选项 **TAKEOVER** 实现了**FORCE**的所有功能，同时为了能够进行故障切换放弃群集验证。当slave节点收到命令`CLUSTER FAILOVER TAKEOVER`会做如下操作：

1. 独自生成新的`configEpoch`,若本地配置epoch非最大的，则取当前有效epoch值中的最大值并自增作为新的配置epoch

2. 将原master节点管理的所有哈希槽分配给自己，同时尽快分发最新的配置给所有当前可达节点，以及后续恢复的故障节点，期望最终配置分发至所有节点

注意：**TAKEOVER 违反Redis群集最新-故障转移-有效 原则**，因为slave节点产生的配置epoch 会让正常产生的的配置epoch无效

1. 使用**TAKEOVER** 产生的配置epoch 无法保证时最大值，因为我们是在少数节点见生成epoch，并且没有使用信息交互来保证新生成的epoch值最大。

2. 如果新生成的配置epoch 恰巧和其他实例生成的发生冲突（epoch相同），最终我们生成的配置epoch或者其他实例生成的epoch，会通过使用*配置epoch冲突解决算法* 舍弃掉其中一个。

因为这个原因，选择*TAKEOVER*需小心使用

## 实现细节与注意事项

`CLUSTER FAILOVER`,除非执行时使用选项**TAKEOVER**,否则故障切换不会同步执行，仅绕过故障检测阶段，添加一个人工故障转移任务。因此如果要检测故障转移
是否真的发生了，需要在`CLUSTER FAILOVER`发送一段时间后使用`CLUSTER NODES` 或其他方法来验证群集变动后的状态。

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply)：该命令已被接受并进行人工故障转移回复`OK`，切换操作无法执行(如发送命令的已经时master节点)时回复错误