---
layout: commands
title: cluster-set-config-epoch 命令
permalink: commands/cluster-set-config-epoch.html
disqusIdentifier: command_cluster-set-config-epoch
disqusUrl: http://redis.cn/commands/cluster-set-config-epoch.html
commandsType: cluster
discuzTid: 931
---

该命令为一个全新的节点设置指定的*config epoch*,仅在如下情况下有效：

1. 节点的节点信息表为空

2. 节点的当前*config epoch*为0

这些先决条件是需要的，因为通常情况下，人工修改一个节点的配置epoch是不安全的，我们想保证一点：在
获取哈希槽的所有权时，拥有更高配置epoch值的节点获胜。

但是该规则也有一个例外，在群集创建的时候，Redis群集*配置epoch冲突解决*算法会解决
群集启动时新的节点配置成相同配置epoch的问题，但是这个处理过程很慢,为了保证不管发生任何情况，都不会有两个节点拥有相同的配置epoch。

因此，当一个新群集创建的时候，使用命令`CONFIG SET-CONFIG-EPOCH`为每个一个节点分派渐进的配置epoch，然后再加入群集。

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply): `OK` 当命令执行成功，否则返回错误