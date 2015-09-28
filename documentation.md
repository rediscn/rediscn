---
layout: index
title: Redis文档中心 -- Redis中文资料站
excerpt: redis文档中心，这里介绍了redis基本数据类型、完整的命令、持久化、内存优化等一系列redis基本功能和配置使用的介绍文档。
permalink: documentation.html
disqusIdentifier: documentation
disqusUrl: http://redis.cn/documentation.html
---


<div class='text'>
          <article id='topic'>
            <span id="documentation" class=anchor></span><h1 ><a href="#documentation" class=anchor-link>*</a>Documentation</h1>
            
            <p>Note: The Redis Documentation is also available in raw (computer friendly) format in the <a href="http://github.com/antirez/redis-doc">redis-doc github repository</a>. The Redis Documentation is released under the <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International license</a>.</p>
            
            <span id="programming-with-redis" class=anchor></span><h2 ><a href="#programming-with-redis" class=anchor-link>*</a>Programming with Redis</h2>
            
            <ul>
            <li><a href="/commands">The full list of commands</a> implemented by Redis, along with thorough documentation for each of them.</li>
            <li><a href="/topics/pipelining">Pipelining</a>: Learn how to send multiple commands
            at once, saving on round trip time.</li>
            <li><a href="topics/pubsub">Redis Pub/Sub</a>: Redis is a fast and stable Publish/Subscribe messaging system! Check it out.</li>
            <li><a href="/commands/eval">Redis Lua scripting</a>: Redis 2.6 Lua scripting feature documentation.</li>
            <li><a href="/topics/memory-optimization">Memory optimization</a>: Understand how
            Redis uses RAM and learn some tricks to use less of it.</li>
            <li><a href="/commands/expire">Expires</a>: Redis allows to set a time to live different for every key so that the key will be automatically removed from the server when it expires.</li>
            <li><a href="/topics/lru-cache">Redis as an LRU cache</a>: How to configure and use Redis as a cache with a fixed amount of memory and auto eviction of keys.</li>
            <li><a href="/topics/transactions">Redis transactions</a>: It is possible to group commands together so that they are executed as a single transaction.</li>
            <li><a href="/topics/mass-insert">Mass insertion of data</a>: How to add a big amount of pre existing or generated data to a Redis instance in a short time.</li>
            <li><a href="/topics/partitioning">Partitioning</a>: How to distribute your data among multiple Redis instances.</li>
            <li><a href="/topics/distlock">Distributed locks</a>: Implementing a distributed lock manager with Redis.</li>
            <li><a href="/topics/notifications">Redis keyspace notifications</a>: Get notifications of keyspace events via Pub/Sub (Redis 2.8 or greater).</li>
            </ul>
            
            <span id="tutorials-amp-faq" class=anchor></span><h2 ><a href="#tutorials-amp-faq" class=anchor-link>*</a>Tutorials &amp; FAQ</h2>
            
            <ul>
            <li><a href="/topics/data-types-intro">Introduction to Redis data types</a>: This is a good starting point to learn the Redis API and data model.</li>
            <li><a href="/topics/twitter-clone">Writing a simple Twitter clone with PHP and Redis</a></li>
            <li><a href="http://autocomplete.redis.io">Auto complete with Redis</a></li>
            <li><a href="/topics/data-types">Data types short summary</a>: A short summary of the different types of values that Redis supports, not as updated and info rich as the first tutorial listed in this section.</li>
            <li><a href="/topics/faq">FAQ</a>: Some common questions about Redis.</li>
            </ul>
            
            <span id="administration" class=anchor></span><h2 ><a href="#administration" class=anchor-link>*</a>Administration</h2>
            
            <ul>
            <li><a href="/topics/config">Configuration</a>: How to configure redis.</li>
            <li><a href="/topics/replication">Replication</a>: What you need to know in order to
            set up master-slave replication.</li>
            <li><a href="/topics/persistence">Persistence</a>: Know your options when configuring
            Redis&#39; durability.</li>
            <li><a href="/topics/admin">Redis Administration</a>: Selected administration topics.</li>
            <li><a href="/topics/security">Security</a>: An overview of Redis security.</li>
            <li><a href="/topics/encryption">Encryption</a>: How to encrypt Redis client-server communication.</li>
            <li><a href="/topics/signals">Signals Handling</a>: How Redis handles signals.</li>
            <li><a href="/topics/clients">Connections Handling</a>: How Redis handles clients connections.</li>
            <li><a href="/topics/sentinel">High Availability</a>: Redis Sentinel is the official high availability solution for Redis.</li>
            <li><a href="/topics/latency-monitor">Latency monitoring</a>: Redis integrated latency monitoring and reporting capabilities are helpful to tune Redis instances for low latency workloads.</li>
            <li><a href="/topics/benchmarks">Benchmarks</a>: See how fast Redis is in different platforms.</li>
            <li><a href="/topics/releases">Redis Releases</a>: Redis development cycle and version numbering.</li>
            </ul>
            
            <span id="troubleshooting" class=anchor></span><h2 ><a href="#troubleshooting" class=anchor-link>*</a>Troubleshooting</h2>
            
            <ul>
            <li><a href="/topics/problems">Redis problems?</a>: Bugs? High latency? Other issues? Use <a href="/topics/problems">our problems troubleshooting page</a> as a starting point to find more information.</li>
            </ul>
            
            <span id="redis-cluster" class=anchor></span><h2 ><a href="#redis-cluster" class=anchor-link>*</a>Redis Cluster</h2>
            
            <ul>
            <li><a href="/topics/cluster-tutorial">Redis Cluster tutorial</a>: a gentle introduction and setup guide to Redis Cluster.</li>
            <li><a href="/topics/cluster-spec">Redis Cluster specification</a>: the more formal description of the behavior and algorithms used in Redis Cluster.</li>
            </ul>
            
            <span id="other-distributed-systems-based-on-redis" class=anchor></span><h2 ><a href="#other-distributed-systems-based-on-redis" class=anchor-link>*</a>Other distributed systems based on Redis</h2>
            
            <ul>
            <li><a href="https://github.com/soundcloud/roshi">Roshi</a> is a large-scale CRDT set implementation for timestamped events based on Redis and implemented in Go. It was initially developed for <a href="http://developers.soundcloud.com/blog/roshi-a-crdt-system-for-timestamped-events">the SoundCloud stream</a>.</li>
            </ul>
            
            <span id="specifications" class=anchor></span><h2 ><a href="#specifications" class=anchor-link>*</a>Specifications</h2>
            
            <ul>
            <li><a href="/topics/rdd">Redis Design Drafts</a>: Design drafts of new proposals.</li>
            <li><a href="/topics/protocol">Redis Protocol specification</a>: if you&#39;re implementing a
            client, or out of curiosity, learn how to communicate with Redis at a
            low level.</li>
            <li><a href="https://github.com/sripathikrishnan/redis-rdb-tools/wiki/Redis-RDB-Dump-File-Format">Redis RDB format</a> specification, and <a href="https://github.com/sripathikrishnan/redis-rdb-tools/blob/master/docs/RDB_Version_History.textile">RDB version history</a>.</li>
            <li><a href="/topics/internals">Internals</a>: Learn details about how Redis is implemented under the hood.</li>
            </ul>
            
            <span id="resources" class=anchor></span><h2 ><a href="#resources" class=anchor-link>*</a>Resources</h2>
            
            <ul>
            <li><a href="http://www.cheatography.com/tasjaevan/cheat-sheets/redis/">Redis Cheat Sheet</a>: Online or printable function reference for Redis.</li>
            </ul>
            
            <span id="use-cases" class=anchor></span><h2 ><a href="#use-cases" class=anchor-link>*</a>Use cases</h2>
            
            <ul>
            <li><a href="/topics/whos-using-redis">Who is using Redis</a></li>
            </ul>
            
            <span id="books" class=anchor></span><h2 ><a href="#books" class=anchor-link>*</a>Books</h2>
            
            <p>The following is a list of books covering Redis that are already published. Books are ordered by release date (newer books first).</p>
            
            <ul>
            <li><a href="http://www.manning.com/carlson/">Redis in Action (Manning, 2013)</a> by <a href="http://twitter.com/dr_josiah">Josiah L. Carlson</a> (early access edition).</li>
            <li><a href="http://www.packtpub.com/redis-optimization-how-to/book">Instant Redis Optimization How-to (Packt, 2013)</a> by <a href="http://twitter.com/ArunChinnachamy">Arun Chinnachamy</a>.</li>
            <li><a href="http://www.packtpub.com/redis-persistence/book">Instant Redis Persistence (Packt, 2013)</a> by Matt Palmer.</li>
            <li><a href="http://openmymind.net/2012/1/23/The-Little-Redis-Book/">The Little Redis Book (Free Book, 2012)</a> by <a href="http://twitter.com/karlseguin">Karl Seguin</a> is a great <em>free</em> and concise book that will get you started with Redis.</li>
            <li><a href="http://shop.oreilly.com/product/0636920020127.do">Redis Cookbook (O&#39;Reilly Media, 2011)</a> by <a href="http://twitter.com/tmacedo">Tiago Macedo</a> and <a href="http://twitter.com/f">Fred Oliveira</a>.</li>
            </ul>
            
            <p>The following books have Redis related content but are not specifically about Redis:</p>
            
            <ul>
            <li><a href="http://pragprog.com/book/rwdata/seven-databases-in-seven-weeks">Seven databases in seven weeks (The Pragmatic Bookshelf, 2012)</a>.</li>
            <li><a href="http://shop.oreilly.com/product/0636920010203.do">Mining the Social Web (O&#39;Reilly Media, 2011)</a></li>
            <li><a href="http://www.wrox.com/WileyCDA/WroxTitle/Professional-NoSQL.productCd-047094224X.html">Professional NoSQL (Wrox, 2011)</a></li>
            </ul>
            
            <span id="credits" class=anchor></span><h2 ><a href="#credits" class=anchor-link>*</a>Credits</h2>
            
            <p>Redis is maintained and developed by <a href="http://twitter.com/antirez">Salvatore Sanfilippo</a>. In the past <a href="http://twitter.com/pnoordhuis">Pieter Noordhuis</a> and <a href="https://matt.sh">Matt Stancliff</a> provided a very significant amount of code and ideas to both the Redis core and client libraries.</p>
            
            <p>The full list of Redis contributors can be found in the <a href="https://github.com/antirez/redis/graphs/contributors">Redis contributors page at Github</a>. However there are other forms of contributions such as ideas, testing, and bug reporting. When possible this contributions are acknowledged in the commit messages. The <a href="http://groups.google.com/group/redis-db">mailing list archives</a> and the <a href="https://github.com/antirez/redis/issues">Github issues page</a> are good sources to find people active in the Redis community providing ideas and helping other users.</p>
            
            <span id="sponsors" class=anchor></span><h2 ><a href="#sponsors" class=anchor-link>*</a>Sponsors</h2>
            
            <p>The work <a href="http://antirez.com">Salvatore Sanfilippo</a> does in order to develop Redis is sponsored by <a href="http://redislabs.com">Redis Labs</a>. Other sponsors and past sponsors of the Redis project are listed in the <a href="/topics/sponsors">Sponsors page</a>.</p>
            
            <span id="license-trademark-and-logo" class=anchor></span><h2 ><a href="#license-trademark-and-logo" class=anchor-link>*</a>License, Trademark and Logo</h2>
            
            <ul>
            <li>Redis is released under the three clause BSD license. You can find <a href="/topics/license">additional information in our license page</a>.</li>
            <li>The Redis trademark and logos are owned by Salvatore Sanfilippo, please read the <a href="/topics/trademark">Redis trademark guidelines</a> for our policy about the use of the Redis trademarks and logo.</li>
            </ul>
          </article>
        </div>
        