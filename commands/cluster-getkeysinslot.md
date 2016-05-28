---
layout: commands
title: cluster-getkeysinslot 命令 -- Redis中文资料站
permalink: commands/cluster-getkeysinslot.html
disqusIdentifier: command_cluster-getkeysinslot
disqusUrl: http://redis.cn/commands/cluster-getkeysinslot.html
commandsType: cluster
---

本命令返回存储在连接节点的指定hash slot里面的key的列表。key的最大数量通过`count`参数指定，所以这个API可以用作keys的批处理。

这个命令的主要是用于rehash期间slot从一个节点移动到另外一个节点。集群rehash的具体做法在Redis集群规范文档，或者你可以查询`CLUSTER SETSLOT`命令文档的附录。

```
> CLUSTER GETKEYSINSLOT 7000 3
"47344|273766|70329104160040|key_39015"
"47344|273766|70329104160040|key_89793"
"47344|273766|70329104160040|key_92937"
```

@return

@array-reply: 返回*count*个key的列表。
