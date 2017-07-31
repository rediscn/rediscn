---
layout: commands
title: cluster-meet 命令
permalink: commands/cluster-meet.html
disqusIdentifier: command_cluster-meet
disqusUrl: http://redis.cn/commands/cluster-meet.html
commandsType: cluster
discuzTid: 926
tranAuthor: menwengit
---

`CLUSTER MEET`命令被用来连接不同的开启集群支持的 Redis 节点，以进入工作集群。

基本的思想是每个节点默认都是相互不信任的，并且被认为是未知的节点，以便万一因为系统管理错误或地址被修改，而不太可能将多个不同的集群节点混成一个集群。

因此，为了使给定的节点能将另一个节点接收到组成 Redis Cluster 的节点列表中，这里只有两种方法：

1. 系统管理员发送一个`CLUSTER MEET`命令强制一个节点去会面另一个节点。

2. 一个已知的节点发送一个保存在 gossip 部分的节点列表，包含着未知的节点。如果接收的节点已经将发送节点信任为已知节点，它会处理 gossip 部分并且发送一个握手消息给未知的节点。

请注意，Redis Cluster 需要形成一个完整的网络（每个节点都连接着其他每个节点），但是为了创建一个集群，不需要发送形成网络所需的所有`CLUSTER MEET`命令。发送`CLUSTER MEET`消息以便每个节点能够到达其他每个节点只需通过一条*已知的节点链*就足够了。由于在心跳包中会交换 gossip 信息，将会创建节点间缺失的链接。

所以，如果我们通过`CLUSTER MEET`链接节点 A 和节点 B ，并且节点 B 和 C 有链接，那么节点 A 和节点 C 会发现他们握手和创建链接的方法。

另一个例子：如果我们想象一个由四个分别叫 A，B，C，和D 的节点组成，我们可能只发送以下一组命令给节点 A ：

1. `CLUSTER MEET B-ip B-port`
2. `CLUSTER MEET C-ip C-port`
3. `CLUSTER MEET D-ip D-port`

作为`A`知道和被其他所有节点知道的副作用，它将会在发送的心跳包中包含gossip部分，这将允许其他每个节点彼此都创建一个链接，即使集群很大，也能在数秒钟之内形成一个完整的网络。

而且`CLUSTER MEET`不必相互执行，如果发送命令给 A 以加入B ，那么就不必也发送给 B 以加入 A 。

### 实现细节：MEET 和 PING 包

当一个给定的节点接收到一个`CLUSTER MEET`消息时，命令中指定的节点仍然不知道我们发送了命令，所以为了使节点强制将接收命令的节点将它作为信任的节点接受它，它会发送`MEET`包而不是`PING`包。两个消息包有相同的格式，但是`MEET`强制使接收消息包的节点确认发送消息包的节点为可信任的。

## 返回值

[simple-string-reply](http://www.redis.cn/topics/protocol.html#simple-string-reply)：如果命令执行成功返回`OK`。如果指定地址或端口无效则返回一个错误。