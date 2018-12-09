---
layout: commands
title: cluster-reset 命令
permalink: commands/cluster-reset.html
disqusIdentifier: command_cluster-reset
disqusUrl: http://redis.cn/commands/cluster-reset.html
commandsType: cluster
discuzTid: 929
---

Reset a Redis Cluster node, in a more or less drastic way depending on the
reset type, that can be **hard** or **soft**. Note that this command
**does not work for masters if they hold one or more keys**, in that case
to completely reset a master node keys must be removed first, e.g. by using `FLUSHALL` first,
and then `CLUSTER RESET`.
根据reset的类型配置**hard**或者**soft** ，Reset 一个Redis群集节点可以选择十分极端或极端的方式。
注意该命令在**主节点hold住一个或多个keys的时候无效**，在这种情况下，如果要彻底reset一个master，
需要将它的所有key先移除，如先使用`FLUSHALL`，在使用`CLUSTER RESET`

Effects on the node:
节点上的效果如下：

1. All the other nodes in the cluster are forgotten.
1. 群集中的节点都被忽略

2. All the assigned / open slots are reset, so the slots-to-nodes mapping is totally cleared.
2. 所有已分派/打开的槽会被reset，以便slots-to-nodes对应关系被完全清除

3. If the node is a slave it is turned into an (empty) master. Its dataset is flushed, so at the end the node will be an empty master.
3. 如果节点是slave，它会被切换为(空)master。它的数据集已被清空，因此最后也会变成一个空master。

4. **Hard reset only**: a new Node ID is generated.
4. ***Hard reset only*：生成新的节点ID

5. **Hard reset only**: `currentEpoch` and `configEpoch` vars are set to 0.
5. **Hard reset only**：变量`currentEpoch` 和`configEpoch`被设置为0

6. The new configuration is persisted on disk in the node cluster configuration file.
6. 新配置被持久化到节点磁盘上的群集配置信息文件中

This command is mainly useful to re-provision a Redis Cluster node
in order to be used in the context of a new, different cluster. The command
is also extensively used by the Redis Cluster testing framework in order to
reset the state of the cluster every time a new test unit is executed.
当需要为一个新的或不同的群集提供一个新的群集节点是可使用该命令，同时它也在Redis群集测试框架中被广泛使用，它用于
在每个新的测试单元启动是初始化群集状态。

If no reset type is specified, the default is **soft**.
如果reset类型没有指定，使用默认值**soft**
@return

@simple-string-reply: `OK` if the command was successful. Otherwise an error is returned.
@simple-string-reply：命令执行成功返回`OK``,否则返回错误