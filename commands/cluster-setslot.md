---
layout: commands
title: cluster-setslot 命令
permalink: commands/cluster-setslot.html
disqusIdentifier: command_cluster-setslot
disqusUrl: http://redis.cn/commands/cluster-setslot.html
commandsType: cluster
discuzTid: 932
---

`CLUSTER SETSLOT` is responsible of changing the state of an hash slot in the receiving node in different ways. It can, depending on the subcommand used:
`CLUSTER SETSLOT` 根据如下子命令选项，修改接受节点中哈希槽的状态：
1. `MIGRATING` subcommand: Set a hash slot in *migrating* state.
1. `MIGRATING` 子命令：将一个哈希槽设置为*migrating* 状态

2. `IMPORTING` subcommand: Set a hash slot in *importing* state.
2. `IMPORTING` 子命令：将一个哈希槽设置为*importing* 状态

3. `STABLE` subcommand: Clear any importing / migrating state from hash slot.
3. `STABLE` 子命令：从哈希槽中清除导入和迁移状态

4. `NODE` subcommand: Bind the hash slot to a different node.
4. `NODE` 子命令：将一个哈希槽绑定到另一个不同的节点

The command with its set of subcommands is useful in order to start and end cluster live resharding operations, which are accomplished by setting an hash slot in migrating state in the source node, and importing state in the destination node.
该命令和子命令选项可以用来启动和结束一个群集重新哈希槽的操作，操作期间备操作哈希槽会在源节点被设置为迁移中状态，目标节点设置为导入中状态
Each subcommand is documented below. At the end you'll find a description of
how live resharding is performed using this command and other related commands.
每个子命令详细如下，文章末尾会有使用该命令以及其他相关命令实现实时重新哈希操作的说明。

## CLUSTER SETSLOT `<slot>` MIGRATING `<destination-node-id>`

This subcommand sets a slot to *migrating* state. In order to set a slot
in this state, the node receiving the command must be the hash slot owner,
otherwise an error is returned.
该子命令将一个槽设置为*migrating*状态.为了可以将一个哈希槽设置成这种状态，收到命令的节点必须是该哈希槽的所有者，否则报错

When a slot is set in migrating state, the node changes behavior in the
following way:
当一个哈希槽被设置为migrating状态，节点将会有如下操作：
1. If a command is received about an existing key, the command is processed as usually.
1. 如果处理的是存在的key，命令正常执行

2. If a command is received about a key that does not exists, an `ASK` redirection is emitted by the node, asking the client to retry only that specific query into `destination-node`. In this case the client should not update its hash slot to node mapping.
2. 如果要处理的key不存在，接收命令的节点将发出一个重定向`ASK`，让客户端紧在`destination-node`重试该查询. 在这种情况下，客户端不应该将该哈希槽更新为节点映射.

3. If the command contains multiple keys, in case none exist, the behavior is the same as point 2, if all exist, it is the same as point 1, however if only a partial number of keys exist, 
the command emits a `TRYAGAIN` error in order for the keys interested to finish being migrated to the target node, so that the multi keys command can be executed.
3. 如果命令包含多个keys，如果都不存在，处理方式同2，如果都存在，处理方式同1，如果只是部分存在，针对即将完成迁移至目标节点的keys按序返回`TRYAGAIN`错误，以便批量keys命令可以执行。

## CLUSTER SETSLOT `<slot>` IMPORTING `<source-node-id>`

This subcommand is the reverse of `MIGRATING`, and prepares the destination
node to import keys from the specified source node. The command only works if
the node is not already owner of the specified hash slot.
该子命令是`MIGRATING`的反向操作，将keys从指定源节点导入目标节点。该命令仅能在目标节点不是指定槽的所有者时生效。

When a slot is set in importing state, the node changes behavior in the following way:
当一个槽被设置为导入中状态时，该节点的变动情况如下
1. Commands about this hash slot are refused and a `MOVED` redirection is generated as usually, but in the case the command follows an `ASKING` command, in this case the command is executed.
1. 涉及该哈希槽的命令均被拒绝，并产生一个`MOVED` 重定向，但是如果该命令跟着一个`ASKING`命令，在这种情况下，表示该命令已经执行。
In this way when a node in migrating state generates an `ASK` redirection, the client contacts the target node, sends `ASKING`, and immediately after sends the command. This way commands about non-existing keys in the old node or keys already migrated to the target node are executed in the target node, so that:
当迁移中的节点产生`ASK`重定向时，客户端会连接目标节点，在发送命令后紧接着发送`ASKING`。按照这种策略，涉及源节点已不存在的keys或者已经迁移至目标节点的keys的命令，都在目标节点执行。说明如下：
1. New keys are always created in the target node. During an hash slot migration we'll have to move only old keys, not new ones.
1. 新的keys总是在目标节点创建。在哈希槽的迁移中，我们只迁移旧keys不会创建新建的keys

2. Commands about keys already migrated are correctly processed in the context of the node which is the target of the migration, the new hash slot owner, in order to guarantee consistency.
2. 涉及已经迁移的keys的命令都会被目的节点处理，目的节点会是新的哈希槽的所有者，以保证一致性。
3. Without `ASKING` the behavior is the same as usually. This guarantees that clients with a broken hash slots mapping 
will not write for error in the target node, creating a new version of a key that has yet to be migrated.
3. 如果没有`ASKING`，命令没什么特殊，`ASKING`保证哈希槽映射关系错误的客户端不会再目的节点操作错误：在还没完成迁移的key创建一个新的版本。

## CLUSTER SETSLOT `<slot>` STABLE

This subcommand just clears migrating / importing state from the slot. It is
mainly used to fix a cluster stuck in a wrong state by `redis-trib fix`.
Normally the two states are cleared automatically at the end of the migration
using the `SETSLOT ... NODE ...` subcommand as explained in the next section.
该子命令仅用于清理槽中迁移中/导入中的状态。它主要用于修复群集在使用·redis-trip fix· 卡在一个错误状态的问题。
一般情况下，使用下节介绍的命令`SETSLOT... NODE...`迁移完成时，这两种状态会被自动清理。

## CLUSTER SETSLOT `<slot>` NODE `<node-id>`

The `NODE` subcommand is the one with the most complex semantics. It
associates the hash slot with the specified node, however the command works
only in specific situations and has different side effects depending on the
slot state. The following is the set of pre-conditions and side effects of the
command:
子命令`NODE`使用方法最复杂，它后接指定节点的哈希槽，该命令仅在特定情况下有效，并且不同的槽状态会有不同的效果，前提条件和对应的效果如下：

1. If the current hash slot owner is the node receiving the command, but for effect of the command the slot would be assigned to a different node,
 the command will return an error if there are still keys for that hash slot in the node receiving the command.
1. 如果接受命令的节点是当前操作哈希槽的所有者，但是该命令的操作结果是将操作的槽分配到另一个节点，因此，要操作的哈希槽中还有keys，该命令会返回错误。

2. If the slot is in *migrating* state, the state gets cleared when the slot is assigned to another node.
2. 如果槽是`migrating`状态，当该槽被分配至其他节点时，状态被清除。

3. If the slot was in *importing* state in the node receiving the command, and the command assigns the slot to this node 
(which happens in the target node at the end of the resharding of an hash slot from one node to another), the command has the following side effects: 
A) the *importing* state is cleared. 
B) If the node config epoch is not already the greatest of the cluster,it generates a new one and assigns the new config epoch to itself. 
This way its new hash slot ownership will win over any past configuration created by previous failovers or slot migrations.
3. 如果槽在接收命令的节点上是`importing`状态，该命令将槽分配给这个节点(当进行重哈希时，最终结果哈希槽从一个节点迁移至目的节点)并做如下操作：
A) 状态`importing`被清除
B) 如果该节点的配置epoch不是群集中最大的，它将生成一个新的配置epoch。这样，在经历过故障转移或者槽迁移的群集中，能够拿到新的哈希槽的所有权。
It is important to note that step 3 is the only time when a Redis Cluster node will create a new config epoch without agreement from other nodes. 
This only happens when a manual configuration is operated. 
However it is impossible that this creates a non-transient setup where two nodes have the same config epoch, 
since Redis Cluster uses a config epoch collision resolution algorithm.
特别注意:步骤3是群集中一个节点不和其他节点协商独自产生一个新配置epoch的唯一情况，且仅在人工配置时发生。不过因为群集使用了配置epoch碰撞解决算法，该步骤
不可能在两个节点的epoch相同的情况下完成群集安装。

@return

@simple-string-reply: All the subcommands return `OK` if the command was successful. Otherwise an error is returned.
@simple-string-reply: 所有子命令执行成功时都返回`OK`，否则返回错误

## Redis Cluster live resharding explained

The `CLUSTER SETSLOT` command is an important piece used by Redis Cluster in order to migrate all the keys contained 
in one hash slot from one node to another. This is how the migration is orchestrated, with the help of other commands as well. 
We'll call the node that has the current ownership of the hash slot the `source` node, and the node where we want to migrate the `destination` node.
Redis 群集使用命令 `CLUSTER SETSLOT` 将一个槽中的所有keys 从一个节点迁移至另一个节点。稍后介绍在其他命令配合下迁移是如何操作的。
我们假定要操作的哈希槽的当前所有者为源节点，将要迁移至的节点为目的节点
1. Set the destination node slot to *importing* state using `CLUSTER SETSLOT <slot> IMPORTING <source-node-id>`.
1. 使用命令`CLUSTER SETSLOT <slot> IMPORTING <source-node-id>` 将目的节点槽置为*importing*状态。

2. Set the source node slot to *migrating* state using `CLUSTER SETSLOT <slot> MIGRATING <destination-node-id>`.
2. 使用命令`CLUSTER SETSLOT <slot> MIGRATING <destination-node-id>` 将源节点槽置为*migrating*状态。

3. Get keys from the source node with `CLUSTER GETKEYSINSLOT` command and move them into the destination node using the `MIGRATE` command.
3. 使用命令`CLUSTER GETKEYSINSLOT` 从源节点获取所有keys，并使用命令`MIGRATE` 将它们导入到目的节点。

4. Use `CLUSTER SETSLOT <slot> NODE <destination-node-id>` in the source or destination.
4. 在源节点活目的节点执行命令`CLUSTER SETSLOT <slot> NODE <destination-node-id>`

Notes:
注意：

* The order of step 1 and 2 is important. We want the destination node to be ready to accept `ASK` redirections when the source node is configured to redirect.
* Step 4 does not technically need to use `SETSLOT` in the nodes not involved in the resharding, since the configuration will eventually propagate itself, 
however it is a good idea to do so in order to stop nodes from pointing to the wrong node for the hash slot moved as soon as possible, resulting in less redirections to find the right node.

* 步骤1和步骤2的顺序很重要。我们希望在源节点配置了重定向之后，目的节点已经可以接受`ASK`重定向。
* 步骤4中，技术上讲，在重哈希不涉及的节点上执行`SETSLOT`是非必须的，因为新配置最终会分发到所有节点上，但是，这样操作也有好处，会快速停止节点中对已迁移的哈希槽的错误指向，降低命令重定向的发生.