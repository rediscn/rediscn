---
layout: commands
title: cluster-delslots 命令
permalink: commands/cluster-delslots.html
disqusIdentifier: command_cluster-delslots
disqusUrl: http://redis.cn/commands/cluster-delslots.html
commandsType: cluster
discuzTid: 920
tranAuthor: menwengit
---

在Redis Cluster中，每个节点都会知道哪些主节点正在负责哪些特定的哈希槽

`DELSLOTS`命令使一个特定的Redis Cluster节点去忘记一个主节点正在负责的哈希槽，这些哈希槽通过参数指定。

在已经接收到`DELSLOTS`命令的节点环境中，并且因此已经去除了指定哈希槽的关联，我们认为这些哈希槽是*未绑定的* 。请注意，当一个节点还没有被配置去负责他们（可以通过`ADDSLOTS`完成槽的分配）并且如果该节点没有收到关于谁拥有这些哈希槽的消息时（节点通过心跳包或者更新包获取消息），这些未绑定的哈希槽是自然而然本来就存在的。

如果一个节点认为一些哈希槽是未绑定的，但是从其他节点接收到一个心跳包，得知这些哈希槽已经被其他节点负责，那么会立即确立其关联关系。而且，如果接收到一个心跳包或更新包的配置纪元比当前节点的大，那么会重新建立关联。

但是，请注意：

1. 命令只在参数指定的哈希槽已经和某些节点关联时有效。

2. 如果同一个哈希槽被指定多次，该命令会失败。

3. 命令执行的副作用是，因为不在负责哈希槽，节点可能会进入*下线*状态。

## 例如

以下命令会移除槽5000和槽5001与接收该命令节点的关联

    > CLUSTER DELSLOTS 5000 5001
    OK

## Redis Cluster中的用法

命令只在集群模式下工作，并且对调试非常有用，并且当创建新的集群时，为了可以手动的协调集群配置。当前没有被`redis-trib`使用，并且主要为了API的完整性存在。

## 返回值

[simple-string-reply](http://www.redis.cn/topics/protocol.html#simple-string-reply)：如果命令成功执行返回`OK`，否则返回一个错误。