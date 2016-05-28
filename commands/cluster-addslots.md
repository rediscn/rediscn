---
layout: commands
title: cluster-addslots 命令
permalink: commands/cluster-addslots.html
disqusIdentifier: command_cluster-addslots
disqusUrl: http://redis.cn/commands/cluster-addslots.html
commandsType: cluster
---

这个命令是用于修改某个节点上的集群配置。具体的说它把一组hash slots分配给接收命令的节点。
如果命令执行成功，节点将指定的hash slots映射到自身，节点将获得指定的hash slots，同时开始向集群广播新的配置。



需要注意：

1. 该命令只有当所有指定的slots在接收命令的节点上还没有分配得的情况下生效。节点将
拒绝接纳已经分配到其他节点的slots（包括它自己的）。

2. 同一个slot被指定多次的情况下命令会失败。
3. 执行这个命令有一个副作用，如果slot作为其中一个参数设置为`importing`，一旦节点向自己分配该slot（以前未绑定）这个状态将会被清除。

## 例子

例如以下命令分配 1 2 3 slot到接收命令的节点：

    > CLUSTER ADDSLOTS 1 2 3
    OK

但是试图再次执行命令结果将会错误，因为slots已经被分配了。

    > CLUSTER ADDSLOTS 1 2 3
    ERR Slot 1 is already busy

## 在Redis集群中的应用

这个命令仅在cluster 模式下生效，而且作用于redis集群以下操作：

1. 创建新集群时，ADDSLOTS用于主节点初始化分配可用的hash slots。
2. 为了修复有未分配slots的坏集群。

## 有关slots的传播和警告

注意一旦一个节点为自己分配了一个slot集合，它就会开始将这个信息在心跳包的头里传播出去。然而其他节点只有在他们有slot没有被其他节点绑定或者传播的新的hash slot的配置年代大于列表中的节点时才会接受这个信息。

这意味着这个命令应该仅通过redis集群应用管理客户端例如redsi-trib谨慎使用，而且这个命令如果使用了错误的上下文会导致集群处于错误的状态或者导致数据丢失。


## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply): 如果命令执行成功返回`OK`，否则返回错误信息。

本文由许瑞翻译，巢鹏校验
