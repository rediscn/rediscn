---
layout: topics
title: REDIS internals
permalink: topics/internals.html
disqusIdentifier: topics_internals
disqusUrl: http://redis.cn/topics/internals.html
---

# Redis内部机制

Redis源代码不是太大(在发布的2.2版本中只有20K行代码)并且我们正在努力让代码更简单、更易懂。不管怎样，我们有一些文档节选解释Redis的内部实现原理。

## Redis动态字符串 ##

Redis类型中的基本类型是字符串。

Redis是基于键-值存储的数据库。Redis中使用字符串作为它的键，同时字符串也是"值"所使用的最基本的数据类型。

列表，集合，有序集合和哈希表是其它更复杂的值类型，不过即使是这些复杂的类型也是使用字符串来实现的。

[Hacking Strings](/topics/internals-sds.html)文档列出了Redis字符串的实现细节。


## Redis虚拟内存


我们有一个文档解释 [virtual memory implementation details](/topics/internals-vm)，需要注意的是：这个文档对应的是2.0版本的虚拟机实现，与2.2版本是不同的。。。将会更好。

## Redis事件库（Redis event library）

阅读[Redis event library](/topics/internals-eventlib.html)去理解事件库是什么，为什么需要。

Redis事件库文档列出了常用的Redis[Redis event library](/topics/internals-rediseventlib.html)。
