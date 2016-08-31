---
layout: topics
title: REDIS config -- Redis中文资料站
permalink: topics/config.html
disqusIdentifier: topics_config
disqusUrl: http://redis.cn/topics/config.html
discuzTid: 863
---

Redis配置
===

Redis可以在没有配置文件的情况下通过内置的配置来启动，但是这种启动方式只适用于开发和测试。

合理的配置Redis的方式是提供一个Redis配置文件，这个文件通常叫做 `redis.conf`。

redis.conf文件中包含了很多格式简单的指令如下：

    keyword argument1 argument2 ... argumentN
	关键字   参数1     参数2      ... 参数N

如下是一个配置指令的示例：

    slaveof 127.0.0.1 6380

如果参数中含有空格，那么可以用双引号括起来，如下：

    requirepass "hello world"

这些指令的配置，意义以及深入使用方法都能在每个Redis发布版本自带的的redis.conf文档中找到。

* 自描述文档 [redis.conf for Redis 2.8](https://raw.githubusercontent.com/antirez/redis/2.8/redis.conf)
* 自描述文档 [redis.conf for Redis 2.6](https://raw.githubusercontent.com/antirez/redis/2.6/redis.conf).
* 自描述文档 [redis.conf for Redis 2.4](https://raw.githubusercontent.com/antirez/redis/2.4/redis.conf).

通过命令行传参
---

自Redis2.6起就可以直接通过命令行传递Redis配置参数。这种方法可以用于测试。 以下是一个例子：这个例子配置一个新运行并以6380为端口的 Redis实例，使配置它为127.0.0.1:6379Redis实例的slave。

    ./redis-server --port 6380 --slaveof 127.0.0.1 6379

通过命令行传递的配置参数的格式和在redis.conf中设置的配置参数的格式完全一样， 唯一不同的是需要在关键字之前加上 前缀`--`。

需要注意的是通过命令行传递参数的过程会在内存中生成一个临时的配置文件(也许会直接追加在 命令指定的配置文件后面)，这些传递的参数也会转化为跟Redis配置文件一样的形式。

运行时配置更改
---

Redis允许在运行的过程中，在不重启服务器的情况下更改服务器配置，同时也支持 使用特殊的[CONFIG SET](/commands/config-set.html)和 [CONFIG GET](/commands/config-get.html)命令用编程方式查询并设置配置。

并非所有的配置指令都支持这种使用方式，但是大部分是支持的。更多相关的信息请查阅[CONFIG SET](/commands/config-set.html)和 [CONFIG GET](/commands/config-get.html)页面。

需要确保的是在通过[CONFIG SET](/commands/config-set.html)命令进行的设置的同时，也需在 redis.conf文件中进行了相应的更改。 未来Redis有计划提供一个[CONFIG REWRITE](/commands/config-rewrite.html)命令在不更改现有配置文件的同时， 根据当下的服务器配置对redis.conf文件进行重写。


配置Redis成为一个缓存
---

如果你想把Redis当做一个缓存来用，所有的key都有过期时间，那么你可以考虑 使用以下设置（假设最大内存使用量为2M）：

    maxmemory 2mb
    maxmemory-policy allkeys-lru

以上设置并不需要我们的应用使用EXPIRE(或相似的命令)命令去设置每个key的过期时间，因为 只要内存使用量到达2M，Redis就会使用类LRU算法自动删除某些key。

相比使用额外内存空间存储多个键的过期时间，使用缓存设置是一种更加有效利用内存的方式。而且相比每个键固定的 过期时间，使用LRU也是一种更加推荐的方式，因为这样能使应用的热数据(更频繁使用的键) 在内存中停留时间更久。

基本上这么配置下的Redis可以当成memcached使用。

当我们把Redis当成缓存来使用的时候，如果应用程序同时也需要把Redis当成存储系统来使用，那么强烈建议 使用两个Redis实例。一个是缓存，使用上述方法进行配置，另一个是存储，根据应用的持久化需求进行配置，并且 只存储那些不需要被缓存的数据。

*请注意*:用户需要详细阅读示例redis.conf文件来决定使用什么内存上限处理策略。
