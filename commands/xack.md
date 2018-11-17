---
layout: commands
title: xack 命令
permalink: commands/xack.html
disqusIdentifier: command_xack
disqusUrl: http://redis.cn/commands/xack.html
commandsType: streams
discuzTid: 13916
tranAuthor: wangqiang
---

`XACK`命令用于从流的消费者组的*待处理条目列表*（简称PEL）中删除一条或多条消息。
当一条消息交付到某个消费者时，它将被存储在PEL中等待处理，
这通常出现在作为调用`XREADGROUP`命令的副作用，或者一个消费者通过调用`XCLAIM`命令接管消息的时候。
待处理消息被交付到某些消费者，但是服务器尚不确定它是否至少被处理了一次。
因此对新调用`XREADGROUP`来获取消费者的消息历史记录（比如用0作为ID）将返回此类消息。
类似地，待处理的消息将由检查PEL的`XPENDING`命令列出。

一旦消费者*成功地*处理完一条消息，它应该调用`XACK`，这样这个消息就不会被再次处理，
且作为一个副作用，关于此消息的PEL条目也会被清除，从Redis服务器释放内存。

## 返回值

[integer-reply](/topics/protocol.html#integer-reply)：

该命令返回成功确认的消息数。
某些消息ID可能不再是PEL的一部分（例如因为它们已经被确认），
而且`XACK`不会把他们算到成功确认的数量中。

	redis> XACK mystream mygroup 1526569495631-0
	ERR Unknown or disabled command 'XACK'
	redis> 
