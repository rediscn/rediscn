---
layout: commands
title: cluster-forget 命令
permalink: commands/cluster-forget.html
disqusIdentifier: command_cluster-forget
disqusUrl: http://redis.cn/commands/cluster-forget.html
commandsType: cluster
discuzTid: 922
---

该命令可以从收到命令的Redis群集节点的节点信息列表中移除指定ID的节点。
换句话说，从收到命令的Redis群集节点的*nodes table*中删除指定节点。

该命令不是将待删除节点的信息简单从内部配置中简单删除，它同时实现了禁止列表功能：不允许已删除
的节点再次被添加进来，否则已删除节点会因为处理其他节点心跳包中的*gossip section*时被再次添加。

## 命令执行详细
假设我们有四个节点:A,B,C,D。为了得到一个三节点群集A,B,C，我们可以做如下操作：

1. 将D上的哈希槽重分配到节点A,B,C。

2. 节点D现在已经空了，但是节点A,B,C的节点信息表中仍然有D的信息

3. 我们连接节点A，发送命令`CLUSTER FORGET D`。

4. 节点B发送心跳包给节点A，包含节点D的信息。

5. 节点A无节点D信息，无法识别节点D(参见步骤3)，因此开始与节点D握手。

6. 节点D最终再次添加进节点A的节点信息表中

上述的移除方法很不稳定，因此我们需要尽快发送命令`CLUSTER FORGET` 给所有节点，以期没有gossip sections在同时处理。
因为这个原因，命令`CLUSTER FORGET`为每个节点实现了包含超时时间的禁止列表


因此我们命令实际的执行情况如下：

1. 从收到命令节点的节点信息列表中删除待删除节点的节点信息。

2. 已删除的节点的节点ID被加入禁止列表，保留1分钟

3. 收到命令的节点，在处理从其他节点发送过来的gossip sections 会跳过所有在禁止列表中的节点。

这样，我们就有60秒的时间窗口来通知群集中的所有节点，我们想要删除某个节点。

## 该命令无法执行的特殊情况

在如下情况下，该命令无法成功执行并返回错误

1. 节点信息表中无法找到指定删除节点的节点信息

2. 收到命令的节点是slave 节点，指定要删除的节点被识别出是它的当前master节点。

3. 收到命令的节点和待删除的节点是同一节点

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply)：命令成功执行返回`OK`，否则返回错误