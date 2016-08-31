---
layout: topics
title: REDIS faq
permalink: topics/faq.html
disqusIdentifier: topics_faq
disqusUrl: http://redis.cn/topics/faq.html
discuzTid: 880
---

# FAQ

## Redis与其他key-value存储有什么不同？

主要有以下两个原因。

* Redis有着更为复杂的数据结构并且提供对他们的原子性操作，这是一个不同于其他数据库的进化路径。Redis的数据类型都是基于基本数据结构的同时对程序员透明，无需进行额外的抽象。
* Redis运行在内存中但是可以持久化到磁盘，所以在对不同数据集进行高速读写时需要权衡内存，应为数据量不能大于硬件内存。在内存数据库方面的另一个优点是， 相比在磁盘上相同的复杂的数据结构，在内存中操作起来非常简单，这样Redis可以做很多内部复杂性很强的事情。 同时，在磁盘格式方面他们是紧凑的以追加的方式产生的，因为他们并不需要进行随机访问。

## Redis的内存占用情况怎么样？

给你举个例子： 100万个键值对（键是0到999999值是字符串“hello world”）在我的32位的Mac笔记本上 用了100MB。同样的数据放到一个key里只需要16MB， 这是因为键值有一个很大的开销。 在Memcached上执行也是类似的结果，但是相对Redis的开销要小一点点，因为Redis会记录类型信息引用计数等等。

当然，大键值对时两者的比例要好很多。

64位的系统比32位的需要更多的内存开销，尤其是键值对都较小时，这是因为64位的系统里指针占用了8个字节。 但是，当然，64位系统支持更大的内存，所以为了运行大型的Redis服务器或多或少的需要使用64位的系统。

## 我喜欢Reids的高水平操作和功能，但我不喜欢所有数据都放在内存中，因为我没有一个大数据集的内存，有没有改变这方面的机会呢。

在过去，Redis开发商尝试试用虚拟内存和其他系统为了让RAM数据集更大，但是毕竟我们非常高兴，如果我们能做好一件事：数据保存在内存，存储在磁盘。 但是现在没有计划创建一个基于磁盘的Redis，毕竟目前的设计是直接的原因。

然而，许多大型系统的用户采用多个Redis节点通过客户端Hash的办法解决了大数据集分配的问题。Craigslist和Groupon就是两个列子。

同时Redis Cluster（一个Redis的子集自动分发和容错实现）正在开发中，这可能是很多使用案例的一个很好的解决方案


## 如果我的数据集需要使用非常大的内存，我不希望使用一致性哈希或其他方式将数据集分布在不同的节点，我还能采用Redis吗？

一个可行的方案是同时使用传统数据库（Mysql或者其他的）和Redis，Redis里面存放状态信息（元数据，小但经常写的信息），和所有其他读写频繁的数据：用户身份验证token， 使用Redis List 存放与时间顺序有关的id列表、编码等等。然后使用MySQL（或其他）作为存储引擎来存放更大的数据， 创建一个自增长ID作为主键和一个较大的BLOB字段作为数据字段，访问MySQL的数据只能通过主键（ID） 。执行查询操作时，通过Redis读取数据， 但是当有读取打数据时需要通过主键（ID）访问MySQL数据库。 ，

## 都有哪些办法可以降低Redis的内存使用情况呢？

如果你使用的是32位的Redis实例，可以好好利用Hash,list,sorted set,set等集合类型数据，因为通常情况下很多小的Key-Value可以用更紧凑的方式存放到一起。

## Redis的内存用完了会发生什么？

随着现代操作系统的malloc()，返回NULL是不常见的，通常服务器会启动swap交换，这样Redis的性能会随之降低，您也可能会发现某些不妥。

INFO命令可以查看Redis的使用量，因此您可以编写一个监视Redis服务器状态的临界监控脚本以检查服务器的状态。
或者可以在配置文件中使用“maxmemory”配置Redis可以使用的最大内存，如果达到设置的上限，Redis的写命令会返回错误信息（但是读命令还可以正常返回。） 或者你可以将Redis当缓存来使用配置淘汰机制，当Redis达到内存上限时会冲刷掉旧的内容。

## 在liunx下即使有很多的RAM通过fork()调用后台保存还是会失败！

简短的回答：echo 1 > /proc/sys/vm/overcommit_memory :)

下面是长的回答：

Redis background saving schema relies on the copy-on-write semantic of fork in modern operating systems: Redis forks (creates a child process) that is an exact copy of the parent. The child process dumps the DB on disk and finally exits. In theory the child should use as much memory as the parent being a copy, but actually thanks to the copy-on-write semantic implemented by most modern operating systems the parent and child process will share the common memory pages. A page will be duplicated only when it changes in the child or in the parent. Since in theory all the pages may change while the child process is saving, Linux can't tell in advance how much memory the child will take, so if the overcommit_memory setting is set to zero fork will fail unless there is as much free RAM as required to really duplicate all the parent memory pages, with the result that if you have a Redis dataset of 3 GB and just 2 GB of free memory it will fail.
Setting overcommit_memory to 1 says Linux to relax and perform the fork in a more optimistic allocation fashion, and this is indeed what you want for Redis.
A good source to understand how Linux Virtual Memory work and other alternatives for overcommit_memory and overcommit_ratio is this classic from Red Hat Magazine, "Understanding Virtual Memory".

## Redis 的 on-disk-snapshots 是原子的吗？

是的, 当redis前台在执行命令时后台保存进程是fork(2)ed, 所以任何命令在RAM里是原子操作的，在磁盘快照里面也同样是原子的。

## Redis是单线程的，我怎么提高多核CPU的利用率？

CPU不太可能是Redis的瓶颈，一般内存和网络才有可能是。 例如使用Redis的管道（pipelining）在liunx系统上运行可以达到500K的RPS(requests per second) ，因此，如果您的应用程序主要使用O(N) 或者O(log(N)) 的 命令，他们几乎不需要使用什么CPU。

然而，为了最大限度的使用CPU，可以在同一个服务器部署多个Redis的实例，并把他们当作不同的服务器来使用，在某些时候，无论如何一个服务器是不够的，

所以，如果你想使用多个CPU，你可以考虑一下分片（shard） 。。

在Redis的客户端类库里面，比如RB（Ruby的客户端）和Predis（最常用的PHP客户端之一），能够使用一致性哈希（consistent hashing）来处理多个Redis实例。

## 一个Redis实例最多能存放多少的keys，List、Set、Sorted Set他们最多能存放多少元素？

理论上Redis可以处理多达232的keys，并且在实际中进行了测试，每个实例至少存放了2亿5千万的keys。我们正在测试一些较大的值。

任何list、set、和sorted set都可以放2<sup>32</sup>个元素。

换句话说，Redis的存储极限是系统中的可用内存值。

## Redis 是什么意思？

他的意思是 REmote DIctionary Server。

## 你为什么开始Redis项目？

本来，Redis是为了[LLOOGG](http://lloogg.com)开始的。 但之后，我得到了基本服务的工作，我喜欢将自己的想法分享给其他工作者，并把Redis转变成一个开源项目。


