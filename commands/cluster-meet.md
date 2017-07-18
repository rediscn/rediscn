---
layout: commands
title: cluster-meet 命令
permalink: commands/cluster-meet.html
disqusIdentifier: command_cluster-meet
disqusUrl: http://redis.cn/commands/cluster-meet.html
commandsType: cluster
discuzTid: 926
---

`CLUSTER MEET` is used in order to connect different Redis nodes with cluster
support enabled, into a working cluster.

`CLUSTER MEET`命令被用来连接不同的开启集群支持的 Redis 节点，以进入工作集群。

The basic idea is that nodes by default don't trust each other, and are considered unknown, so that it is unlikely that different cluster nodes will mix into a single one because of system administration errors or network addresses modifications.

基本的思想是每个节点默认都是相互不信任的，并且被认为是未知的节点，以便万一因为系统管理错误或地址被修改，而不太可能将多个不同的集群节点混成一个集群。

So in order for a given node to accept another one into the list of nodes composing a Redis Cluster, there are only two ways:

因此，为了使给定的节点能将另一个节点接收到组成 Redis Cluster 的节点列表中，这里只有两种方法：

1. The system administrator sends a `CLUSTER MEET` command to force a node to meet another one.

   系统管理员发送一个`CLUSTER MEET`命令强制一个节点去会面另一个节点。

2. An already known node sends a list of nodes in the gossip section that we are not aware of. If the receiving node trusts the sending node as a known node, it will process the gossip section and send an handshake to the nodes that are still not known.

   一个已知的节点发送一个保存在 gossip 部分的节点列表，包含着未知的节点。如果接收的节点已经将发送节点信任为已知节点，它会处理 gossip 部分并且发送一个握手消息给未知的节点。

Note that Redis Cluster needs to form a full mesh (each node is connected with each other node), but in order to create a cluster, there is no need to send all the `CLUSTER MEET` commands needed to form the full mesh. What matter is to send enough `CLUSTER MEET` messages so that each node can reach each other node through a *chain of known nodes*. Thanks to the exchange of gossip information in heartbeat packets, the missing links will be created.

请注意，Redis Cluster 需要形成一个完整的网络（每个节点都连接着其他每个节点），但是为了创建一个集群，不需要发送形成网络所需的所有`CLUSTER MEET`命令。发送`CLUSTER MEET`消息以便每个节点能够到达其他每个节点只需通过一条*已知的节点链*就足够了。由于在心跳包中会交换 gossip 信息，将会创建节点间缺失的链接。

So, if we link node A with node B via `CLUSTER MEET`, and B with C, A and C will find their ways to handshake and create a link.

所以，如果我们通过`CLUSTER MEET`链接节点 A 和节点 B ，并且节点 B 和 C 有链接，那么节点 A 和节点 C 会发现他们握手和创建链接的方法。

Another example: if we imagine a cluster formed of the following four nodes called A, B, C and D, we may send just the following set of commands to A:

另一个例子：如果我们想象一个由四个分别叫 A，B，C，和D 的节点组成，我们可能只发送以下一组命令给节点 A ：

1. `CLUSTER MEET B-ip B-port`
2. `CLUSTER MEET C-ip C-port`
3. `CLUSTER MEET D-ip D-port`

As a side effect of `A` knowing and being known by all the other nodes, it will send gossip sections in the heartbeat packets that will allow each other node to create a link with each other one, forming a full mesh in a matter of seconds, even if the cluster is large.

作为`A`知道和被其他所有节点知道的副作用，它将会在发送的心跳包中包含gossip部分，这将允许其他每个节点彼此都创建一个链接，即使集群很大，也能在数秒钟之内形成一个完整的网络。

Moreover `CLUSTER MEET` does not need to be reciprocal. If I send the command to A in order to join B, I don't need to also send it to B in order to join A.

而且`CLUSTER MEET`不必相互执行，如果发送命令给 A 以加入B ，那么就不必也发送给 B 以加入 A 。

## Implementation details: MEET and PING packets

### 实现细节：MEET 和 PING 包

When a given node receives a `CLUSTER MEET` message, the node specified in the
command still does not know the node we sent the command to. So in order for
the node to force the receiver to accept it as a trusted node, it sends a
`MEET` packet instead of a `PING` packet. The two packets have exactly the
same format, but the former forces the receiver to acknowledge the node as
trusted.

当一个给定的节点接收到一个`CLUSTER MEET`消息时，命令中指定的节点仍然不知道我们发送了命令，所以为了使节点强制将接收命令的节点将它作为信任的节点接受它，它会发送`MEET`包而不是`PING`包。两个消息包有相同的格式，但是`MEET`强制使接收消息包的节点确认发送消息包的节点为可信任的。

@return

@返回

@simple-string-reply: `OK` if the command was successful. If the address or port specified are invalid an error is returned.

@[simple-string-reply](http://www.redis.cn/topics/protocol.html#simple-string-reply)：如果命令执行成功返回`OK`。如果指定地址或端口无效则返回一个错误。