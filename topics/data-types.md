---
layout: topics
title: REDIS data-types -- Redis中文资料站
permalink: topics/data-types.html
disqusIdentifier: topics_data-types
disqusUrl: http://redis.cn/topics/data-types.html
discuzTid: 881
---

数据类型（Data Types）
===

## **字符串（Strings）** ##


字符串是一种最基本的Redis值类型。Redis字符串是二进制安全的，这意味着一个Redis字符串能包含任意类型的数据，例如： 一张JPEG格式的图片或者一个序列化的Ruby对象。

一个字符串类型的值最多能存储512M字节的内容。

你可以用Redis字符串做许多有趣的事，例如你可以：

* 利用INCR命令簇（[INCR](/commands/incr.html), [DECR](/commands/decr.html), [INCRBY](/commands/incrby)）来把字符串当作原子计数器使用。
* 使用[APPEND](/commands/append.html)命令在字符串后添加内容。
* 将字符串作为[GETRANGE](/commands/getrange.html) 和 [SETRANGE](/commands/setrange.html)的随机访问向量。
* 在小空间里编码大量数据，或者使用 [GETBIT](/commands/getbit.html) 和 [SETBIT](/commands/setbit.html)创建一个Redis支持的Bloom过滤器。

查看所有可用的[字符串命令](/commands.html#string)获取更多信息, 或者进一步阅读 [Redis数据类型介绍](/topics/data-types-intro.html).


## **列表（Lists）** ##


Redis列表是简单的字符串列表，按照插入顺序排序。 你可以添加一个元素到列表的头部（左边）或者尾部（右边）。

[LPUSH](/commands/lpush.html) 命令插入一个新元素到列表头部，而[RPUSH](/commands/rpush.html)命令 插入一个新元素到列表的尾部。当 对一个空key执行其中某个命令时，将会创建一个新表。 类似的，如果一个操作要清空列表，那么key会从对应的key空间删除。这是个非常便利的语义， 因为如果使用一个不存在的key作为参数，所有的列表命令都会像在对一个空表操作一样。

一些列表操作及其结果：

    LPUSH mylist a   # now the list is "a"
    LPUSH mylist b   # now the list is "b","a"
    RPUSH mylist c   # now the list is "b","a","c" (RPUSH was used this time)

一个列表最多可以包含2<sup>32</sup>-1个元素（4294967295，每个表超过40亿个元素）。

从时间复杂度的角度来看，Redis列表主要的特性就是支持时间常数的 插入和靠近头尾部元素的删除，即使是需要插入上百万的条目。 访问列表两端的元素是非常快的，但如果你试着访问一个非常大 的列表的中间元素仍然是十分慢的，因为那是一个时间复杂度为 **O(N)** 的操作。

你可以用Redis列表做许多有趣的事，例如你可以：

* 在社交网络中建立一个时间线模型，使用[LPUSH](/commands/lpush.html)去添加新的元素到用户时间线中，使用[LRANGE](/commands/lrange.html)去检索一些最近插入的条目。
* 你可以同时使用[LPUSH](/commands/lpush.html)和[LTRIM](/commands/ltrim.html)去创建一个永远不会超过指定元素数目的列表并同时记住最后的N个元素。
* 列表可以用来当作消息传递的基元（primitive），例如，众所周知的用来创建后台任务的Resque Ruby库。
* 你可以使用列表做更多事，这个数据类型支持许多命令，包括像[BLPOP](/commands/blpop.html)这样的阻塞命令。请查看所有可用的列表操作命令获取更多的信息。

查看完整的 [列表（Lists）](/commands.html#list) 获取更多信息, 或者进一步阅读 [Redis数据类型介绍](/topics/data-types-intro.html).


## **集合（Sets）** ##


Redis集合是一个无序的字符串合集。你可以以**O(1)** 的时间复杂度（无论集合中有多少元素时间复杂度都为常量）完成 添加，删除以及测试元素是否存在的操作。

Redis集合有着不允许相同成员存在的优秀特性。向集合中多次添加同一元素，在集合中最终只会存在一个此元素。实际上这就意味着，在添加元素前，你并不需要事先进行检验此元素是否已经存在的操作。

一个Redis列表十分有趣的事是，它们支持一些服务端的命令从现有的集合出发去进行集合运算。 所以你可以在很短的时间内完成合并（union）,求交(intersection), 找出不同元素的操作。

一个集合最多可以包含2<sup>32</sup>-1个元素（4294967295，每个集合超过40亿个元素）。

你可以用Redis集合做很多有趣的事，例如你可以：

* 用集合跟踪一个独特的事。想要知道所有访问某个博客文章的独立IP？只要每次都用SADD来处理一个页面访问。那么你可以肯定重复的IP是不会插入的。
* Redis集合能很好的表示关系。你可以创建一个tagging系统，然后用集合来代表单个tag。接下来你可以用[SADD](/commands/sadd.html)命令把所有拥有tag的对象的所有ID添加进集合，这样来表示这个特定的tag。如果你想要同时有3个不同tag的所有对象的所有ID，那么你需要使用[SINTER](/commands/sinter.html).
* 使用[SPOP](/commands/spop.html)或者[SRANDMEMBER](/commands/srandmember.html)命令随机地获取元素。
* 
查看完整的 [集合（Sets）](/commands.html#set) 获取更多信息, 或者进一步阅读 [Redis数据类型介绍](/topics/data-types-intro.html).

## **哈希（Hashes）** ##

Redis Hashes是字符串字段和字符串值之间的映射，所以它们是完美的表示对象（eg:一个有名，姓，年龄等属性的用户）的数据类型。

    @cli
    HMSET user:1000 username antirez password P1pp0 age 34
    HGETALL user:1000
    HSET user:1000 password 12345
    HGETALL user:1000

一个拥有少量（100个左右）字段的hash需要 很少的空间来存储，所有你可以在一个小型的 Redis实例中存储上百万的对象。

尽管Hashes主要用来表示对象，但它们也能够存储许多元素，所以你也可以用Hashes来完成许多其他的任务。

一个hash最多可以包含2<sup>32</sup>-1 个key-value键值对（超过40亿）。

查看完整的 [哈希（Hashes）](/commands.html#hash) 获取更多信息, 或者进一步阅读 [Redis数据类型介绍](/topics/data-types-intro.html).


## **有序集合（Sorted sets）** ##

Redis有序集合和Redis集合类似，是不包含 相同字符串的合集。它们的差别是，每个有序集合 的成员都关联着一个评分，这个评分用于把有序集 合中的成员按最低分到最高分排列。

使用有序集合，你可以非常快地（**O(log(N))**）完成添加，删除和更新元素的操作。 因为元素是在插入时就排好序的，所以很快地通过评分(score)或者 位次(position)获得一个范围的元素。 访问有序集合的中间元素同样也是非常快的，因此你可以使用有序集合作为一个没用重复成员的智能列表。 在这个列表中， 你可以轻易地访问任何你需要的东西: 有序的元素，快速的存在性测试，快速访问集合中间元素！

简而言之，使用有序集合你可以很好地完成 很多在其他数据库中难以实现的任务。

使用有序集合你可以：

* 在一个巨型在线游戏中建立一个排行榜，每当有新的记录产生时，使用[ZADD](/commands/zadd.html) 来更新它。你可以用ZRANGE轻松地获取排名靠前的用户， 你也可以提供一个用户名，然后用[ZRANK](/commands/zrank.html)获取他在排行榜中的名次。 同时使用[ZRANK](/commands/zrank.html)和[ZRANGE](/commands/zrange.html)你可以获得与指定用户有相同分数的用户名单。 所有这些操作都非常迅速。
* 有序集合通常用来索引存储在Redis中的数据。 例如：如果你有很多的hash来表示用户，那么你可以使用一个有序集合，这个集合的年龄字段用来当作评分，用户ID当作值。用[ZRANGEBYSCORE](/commands/zrangebyscore.html)可以简单快速地检索到给定年龄段的所有用户。
* 有序集合或许是最高级的Redis数据类型，所以花些时间查看完整的[有序集合（Sorted sets）](/commands.html#sorted_set)命令列表去探索你能用Redis干些什么吧！

## **Bitmaps 和 HyperLogLogs** ##


Redis 同样支持 Bitmaps 和 HyperLogLogs 数据类型，实际上是基于字符串的基本类型的数据类型，但有自己的语义。

查看详细[Redis数据类型介绍](/topics/data-types-intro.html).