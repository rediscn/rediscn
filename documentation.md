---
layout: index
title: Redis文档中心
excerpt: redis文档中心，这里介绍了redis基本数据类型、完整的命令、持久化、内存优化等一系列redis基本功能和配置使用的介绍文档。
permalink: documentation.html
disqusIdentifier: documentation
disqusUrl: http://redis.cn/documentation.html
discuzTid: 852
---

<h1>文档</h1>
        
<p>注意: Redis的文档在 <a href="http://github.com/antirez/redis-doc">redis-doc github repository</a>同样也有提供。</p>


<h2>Redis 使用</h2>

<ul>
<li><a href="/commands.html">Redis命令</a> redis完整的命令列表，以及他们的说明文档。</li>
<li><a href="/topics/pipelining.html">管道（Pipelining）</a>：学习如何一次发送多个命令，节省往返时间。</li>
<li><a href="topics/pubsub.html">Redis 发布/订阅（Pub/Sub）</a>：redis是一个快速、稳定的发布/订阅的信息系统。</li>
<li><a href="/commands/eval.html">Redis Lua 脚本</a>：Redis 2.6 Lua 脚本相关文档。</li>
<li><a href="/topics/memory-optimization.html">内存优化</a>：了解如何使用内存和学习一些使用技巧。</li>
<li><a href="/commands/expire.html">过期（Expires）</a>：Redis允许为每一个key设置不同的过期时间，当它们到期时将自动从服务器上删除。</li>
<li><a href="/topics/lru-cache.html">将Redis当做使用LRU算法的缓存来使用</a>：如何配置并且将Redis当做缓存来使用，通过限制内存及自动回收键。</li>
<li><a href="/topics/transactions.html">Redis 事务</a>：将一组命令放在同一个事务中进行处理。</li>
<li><a href="/topics/mass-insert.html">大量插入数据</a>：如何在短时间里向Redis写入大量数据。</li>
<li><a href="/topics/batch-insert.html">从文件中批量插入数据</a>：将文件中的指令批量执行。</li>
<li><a href="/topics/partitioning.html">分区（Partitioning）</a>：如何将你的数据分布在多个Redis里面。</li>
</ul>

<h2>Redis 管理</h2>

<ul>
<li><a href="/topics/config.html">配置（Configuration）</a>：怎么配置 redis。</li>
<li><a href="/topics/replication.html">复制（Replication）</a>：你需要知道怎么设置主从复制。</li>
<li><a href="/topics/persistence.html">持久化（Persistence）</a>：了解如何配置redis的持久化。</li>
<li><a href="/topics/admin.html">Redis 管理（Redis Administration）</a>：学习redis管理方面的知识。</li>
<li><a href="/topics/security.html">安全性（Security）</a>：概述Redis的安全。</li>
<li><a href="/topics/signals.html">信号处理（Signals Handling）</a>：如何处理Redis信号。</li>
<li><a href="/topics/clients.html">连接处理（Connections Handling）</a>：如何处理Redis客户端连接。</li>
<li><a href="/topics/sentinel.html">高可用性（High Availability）</a>：Redis Sentinel是Redis官方的高可用性解决方案。目前工作进展情况（beta阶段，积极发展），已经可用。</li>
<li><a href="/topics/benchmarks.html">基准（Benchmarks）</a>：看看Redis在不同平台上跑得有多快。</li>
</ul>

<h2>故障排除</h2>

<ul>
<li><a href="/topics/problems.html">Redis 的问题?</a>: 错误（Bugs）? 高延迟（High latency）? 其他问题? 使用 <a href="/topics/problems.html">我们的故障排除页面</a> 作为出发点，了解更多的信息。</li>
</ul>

<h2>非稳定版的功能文档</h2>

<ul>
<li><a href="/topics/notifications.html">Redis的密钥空间通知（Redis keyspace notifications）</a>：获得通过的Pub / Sub的密钥空间活动的通知。最近不稳定的分支合并到了此功能。这个实现的第一个稳定版本将在Redis的2.8。</li>
</ul>

<h2>产品规格（Specifications）</h2>

<ul>
<li><a href="/topics/protocol.html">Redis的协议规范（Redis Protocol specification）</a>如果你正在使用redis，或者对它好奇，这里将简单的介绍如何与redis交互。</li>
<li><a href="https://github.com/sripathikrishnan/redis-rdb-tools/wiki/Redis-RDB-Dump-File-Format">Redis的RDB格式规范</a>，与 <a href="https://github.com/sripathikrishnan/redis-rdb-tools/blob/master/docs/RDB_Version_History.textile">RDB的版本历史记录</a>。</li>
<li><a href="/topics/internals.html">内部机制（Internals）</a>:详细学习Redis内部引擎是如何实现的。</li>
</ul>

<h2>教程 &amp; FAQ</h2>

<ul>
<li><a href="/topics/faq.html">FAQ</a>：关于Redis的一些常见问题。</li>
<li><a href="/topics/data-types.html">数据类型（Data types）</a>：Redis支持不同类型值的摘要。</li>
<li><a href="/topics/data-types-intro.html">15分钟快速了解Redis的数据结构</a></li>
<li><a href="/topics/twitter-clone.html">用PHP+Redis编写一个简单的Twitter</a></li>
<li><a href="http://antirez.com/post/autocomplete-with-redis.html">用Redis实现自动完成</a></li>
</ul>

<h2>简报（Presentations）</h2>

<ul>
<li>Salvatore Sanfilippo: <a href="http://redis.io/presentation/Redis_Cluster.pdf">Redis的集群概述</a></li>
<li>Pieter Noordhuis: <a href="http://redis.io/presentation/Pnoordhuis_whats_new_in_2_2.pdf">Redis 2.2的新特性</a></li>
</ul>

<p>如果你想在演示文稿中使用本标识（logo），请使用<a href="http://redis.io/images/redis-300dpi.png">高分辨率的版本</a>。 <a href="http://redis.io/images/redis-logo.svg">SVG版本</a>也是可用的。</p>

<h2>使用案例（Use cases）</h2>

<ul>
<li><a href="/topics/whos-using-redis.html">谁正在使用 Redis</a></li>
</ul>

<h2>书籍</h2>

<p>以下是已经发布的Redis书籍的列表：</p>

<ul>
<li>由 <a href="http://twitter.com/karlseguin">Karl Seguin</a> 编写的 <a href="http://openmymind.net/2012/1/23/The-Little-Redis-Book/">《The Little Redis Book》</a>  是一本非常简洁和开放的Reids入门书籍。</li>
<li><a href="http://twitter.com/dr_josiah">Josiah L. Carlson</a> 编写的 <a href="http://www.manning.com/carlson/">《Redis in Action》</a> 是早期的阅读版本。</li>
<li>还有 <a href="http://shop.oreilly.com/product/0636920020127.do">Redis Cookbook (O&#39;Reilly Media, 2011)</a></li>
</ul>

<p>下列书籍有Redis的相关内容，但不是专门关于Redis的：</p>

<ul>
<li><a href="http://pragprog.com/book/rwdata/seven-databases-in-seven-weeks">Seven databases in seven weeks</a> (Note: Redis chapter still coming soon).</li>
<li><a href="http://shop.oreilly.com/product/0636920010203.do">Mining the Social Web (O&#39;Reilly Media, 2011)</a></li>
<li><a href="http://www.wrox.com/WileyCDA/WroxTitle/Professional-NoSQL.productCd-047094224X.html">Professional NoSQL (Wrox, 2011)</a></li>
</ul>

<h2>保荐人</h2>

<p> <a href="http://antirez.com">Salvatore Sanfilippo</a> 和 <a href="http://twitter.com/pnoordhuis">Pieter Noordhuis</a> 发展redis的工作是由 <a href="http://vmware.com">VMware</a>发起的。在过去Redis接受过的捐赠中，将在<a href="/topics/sponsors.html">赞助商的页面</a>中列出的其他公司。 </p>
      