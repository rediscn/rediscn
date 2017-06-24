---
layout: topics
title: REDIS 分区
permalink: topics/partitioning.html
disqusIdentifier: topics_partitioning
disqusUrl: http://redis.cn/topics/partitioning.html
discuzTid: 862
tranAuthor: lidongliang
---

分区：怎样将数据分布到多个redis实例
===

分区是将你的数据分发到不同redis实例上的一个过程，每个redis实例只是你所有key的一个子集。文档第一部分将介绍分区概念，第二部分介绍分区的另外一种可选方案。

## 为什么分区非常有用

Redis分区主要有两个目的:

* 分区可以让Redis管理更大的内存，Redis将可以使用所有机器的内存。如果没有分区，你最多只能使用一台机器的内存。
* 分区使Redis的计算能力通过简单地增加计算机得到成倍提升,Redis的网络带宽也会随着计算机和网卡的增加而成倍增长。

## 分区基本概念

有许多分区标准。假如我们有4个Redis实例**R0**, **R1**, **R2**, **R3**,有一批用户数据`user:1`, `user:2`, ... ,那么有很多存储方案可以选择。从另一方面说，有很多*different systems to map*方案可以决定用户映射到哪个Redis实例。

一种最简单的方法就是**范围分区**,就是将不同范围的对象映射到不同Redis实例。比如说，用户ID从0到10000的都被存储到**R0**,用户ID从10001到20000被存储到**R1**,依此类推。


这是一种可行方案并且很多人已经在使用。但是这种方案也有缺点，你需要建一张表存储数据到redis实例的映射关系。这张表需要非常谨慎地维护并且需要为每一类对象建立映射关系，所以redis范围分区通常并不像你想象的那样运行，比另外一种分区方案效率要低很多。

另一种可选的范围分区方案是**散列分区**，这种方案要求更低，不需要key必须是`object_name:<id>`的形式，如此简单：

* 使用散列函数 (如 `crc32` )将键名称转换为一个数字。例：键`foobar`, 使用`crc32(foobar)`函数将产生散列值`93024922`。
* 对转换后的散列值进行取模，以产生一个0到3的数字，以便可以使这个key映射到4个Redis实例当中的一个。`93024922 % 4` 等于 `2`, 所以 `foobar` 会被存储到第2个Redis实例。 **R2** *注意: 对一个数字进行取模，在大多数编程语言中是使用运算符%*

还有很多分区方法，上面只是给出了两个简单示例。有一种比较高级的散列分区方法叫**一致性哈希**，并且有一些客户端和代理（proxies)已经实现。

## 不同的分区实现方案

分区可以在程序的不同层次实现。

* **客户端分区**就是在客户端就已经决定数据会被存储到哪个redis节点或者从哪个redis节点读取。大多数客户端已经实现了客户端分区。
* **代理分区** 意味着客户端将请求发送给代理，然后代理决定去哪个节点写数据或者读数据。代理根据分区规则决定请求哪些Redis实例，然后根据Redis的响应结果返回给客户端。redis和memcached的一种代理实现就是[Twemproxy](https://github.com/twitter/twemproxy)
* **查询路由(Query routing)** 的意思是客户端随机地请求任意一个redis实例，然后由Redis将请求转发给正确的Redis节点。Redis Cluster实现了一种混合形式的查询路由，但并不是直接将请求从一个redis节点转发到另一个redis节点，而是在客户端的帮助下直接*redirected*到正确的redis节点。

## 分区的缺点

有些特性在分区的情况下将受到限制:

* 涉及多个key的操作通常不会被支持。例如你不能对两个集合求交集，因为他们可能被存储到不同的Redis实例（实际上这种情况也有办法，但是不能直接使用交集指令）。
* 同时操作多个key,则不能使用Redis事务.
* 分区使用的粒度是key，不能使用一个非常长的排序key存储一个数据集（The partitioning granularity is the key, so it is not possible to shard a dataset with a single huge key like a very big sorted set）.
* 当使用分区的时候，数据处理会非常复杂，例如为了备份你必须从不同的Redis实例和主机同时收集RDB / AOF文件。
* 分区时动态扩容或缩容可能非常复杂。Redis集群在运行时增加或者删除Redis节点，能做到最大程度对用户透明地数据再平衡，但其他一些客户端分区或者代理分区方法则不支持这种特性。然而，有一种*预分片*的技术也可以较好的解决这个问题。

## 持久化数据还是缓存？

无论是把Redis当做持久化的数据存储还是当作一个缓存，从分区的角度来看是没有区别的。当把Redis当做一个持久化的存储（服务）时，一个key必须严格地每次被映射到同一个Redis实例。当把Redis当做一个缓存（服务）时，即使Redis的其中一个节点不可用而把请求转给另外一个Redis实例，也不对我们的系统产生什么影响，我们可用任意的规则更改映射，进而提高系统的*高可用*（即系统的响应能力）。

一致性哈希能够实现当一个key的首选的节点不可用时切换至其他节点。同样地，如果你增加了一个新节点，立刻就会有新的key被分配至这个新节点。

重要结论如下:

* 如果Redis被当做缓存使用，使用一致性哈希实现**动态扩容缩容**。
* 如果Redis被当做一个持久化存储使用，**必须使用固定的keys-to-nodes映射关系，节点的数量一旦确定不能变化**。否则的话(即Redis节点需要动态变化的情况），必须使用可以在运行时进行数据再平衡的一套系统，而当前只有Redis集群可以做到这样 - Redis 集群已经可用 [2015.4.1](https://groups.google.com/d/msg/redis-db/dO0bFyD_THQ/Uoo2GjIx6qgJ).

## 预分片

从上面获知，除非我们把Redis当做缓存使用，否则（在生产环境动态）增加和删除节点将非常麻烦，但是使用固定的keys-instances则比较简单。

一般情况下随着时间的推移，数据存储需求总会发生变化。今天可能10个Redis节点就够了，但是明天可能就需要增加到50个节点。

既然Redis是如此的轻量（单实例只使用1M内存）,为防止以后的扩容，最好的办法就是一开始就启动较多实例。即便你只有一台服务器，你也可以一开始就让Redis以分布式的方式运行，使用分区，在同一台服务器上启动多个实例。


一开始就多设置几个Redis实例，例如32或者64个实例，对大多数用户来说这操作起来可能比较麻烦，但是从长久来看做这点牺牲是值得的。

这样的话，当你的数据不断增长，需要更多的Redis服务器时，你需要做的就是仅仅将Redis实例从一台服务迁移到另外一台服务器而已（而不用考虑重新分区的问题）。一旦你添加了另一台服务器，你需要将你一半的Redis实例从第一台机器迁移到第二台机器。

使用Redis复制技术，你可以做到极短或者不停机地对用户提供服务：

* 在你新服务器启动一个空Redis实例。
* 把新Redis实例配置为原实例的slave节点
* 停止你的客户端
* 更新你客户端配置，以便启用新的redis实例（更新IP）。
* 在新Redis实例中执行`SLAVEOF NO ONE`命令
* （更新配置后）重启你的客户端
* 停止你原服务器的Redis实例

# Redis分区实现

截止到目前，我们从理论上讨论了Redis分区，但是实际上是怎样的呢？你应该采用哪种实现方案呢？

## Redis 集群

Redis集群是自动分片和高可用的首选方案。新的集群方案2015年4月1日就已经可用。[2015.4.1 Google论文](https://groups.google.com/d/msg/redis-db/dO0bFyD_THQ/Uoo2GjIx6qgJ).
你可以从这里[Cluster tutorial](/topics/cluster-tutorial)了解更多。

当Redis集群可用，并且有兼容Redis 集群客户端可用于你的编程语言，Redis 集群将成为Redis分区的实际标准.

Redis集群是 *query routing* 和 *client side partitioning*的一种混合实现。

## Twemproxy

[Twemproxy是Twitter维护的（缓存）代理系统](https://github.com/twitter/twemproxy)，代理Memcached的ASCII协议和Redis协议。它是单线程程序，使用c语言编写，运行起来非常快。它是采用Apache 2.0 license的开源软件。

Twemproxy支持自动分区，如果其代理的其中一个Redis节点不可用时，会自动将该节点排除（这将改变原来的keys-instances的映射关系，所以你应该仅在把Redis当缓存时使用Twemproxy)。

Twemproxy本身不存在单点问题，因为你可以启动多个Twemproxy实例，然后让你的客户端去连接任意一个Twemproxy实例。

Twemproxy是Redis客户端和服务器端的一个中间层，由它来处理分区功能应该不算复杂，并且应该算比较可靠的。 

更多关于Twemproxy [in this antirez blog post](http://antirez.com/news/44).

## 支持一致性哈希的客户端

相对于Twemproxy，另一种可选的分区方案是在客户端实现一致性哈希或者其他类似算法。有很多客户端已经支持一致性哈希，如 [Redis-rb](https://github.com/redis/redis-rb) 和 [Predis](https://github.com/nrk/predis).

请检查 [Redis客户端完整列表](http://redis.io/clients) 以确认在你想要使用的编程语言，有成熟的一致性哈希客户端实现。
