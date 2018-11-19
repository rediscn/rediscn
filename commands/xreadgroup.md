---
layout: commands
title: xreadgroup 命令
permalink: commands/xreadgroup.html
disqusIdentifier: command_xreadgroup
disqusUrl: http://redis.cn/commands/xreadgroup.html
commandsType: streams
discuzTid: 13925
tranAuthor: wangqiang
---

`XREADGROUP`命令是`XREAD`命令的特殊版本，支持消费者组。在阅读本页之前，你可能必须先理解`XREAD`命令才有意义。

此外，如果你是Stream新手，我们建议阅读我们的[Redis Streams简介](/topics/streams-intro)。
确保在介绍中理解消费者组的概念，以便遵循此命令的工作原理将更加简单。

## 快速了解消费者组

此命令与`XREAD`的区别是它支持消费者组。

如果没有消费者组，仅使用`XREAD`，所有客户端都将获得所有到达流的条目。相反，如果使用带有`XREADGROUP`的消费者组，则可以创建不同的客户端组来消费到达给定流的不同的部分。例如，如果流获得新的条目A，B和C，并且有两个消费者通过消费者组读取流，其中一个客户端将会得到例如，消息A和C，另外一个客户端得到消息B，等等，以此类推。

在消费者组中，给定的消费者（即从流中消费消息的客户端）必须使用唯一的*消费者名称*进行标识。名称只是一个字符串。

消费者组的保证之一是，给定的消费者只能看到发送给它的历史消息，因此每条消息只有一个所有者。然而，还有一个特殊的特性叫做*消息认领*，其允许其他消费者在某些消费者无法恢复时认领消息。为了实现这样的语义，消费者组要求消费者使用`XACK`命令显式确认已成功处理的消息。这是必要的，因为流将为每个消费者组跟踪哪个消费者正在处理什么消息。

这是如何理解您是否要使用消费者组：

1. 如果你有一个流和多个客户端，并且你希望所有的客户端都获取到完整的信息，那么你不需要使用消费者组。
2. 如果你有一个流和多个客户端，并且你希望在你的客户端上对流进行*分区*或*共享*，以便每个客户端都能获得一个到达流的消息的子集，那么你需要使用消费者组。

## XREAD和XREADGROUP之间的差异

从语法的角度来看，这两个命令几乎是相同的，但是`XREADGROUP`*需要*一个特殊和强制的选项：

    GROUP <group-name> <consumer-name>

组名只是关联到流的消费者组的名称。该组是使用`XGROUP`命令创建的。消费者名称是客户端用于在消费者组内标识自己的字符串。消费者会在第一次出现在消费者组内时被自动创建。不同的消费者应该选择不同的消费者名称。

当你使用`XREADGROUP`读取时，服务器将会*记住*某个给定的消息已经传递给你：消息会被存储在消费者组内的待处理条目列表（PEL）中，即已送达但尚未确认的消息ID列表。

客户端必须使用`XACK`确认消息处理，以便从待处理条目列表中删除待处理条目。可以使用`XPENDING`命令检查待处理条目列表。

使用`XREADGROUP`时在**STREAMS**选项中指定的ID可以是以下两种之一：

* 特殊ID`>`，意味着消费者希望只接收*从未发送给任何其他消费者*的消息。这意思是说，请给我新的消息。
* 任意其他的ID，即0或任意其他有效ID或不完整的ID（只有毫秒时间部分），将具有返回发送命令的消费者的待处理条目的效果。所以，基本上如果ID不是`>`，命令将让客户端访问它的待处理条目（已发送给它，但尚未确认的条目）。

就像`XREAD`，`XREADGROUP`命令也可以以阻塞的方式使用。在这方面没有区别。

## 当消息被传递给消费者时，会发生什么？

两件事：

1. 如果消息从未被发送给其他消费者，也即，如果我们正在谈论新消息，则创建待处理条目列表（PEL）。
2. 相反，如果该消息已经发送给该消费者，并且它只是再次重新获取相同的消息，那么*最后送达时间*会被更新为当前时间，并且*送达次数*会加1。你可以使用`XPENDING`命令访问这些消息属性。

## 用法示例

通常，你使用这样的命令来获取新消息并处理它们。在伪代码中：

```
WHILE true
    entries = XREADGROUP $GroupName $ConsumerName BLOCK 2000 COUNT 10 STREAMS mystream >
    if entries == nil
        puts "Timeout... try again"
        CONTINUE
    end

    FOREACH entries AS stream_entries
        FOREACH stream_entries as message
            process_message(message.id,message.fields)

            # ACK the message as processed
            XACK mystream $GroupName message.id
        END
    END
END
```

通过这种方式，例子中的消费者代码将会只获取新消息，处理它们，以及通过`XACK`确认它们。
但是以上案例的代码是不完整的，因为它没有处理崩溃后的恢复事宜。如果我们在处理消息的过程中崩溃了，
则我们的消息将继续保留在待处理条目列表中，因此我们可以通过给`XREADGROUP`初始ID为0并执行相同的循环来访问我们的消息历史。
一旦提供的ID为0并且回复是一组空的消息，我们就知道我们已经处理并确认完了所有的待处理消息：
我们可以开始使用`>`作为ID，以便获取新消息并重新加入正在处理新消息的消费者。

要查看命令实际回复的方式，请参阅`XREAD`命令页面。
