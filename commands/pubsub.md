---
layout: commands
title: pubsub 命令
permalink: commands/pubsub.html
disqusIdentifier: command_pubsub
disqusUrl: http://redis.cn/commands/pubsub.html
commandsType: pubsub
discuzTid: 1022
---

`PUBSUB` 是自省命令，能够检测PUB/SUB子系统的状态。它由分别详细描述的子命令组成。通用格式如下：

    PUBSUB <subcommand> ... args ...

# PUBSUB CHANNELS [pattern]

列出当前*active channels*.活跃是指信道含有一个或多个订阅者(不包括从模式接收订阅的客户端)
如果`pattern`未提供，所有的信道都被列出，否则只列出匹配上指定全局-类型模式的信道被列出.

## 返回值

[array-reply](/topics/protocol.html#array-reply): 活跃的信道列表，或者符合指定模式的信道

# `PUBSUB NUMSUB [channel-1 ... channel-N]`


列出指定信道的订阅者个数(不包括订阅模式的客户端订阅者)

## 返回值

[array-reply](/topics/protocol.html#array-reply): 信道的列表和每个列表中订阅者的个数. 格式为 信道,个数，信道，个数，... 简单的列表.


注意，不给定任何频道而直接调用这个命令也是可以的， 在这种情况下，命令只返回一个空列表.

# `PUBSUB NUMPAT`

返回订阅模式的数量(使用命令`PSUBSCRIBE`实现).注意， 这个命令返回的不是订阅模式的客户端的数量， 而是客户端订阅的所有模式的数量总和。

## 返回值

[integer-reply](/topics/protocol.html#integer-reply): 客户端订阅的所有模式的数量总和.