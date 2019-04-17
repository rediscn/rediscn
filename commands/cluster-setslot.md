---
layout: commands
title: cluster-setslot 命令
permalink: commands/cluster-setslot.html
disqusIdentifier: command_cluster-setslot
disqusUrl: http://redis.cn/commands/cluster-setslot.html
commandsType: cluster
discuzTid: 932
---

`CLUSTER SETSLOT` 根据如下子命令选项，修改接受节点中哈希槽的状态：

1. `MIGRATING` 子命令：将一个哈希槽设置为*migrating* 状态

. `IMPORTING` 子命令：将一个哈希槽设置为*importing* 状态

3. `STABLE` 子命令：从哈希槽中清除导入和迁移状态

4. `NODE` 子命令：将一个哈希槽绑定到另一个不同的节点

该命令和子命令选项可以用来启动和结束一个群集重新哈希槽的操作，操作期间备操作哈希槽会在源节点被设置为迁移中状态，目标节点设置为导入中状态
每个子命令详细如下，文章末尾会有使用该命令以及其他相关命令实现实时重新哈希操作的说明。

## CLUSTER SETSLOT `<slot>` MIGRATING `<destination-node-id>`

该子命令将一个槽设置为*migrating*状态.为了可以将一个哈希槽设置成这种状态，收到命令的节点必须是该哈希槽的所有者，否则报错

当一个哈希槽被设置为migrating状态，节点将会有如下操作：

1. 如果处理的是存在的key，命令正常执行

2. 如果要处理的key不存在，接收命令的节点将发出一个重定向`ASK`，让客户端紧在`destination-node`重试该查询. 在这种情况下，客户端不应该将该哈希槽更新为节点映射.

3. 如果命令包含多个keys，如果都不存在，处理方式同2，如果都存在，处理方式同1，如果只是部分存在，针对即将完成迁移至目标节点的keys按序返回`TRYAGAIN`错误，以便批量keys命令可以执行。

## CLUSTER SETSLOT `<slot>` IMPORTING `<source-node-id>`

该子命令是`MIGRATING`的反向操作，将keys从指定源节点导入目标节点。该命令仅能在目标节点不是指定槽的所有者时生效。

当一个槽被设置为导入中状态时，该节点的变动情况如下

1. 涉及该哈希槽的命令均被拒绝，并产生一个`MOVED` 重定向，但是如果该命令跟着一个`ASKING`命令，在这种情况下，表示该命令已经执行。
当迁移中的节点产生`ASK`重定向时，客户端会连接目标节点，在发送命令后紧接着发送`ASKING`。按照这种策略，涉及源节点已不存在的keys或者已经迁移至目标节点的keys的命令，都在目标节点执行。说明如下：

1. 新的keys总是在目标节点创建。在哈希槽的迁移中，我们只迁移旧keys不会创建新建的keys

2. 涉及已经迁移的keys的命令都会被目的节点处理，目的节点会是新的哈希槽的所有者，以保证一致性。

3. 如果没有`ASKING`，命令没什么特殊，`ASKING`保证哈希槽映射关系错误的客户端不会再目的节点操作错误：在还没完成迁移的key创建一个新的版本。

## CLUSTER SETSLOT `<slot>` STABLE

该子命令仅用于清理槽中迁移中/导入中的状态。它主要用于修复群集在使用·redis-trip fix· 卡在一个错误状态的问题。
一般情况下，使用下节介绍的命令`SETSLOT... NODE...`迁移完成时，这两种状态会被自动清理。

## CLUSTER SETSLOT `<slot>` NODE `<node-id>`

子命令`NODE`使用方法最复杂，它后接指定节点的哈希槽，该命令仅在特定情况下有效，并且不同的槽状态会有不同的效果，前提条件和对应的效果如下：

1. 如果接受命令的节点是当前操作哈希槽的所有者，但是该命令的操作结果是将操作的槽分配到另一个节点，因此，要操作的哈希槽中还有keys，该命令会返回错误。

2. 如果槽是`migrating`状态，当该槽被分配至其他节点时，状态被清除。

3. 如果槽在接收命令的节点上是`importing`状态，该命令将槽分配给这个节点(当进行重哈希时，最终结果哈希槽从一个节点迁移至目的节点)并做如下操作：
A) 状态`importing`被清除
B) 如果该节点的配置epoch不是群集中最大的，它将生成一个新的配置epoch。这样，在经历过故障转移或者槽迁移的群集中，能够拿到新的哈希槽的所有权。

特别注意:步骤3是群集中一个节点不和其他节点协商独自产生一个新配置epoch的唯一情况，且仅在人工配置时发生。不过因为群集使用了配置epoch碰撞解决算法，该步骤
不可能在两个节点的epoch相同的情况下完成群集安装。

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply): 所有子命令执行成功时都返回`OK`，否则返回错误

## Redis Cluster live resharding explained

Redis 群集使用命令 `CLUSTER SETSLOT` 将一个槽中的所有keys 从一个节点迁移至另一个节点。稍后介绍在其他命令配合下迁移是如何操作的。
我们假定要操作的哈希槽的当前所有者为源节点，将要迁移至的节点为目的节点

1. 使用命令`CLUSTER SETSLOT <slot> IMPORTING <source-node-id>` 将目的节点槽置为*importing*状态。

2. 使用命令`CLUSTER SETSLOT <slot> MIGRATING <destination-node-id>` 将源节点槽置为*migrating*状态。

3. 使用命令`CLUSTER GETKEYSINSLOT` 从源节点获取所有keys，并使用命令`MIGRATE` 将它们导入到目的节点。

4. 在源节点活目的节点执行命令`CLUSTER SETSLOT <slot> NODE <destination-node-id>`

注意：

* 步骤1和步骤2的顺序很重要。我们希望在源节点配置了重定向之后，目的节点已经可以接受`ASK`重定向。

* 步骤4中，技术上讲，在重哈希不涉及的节点上执行`SETSLOT`是非必须的，因为新配置最终会分发到所有节点上，但是，这样操作也有好处，会快速停止节点中对已迁移的哈希槽的错误指向，降低命令重定向的发生.