---
layout: commands
title: cluster-slots 命令
permalink: commands/cluster-slots.html
disqusIdentifier: command_cluster-slots
disqusUrl: http://redis.cn/commands/cluster-slots.html
commandsType: cluster
discuzTid: 934
transAuthor: dongliang.li
---

`CLUSTER SLOTS`命令返回哈希槽和Redis实例映射关系。这个命令对客户端实现集群功能非常有用，使用这个命令可以获得*哈希槽*与节点（由IP和端口组成）的映射关系，这样，当客户端收到（用户的）调用命令时，可以根据（这个命令）返回的信息将命令发送到正确的Redis实例.

## （嵌套对象）结果数组
每一个（节点）信息:

  - 哈希槽起始编号
  - 哈希槽结束编号
  - 哈希槽对应master节点，节点使用IP/Port表示
  - master节点的第一个副本
  - 第二个副本
  - ...直到所有的副本都打印出来

每个结果包含该哈希槽范围的所有存活的副本，没有存活的副本不会返回.

（每个节点信息的）第三个（行）对象一定是IP/Port形式的master节点。之后的所有IP/Port都是该哈希槽范围的Redis副本。

如果一个集群实例中的哈希槽不是连续的（例如1-400,900,1800-6000），那么哈希槽对应的master和replica副本在这些不同的哈希槽范围会出现多次。

返回值

@array-reply: 描述每个哈希槽范围的包含嵌套对象的列表，嵌套对象包含 IP/Port

### 输出示例

    127.0.0.1:7001> cluster slots
    1) 1) (integer) 0
       2) (integer) 4095
       3) 1) "127.0.0.1"
          2) (integer) 7000
       4) 1) "127.0.0.1"
          2) (integer) 7004
    2) 1) (integer) 12288
       2) (integer) 16383
       3) 1) "127.0.0.1"
          2) (integer) 7003
       4) 1) "127.0.0.1"
          2) (integer) 7007
    3) 1) (integer) 4096
       2) (integer) 8191
       3) 1) "127.0.0.1"
          2) (integer) 7001
       4) 1) "127.0.0.1"
          2) (integer) 7005
    4) 1) (integer) 8192
       2) (integer) 12287
       3) 1) "127.0.0.1"
          2) (integer) 7002
       4) 1) "127.0.0.1"
          2) (integer) 7006


