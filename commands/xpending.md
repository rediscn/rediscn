---
layout: commands
title: xpending 命令
permalink: commands/xpending.html
disqusIdentifier: command_xpending
disqusUrl: http://redis.cn/commands/xpending.html
commandsType: streams
discuzTid: 13922
tranAuthor: wangqiang
---

通过消费者组从流中获取数据，而不是确认这些数据，具有创建*待处理条目*的效果。这在`XREADGROUP`命令中已有详尽的说明，在我们的[Redis Streams介绍](/topics/streams-intro.html)中更好。`XACK`命令会立即从待处理条目列表（PEL）中移除待处理条目，因为一旦消息被成功处理，消费者组就不再需要跟踪它并记住消息的当前所有者。

`XPENDING`命令是检查待处理消息列表的接口，因此它是一个非常重要的命令，用于观察和了解消费者组正在发生的事情：哪些客户端是活跃的，哪些消息在等待消费，或者查看是否有空闲的消息。此外，该命令与`XCLAIM`一起使用，用于实现长时间故障的消费者的恢复，因此不处理某些消息：不同的消费者可以认领该消息并继续处理。这在[Redis Streams介绍](/topics/streams-intro.html)和`XCLAIM`命令页面中有更好的解释，这里不再介绍。

## XPENDING命令格式总结

当只使用键名和消费者组名调用`XPENDING`时，其只输出有关给定消费组的待处理消息的概要。在以下例子中，我们创建一个使用过的消费者组，并通过使用`XREADGROUP`从组中读取来立即创建待处理消息。

```
> XGROUP CREATE mystream group55 0-0
OK

> XREADGROUP GROUP group55 consumer-123 COUNT 1 STREAMS mystream >
1) 1) "mystream"
   2) 1) 1) 1526984818136-0
         2) 1) "duration"
            2) "1532"
            3) "event-id"
            4) "5"
            5) "user-id"
            6) "7782813"
```

我们希望消费者组`group55`的待处理条目列表立即拥有一条消息：消费者`consumer-123`获取了一条消息，且没有确认消息。简单的`XPENDING`形式会给我们提供以下信息：

```
> XPENDING mystream group55
1) (integer) 1
2) 1526984818136-0
3) 1526984818136-0
4) 1) 1) "consumer-123"
      2) "1"
```

在这种形式中，此命令输出该消费者组的待处理消息的数量（即1），然后是待处理消息的最小和最大ID，然后列出消费者组中每一个至少一条待处理消息的消费者，以及他的待处理消息数量。

这是一个很好的概述，但有时候我们对细节感兴趣。为了查看具有更多相关信息的所有待处理消息，我们还需要传递一系列ID，与我们使用`XRANGE`时类似，以及一个非可选的*count*参数，限制每一次调用返回的消息数量：

```
> XPENDING mystream group55 - + 10
1) 1) 1526984818136-0
   2) "consumer-123"
   3) (integer) 196415
   4) (integer) 1
```

在扩展的形式中，我们不再看到概要信息，而是在待处理消息列表中有每一条消息的详细信息。对于每条消息，返回四个属性：

1. 消息的ID。
2. 获取并仍然要确认消息的消费者名称，我们称之为消息的当前*所有者*。
3. 自上次将此消息传递给该消费者以来，经过的毫秒数。
4. 该消息被传递的次数。

交付计数器，即数组中的第四个元素，当其他消费者*使用`XCLAIM`声明*消息时，或当通过`XREADGROUP`再次传递消息时，当访问消费者组中的消费者历史时（更多信息请参阅`XREADGROUP`页面）递增。

最后，还可以向该命令传递一个额外的参数，以便查看具有特定所有者的消息：

```
> XPENDING mystream group55 - + 10 consumer-123
```

但在上面的例子中，输出将是相同的，因为我们只有一个消费者有待处理消息。然而，我们需要记住重要的一点是，即使来自许多消费者的许多待处理消息，由特定消费者过滤的这种操作效率也不高：我们在全局和每个消费者都有待处理条目数据结构，所以我们可以非常高效地显示单个消费者的待处理消息。


## 返回值

[array-reply](/topics/protocol.html#array-reply)：

该命令以不同的格式返回数据，具体取决于它的调用方式，如本文前面所述。但是，返回值始终是一组项目。
