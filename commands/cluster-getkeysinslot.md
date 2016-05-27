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

----------------------------------

The command returns an array of keys names stored in the contacted node and
hashing to the specified hash slot. The maximum number of keys to return
is specified via the `count` argument, so that it is possible for the user
of this API to batch-processing keys.

The main usage of this command is during rehashing of cluster slots from one
node to another. The way the rehashing is performed is exposed in the Redis
Cluster specification, or in a more simple to digest form, as an appendix
of the `CLUSTER SETSLOT` command documentation.

```
> CLUSTER GETKEYSINSLOT 7000 3
"47344|273766|70329104160040|key_39015"
"47344|273766|70329104160040|key_89793"
"47344|273766|70329104160040|key_92937"
```

@return

@array-reply: From 0 to *count* key names in a Redis array reply.
