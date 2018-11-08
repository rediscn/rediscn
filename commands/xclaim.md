---
layout: commands
title: xclaim 命令
permalink: commands/xclaim.html
disqusIdentifier: command_xclaim
disqusUrl: http://redis.cn/commands/xclaim.html
commandsType: streams
discuzTid: 13917
---

In the context of a stream consumer group, this command changes the ownership
of a pending message, so that the new owner is the consumer specified as the
command argument. Normally this is what happens:
在流的消费者组上下文中，此命令改变待处理消息的所有权，
因此新的所有者是在命令参数中指定的消费者。通常是这样的：

1. There is a stream with an associated consumer group.
1. 假设有一个具有关联消费者组的流。
2. Some consumer A reads a message via `XREADGROUP` from a stream, in the context of that consumer group.
2. 某个消费者A在消费者组的上下文中通过`XREADGROUP`从流中读取一条消息。
3. As a side effect a pending message entry is created in the pending entries list (PEL) of the consumer group: it means the message was delivered to a given consumer, but it was not yet acknowledged via `XACK`.
3. 作为读取消息的副作用，消费者组的待处理条目列表（PEL）中创建了一个待处理消息条目：
这意味着这条消息已传递给给定的消费者，但是尚未通过`XACK`确认。
4. Then suddenly that consumer fails forever.
4. 突然这个消费者出现故障，且永远无法恢复。
5. Other consumers may inspect the list of pending messages, that are stale for quite some time, using the `XPENDING` command. In order to continue processing such messages, they use `XCLAIM` to acquire the ownership of the message and continue.
5. 其他消费者可以使用`XPENDING`检查已经过时很长时间的待处理消息列表，
为了继续处理这些消息，他们使用`XCLAIM`来获得消息的所有权，并继续处理。

This dynamic is clearly explained in the [Stream intro documentation](/topics/streams-intro).
[Stream介绍文档](/topics/streams-intro)中清楚的解释了这种动态。

Note that the message is claimed only if its idle time is greater the minimum idle time we specify when calling `XCLAIM`. Because as a side effect `XCLAIM` will also reset the idle time (since this is a new attempt at processing the message), two consumers trying to claim a message at the same time will never both succeed: only one will successfully claim the message. This avoids that we process a given message multiple times in a trivial way (yet multiple processing is possible and unavoidable in the general case).
请注意，消息只有在其空闲时间大于我们通过`XCLAIM`指定的空闲时间的时才会被认领。
因为作为一个副作用，`XCLAIM`也会重置消息的空闲时间（因为这是处理消息的一次新尝试），
两个试图同时申领消息的消费者将永远不会成功：只有一个消费者能成功申领消息。
这避免了我们用微不足道的方式多次处理给定的消息（虽然一般情况下无法完全避免多次处理）。

Moreover, as a side effect, `XCLAIM` will increment the count of attempted
deliveries of the message. In this way messages that cannot be processed for
some reason, for instance because the consumers crash attempting to process
them, will start to have a larger counter and can be detected inside the system.

## Command options

The command has multiple options, however most are mainly for internal use in
order to transfer the effects of `XCLAIM` or other commands to the AOF file
and to propagate the same effects to the slaves, and are unlikely to be
useful to normal users:

1. `IDLE <ms>`: Set the idle time (last time it was delivered) of the message. If IDLE is not specified, an IDLE of 0 is assumed, that is, the time count is reset because the message has now a new owner trying to process it.
2. `TIME <ms-unix-time>`: This is the same as IDLE but instead of a relative amount of milliseconds, it sets the idle time to a specific Unix time (in milliseconds). This is useful in order to rewrite the AOF file generating `XCLAIM` commands.
3. `RETRYCOUNT <count>`: Set the retry counter to the specified value. This counter is incremented every time a message is delivered again. Normally `XCLAIM` does not alter this counter, which is just served to clients when the XPENDING command is called: this way clients can detect anomalies, like messages that are never processed for some reason after a big number of delivery attempts.
4. `FORCE`: Creates the pending message entry in the PEL even if certain specified IDs are not already in the PEL assigned to a different client. However the message must be exist in the stream, otherwise the IDs of non existing messages are ignored.
5. `JUSTID`: Return just an array of IDs of messages successfully claimed, without returning the actual message.

## 返回值

[array-reply](/topics/protocol.html#array-reply)：


The command returns all the messages successfully claimed, in the same format
as `XRANGE`. However if the `JUSTID` option was specified, only the message
IDs are reported, without including the actual message.

Example:

```
> XCLAIM mystream mygroup Alice 3600000 1526569498055-0
1) 1) 1526569498055-0
   2) 1) "message"
      2) "orange"
```

In the above example we claim the message with ID `1526569498055-0`, only if the message is idle for at least one hour without the original consumer or some other consumer making progresses (acknowledging or claiming it), and assigns the ownership to the consumer `Alice`.
