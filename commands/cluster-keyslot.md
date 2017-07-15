---
layout: commands
title: cluster-keyslot 命令
permalink: commands/cluster-keyslot.html
disqusIdentifier: command_cluster-keyslot
disqusUrl: http://redis.cn/commands/cluster-keyslot.html
commandsType: cluster
discuzTid: 925
---

Returns an integer identifying the hash slot the specified key hashes to. This command is mainly useful for debugging and testing, since it exposes via an API the underlying Redis implementation of the hashing algorithm. Example use cases for this command:

返回一个整数，用于标识指定键所散列到的哈希槽。该命令主要用来调试和测试，因为它通过一个API来暴露Redis底层哈希算法的实现。该命令的使用示例：

1. Client libraries may use Redis in order to test their own hashing algorithm, generating random keys and hashing them with both their local implementation and using Redis `CLUSTER KEYSLOT` command, then checking if the result is the same.

   客户端库可能会使用Redis来测试他们自己的哈希算法，生成随机的键并且使用他们自己实现的算法和Redis的`CLUSTER KEYSLOT`命令来散列这些键，然后检查结果是否相同。

2. Humans may use this command in order to check what is the hash slot, and then the associated Redis Cluster node, responsible for a given key.

   人们会使用这个命令去检查哈希槽是哪个，然后关联Redis Cluster的节点，并且负责一个给定的键。

## Example

## 例如

```
> CLUSTER KEYSLOT somekey
11058
> CLUSTER KEYSLOT foo{hash_tag}
(integer) 2515
> CLUSTER KEYSLOT bar{hash_tag}
(integer) 2515
```

Note that the command implements the full hashing algorithm, including support for **hash tags**, that is the special property of Redis Cluster key hashing algorithm, of hashing just what is between `{` and `}` if such a pattern is found inside the key name, in order to force multiple keys to be handled by the same node.

注意该命令实现了完整的哈希算法，包括支持 **hash tags**，这是Redis Cluster键一个特殊的哈希算法，如果键名中存在左右大括号的模式，只会散列在 `{` 和 `}` 之间的字符串，为了去强制将多个键由一个节点来处理。

@return

@返回值

@integer-reply: The hash slot number.

@[Integer reply](http://www.redis.cn/topics/protocol.html#integer-reply)：哈希槽的值。