---
layout: topics
title: REDIS 介绍
excerpt: REDIS 详细介绍，Redis 是一个开源（BSD许可）的，内存中的数据结构存储系统，它可以用作数据库、缓存和消息中间件.
permalink: topics/introduction.html
disqusIdentifier: topics_introduction
disqusUrl: http://redis.cn/topics/introduction.html
discuzTid: 890
---

Redis 介绍
===

&nbsp;&nbsp;&nbsp;&nbsp;Redis 是一个开源（BSD许可）的，内存中的数据结构存储系统，它可以用作数据库、缓存和消息中间件. 它支持多种类型的数据结构，如
[字符串（strings）](/topics/data-types-intro.html#strings)， [散列（hashes）](/topics/data-types-intro.html#hashes)， [列表（lists）](/topics/data-types-intro.html#lists)， [集合（sets）](/topics/data-types-intro.html#sets)，
[有序集合（sorted sets）](/topics/data-types-intro.html#sorted-sets) 与范围查询， [bitmaps](/topics/data-types-intro.html#bitmaps)， [hyperloglogs](/topics/data-types-intro.html#hyperloglogs)
和 [地理空间（geospatial）](/commands/geoadd.html) 索引半径查询.
Redis 内置了 [复制（replication）](/topics/replication.html)， [LUA脚本（Lua scripting）](/commands/eval.html)， [LRU驱动事件（LRU eviction）](/topics/lru-cache.html)， 
[事务（transactions）](/topics/transactions.html) 和不同级别的 [磁盘持久化（persistence）](/topics/persistence.html)， 
并通过 [Redis哨兵（Sentinel）](/topics/sentinel.html) 和自动 [分区（Cluster）](/topics/cluster-tutorial.html)提供高可用性（high availability）.

&nbsp;&nbsp;&nbsp;&nbsp;你可以对这些类型执行 **原子操作**
， 列如： [字符串（strings）的append 命令](/commands/append.html);
[散列（hashes）的hincrby命令](/commands/hincrby.html); [列表（lists）的lpush命令](/commands/lpush.html); [集合（sets）计算交集sinter命令](/commands/sinter.html)，
[计算并集union命令](/commands/sunion.html) 和 [计算差集sdiff命令](/commands/sdiff.html);
或者 [在有序集合（sorted sets）里面获取成员的最高排名zrangebyscore命令](/commands/zrangebyscore.html).

&nbsp;&nbsp;&nbsp;&nbsp;为了实现其卓越的性能， Redis 采用运行在
**内存中的数据集**工作方式. 根据您的使用情况， 您可以每隔一定时间将 [数据集导出到磁盘](/topics/persistence.html#snapshotting)
， 或者 [追加到命令日志中](/topics/persistence.html#append-only-file). 
您也可以关闭持久化功能，将Redis作为一个高效的网络的缓存数据功能使用.

&nbsp;&nbsp;&nbsp;&nbsp;Redis 同样支持 [主从复制](/topics/replication.html)（能自动重连和网络断开时自动重新同步），并且第一次同步是快速的非阻塞试的同步.

其他功能包括:

* [事务（Transactions）](/topics/transactions.html)
* [订阅分发（Pub/Sub）](/topics/pubsub.html)
* [LUA脚本（Lua scripting）](/commands/eval.html)
* [过期自动删除key](/commands/expire.html)
* [内存回收](/topics/lru-cache.html)
* [自动故障转移](/topics/sentinel.html)

您可以使用 [大多数的编程语言](/clients.html) 来使用Redis. 

&nbsp;&nbsp;&nbsp;&nbsp;Redis 使用 **ANSI C** 编写并且能在绝大Linux系统上运行，基于BSD协议，对OS X没有外部依赖.
我们支持Linux 和 OS X两种系统的开发和测试，我们推荐使用**Linux部署**.
Redis 可以像SmartOS一样运行在Solaris系统中， 但是我们会*最大力度*的支持它.
官方不支持Windos版本的Redis,但微软开发和维护着[支持win-64 的Redis](https://github.com/MSOpenTech/redis)版本.
