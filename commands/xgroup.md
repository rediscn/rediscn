---
layout: commands
title: xgroup 命令
permalink: commands/xgroup.html
disqusIdentifier: command_xgroup
disqusUrl: http://redis.cn/commands/xgroup.html
commandsType: streams
discuzTid: 13919
---

该命令用于管理流数据结构关联的消费者组。使用`XGROUP`你可以：

* 创建与流关联的新消费者组。
* 销毁一个消费者组。
* 从消费者组中移除指定的消费者。
* 将消费者组的*最后交付ID*设置为其他内容。

要创建一个新的消费者组，请使用以下格式：

    XGROUP CREATE mystream consumer-group-name $

最后一个参数是要考虑已传递的流中最后一项的ID。
在上面的例子中，我们使用了特殊的ID '$'（这表示：流中最后一项的ID）。
在这种情况下，从该消费者组获取数据的消费者只能看到到达流的新元素。

但如果你希望消费者组获取整个流的历史记录，使用0作为消费者组的开始ID：

    XGROUP CREATE mystream consumer-group-name 0

当然，可以使用任何其他有效的ID。如果指定的消费者组已经存在，则该命令将返回`-BUSYGROUP`错误。
否则将执行该操作并返回OK。你可以为给定的流关联无限多的消费者组，没有硬性限制。

可以使用以下形式完全销毁消费者：

    XGROUP DESTROY mystream some-consumer-group

即使存在活动的消费者和待处理消息，消费者组也将被销毁，因此请确保仅在真正需要时才调用此命令。

要仅从消费者组中移除给定的消费者，使用以下命令格式：

    XGROUP DELCONSUMER mystream consumergrouo myconsumer123

每当某个命令提到新的消费者名称时，就会自动创建消费者组中的消费者。
但有时候删除旧的消费者可能会有用，因为他们已经不再使用。
以上格式的命令返回消费者在被删除之前所拥有的待处理消息数量。

最后，可以使用`SETID`子命令设置要传递的下一条消息。
通常情况下，在消费者创建时设置下一个ID，作为`XGROUP CREATE`的最后一个参数。
但是使用这种形式，可以在以后修改下一个ID，而无需再次删除和创建使用者组。
例如，如果你希望消费者组中的消费者重新处理流中的所有消息，你可能希望将其下一个ID设置为0：

    XGROUP SETID mystream my-consumer-group 0

最后，如果您不记得语法，请使用HELP子命令：

    XGROUP HELP
