---
layout: commands
title: cluster-set-config-epoch 命令
permalink: commands/cluster-set-config-epoch.html
disqusIdentifier: command_cluster-set-config-epoch
disqusUrl: http://redis.cn/commands/cluster-set-config-epoch.html
commandsType: cluster
discuzTid: 931
---

This command sets a specific *config epoch* in a fresh node. It only works when:
该命令为一个全新的节点设置指定的*config epoch*,仅在如下情况下有效：
1. The nodes table of the node is empty.
1. 节点的节点信息表为空

2. The node current *config epoch* is zero.
2. 节点的当前*config epoch*为0

These prerequisites are needed since usually, manually altering the
configuration epoch of a node is unsafe, we want to be sure that the node with
the higher configuration epoch value (that is the last that failed over) wins
over other nodes in claiming the hash slots ownership.
这些先决条件是需要的，因为通常情况下，人工修改一个节点的配置epoch是不安全的，我们想保证一点：在
获取哈希槽的所有权时，拥有更高配置epoch值的节点获胜。


However there is an exception to this rule, and it is when a new
cluster is created from scratch. Redis Cluster *config epoch collision
resolution* algorithm can deal with new nodes all configured with the
same configuration at startup, but this process is slow and should be
the exception, only to make sure that whatever happens, two more
nodes eventually always move away from the state of having the same
configuration epoch.
但是该规则也有一个例外，在群集创建的时候，Redis群集*配置epoch冲突解决*算法会解决
群集启动时新的节点配置成相同配置epoch的问题，但是这个处理过程很慢,为了保证不管发生任何情况，都不会有两个节点拥有相同的配置epoch。


So, using `CONFIG SET-CONFIG-EPOCH`, when a new cluster is created, we can
assign a different progressive configuration epoch to each node before
joining the cluster together.
因此，当一个新群集创建的时候，使用命令`CONFIG SET-CONFIG-EPOCH`为每个一个节点分派渐进的配置epoch，然后再加入群集。

@return

@simple-string-reply: `OK` if the command was executed successfully, otherwise an error is returned.
@simple-string-reply: `OK` 当命令执行成功，否则返回错误