---
layout: topics
title: streams 介绍
permalink: topics/streams-intro.html
disqusIdentifier: streams-intro
disqusUrl: http://redis.cn/topics/streams-intro.html
discuzTid: 13930
---

# Redis Streams 介绍

Stream是Redis 5.0版本引入的一个新的数据类型，它以更抽象的方式模拟*日志数据结构*，但日志仍然是完整的：就像一个日志文件，通常实现为以只附加模式打开的文件，Redis流主要是一个仅附加数据结构。至少从概念上来讲，因为Redis流是一种在内存表示的抽象数据类型，他们实现了更加强大的操作，以此来克服日志文件本身的限制。

Stream是Redis的数据类型中最复杂的，尽管数据类型本身非常简单，它实现了额外的非强制性的特性：提供了一组允许消费者以阻塞的方式等待生产者向Stream中发送的新消息，此外还有一个名为**Consumer Groups**的概念。

Consumer Groups最早是由名为Kafka（TM）的流行消息系统引入的。Redis用完全不同的术语重新实现了一个相似的概念，但目标是相同的：允许一组客户端相互配合来消费同一个Stream的不同部分的消息。

## Streams 基础知识

为了理解Redis Stream是什么以及如何使用他们，我们将忽略所有的高级特性，从用于操纵和访问它的命令方面来专注于数据结构本身。这基本上是大多数其他Redis数据类型共有的部分，比如Lists，Sets，Sorted Sets等等。然而，需要注意的是Lists还有一个可选的更加复杂的阻塞API，由**BLPOP**等相似的命令导出。所以从这方面来说，Streams跟Lists并没有太大的不同，只是附加的API更复杂、更强大。

因为Streams是只附加数据结构，基本的写命令，叫**XADD**，向指定的Stream追加一个新的条目。一个Stream条目不是简单的字符串，而是由一个或多个键值对组成的。这样一来，Stream的每一个条目就已经是结构化的，就像以CSV格式写的只附加文件一样，每一行由多个逗号割开的字段组成。

```
> XADD mystream * sensor-id 1234 temperature 19.8
1518951480106-0
```

上面的例子中，调用了**XADD**命令往名为`mystream`的Stream中添加了一个条目`sensor-id: 123, temperature: 19.8`，使用了自动生成的条目ID，也就是命令返回的值，具体在这里是`1518951480106-0`。命令的第一个参数是key的名称`mystream`，第二个参数是用于唯一确认Stream中每个条目的条目ID。然而，在这个例子中，我们传入的参数值是`*`，因为我们希望由Redis服务器为我们自动生成一个新的ID。每一个新的ID都会单调增长，简单来讲就是，每次新添加的条目都会拥有一个比其它所有条目更大的ID。由服务器自动生成ID几乎总是我们所想要的，需要显式指定ID的情况非常少见。我们稍后会更深入地讨论这个问题。实际上每个Stream条目拥有一个ID与日志文件具有另一种相似性，即使用行号或者文件中的字节偏移量来识别一个给定的条目。回到我们的**XADD**例子中，跟在key和ID后面的参数是组成我们的Stream条目的键值对。

使用**XLEN**命令来获取一个Stream的条目数量：

```
> XLEN mystream
(integer) 1
```

### 条目 ID

条目ID由**XADD**命令返回，并且可以唯一的标识给定Stream中的每一个条目，由两部分组成：

```
<millisecondsTime>-<sequenceNumber>
```

毫秒时间部分实际是生成Stream ID的Redis节点的服务器本地时间，但是如果当前毫秒时间戳比以前的条目时间戳小的话，那么会使用以前的条目时间，所以即便是服务器时钟向后跳，单调增长ID的特性仍然会保持不变。序列号用于以相同毫秒创建的条目。由于序列号是64位的，所以实际上对于在同一毫秒内生成的条目数量是没有限制的。

这样的ID格式也许最初看起来有点奇怪，也许温柔的读者会好奇为什么时间会是ID的一部分。其实是因为Redis Streams支持按ID进行范围查询。由于ID与生成条目的时间相关，因此可以很容易地按时间范围进行查询。我们在后面讲到**XRANGE**命令时，很快就能明白这一点。

如果由于某些原因，用户需要与时间无关但实际上与另一个外部系统ID关联的增量ID，就像前面所说的，**XADD**命令可以带上一个显式的ID，而不是使用通配符`*`来自动生成，如下所示：

```
> XADD somestream 0-1 field value
0-1
> XADD somestream 0-2 foo bar
0-2
```

请注意，在这种情况下，最小ID为0-1，并且命令不接受等于或小于前一个ID的ID：

```
> XADD somestream 0-1 foo bar
(error) ERR The ID specified in XADD is equal or smaller than the target stream top item
```

## 从Streams中获取数据

现在我们终于能够通过**XADD**命令向我们的Stream中追加条目了。然而，虽然往Stream中追加数据非常明显，但是为了提取数据而查询Stream的方式并不是那么明显，如果我们继续使用日志文件进行类比，一种显而易见的方式是模拟我们通常使用Unix命令`tail -f`来做的事情，也就是，我们可以开始监听以获取追加到Stream的新消息。需要注意的是，不像Redis的阻塞列表，一个给定的元素只能到达某一个使用了*冒泡风格*的阻塞客户端，比如使用类似**BLPOP**的命令，在Streams中我们希望看到的是多个消费者都能看到追加到Stream中的新消息，就像许多的`tail -f`进程能同时看到追加到日志文件的内容一样。用传统术语来讲就是我们希望Streams可以*扇形分发*消息到多个客户端。

然而，这只是其中一种可能的访问模式。我们还可以使用一种完全不同的方式来看待一个Stream：不是作为一个消息传递系统，而是作为一个*时间序列存储*。在这种情况下，也许使附加新消息也非常有用，但是另一种自然查询模式是通过时间范围来获取消息，或者使用一个游标来增量遍历所有的历史消息。这绝对是另一种有用的访问模式。

最后，如果我们从消费者的角度来观察一个Stream，我们也许想要以另外一种方式来访问它，那就是，作为一个可以分区到多个处理此类消息的多个消费者的消息流，以便消费者群体只能看到到达单个流的消息的子集。

Redis Streams通过不同的命令支持所有上面提到的三种访问模式。接下来的部分将展示所有这些模式，从最简单和更直接的使用：范围查询开始。

### 按范围查询: XRANGE 和 XREVRANGE

要根据范围查询Stream，我们只需要提供两个ID，即*start* 和 *end*。返回的区间数据将会包括ID是start和end的元素，因此区间是完全包含的。两个特殊的ID`-` 和 `+`分别表示可能的最小ID和最大ID。

```
> XRANGE mystream - +
1) 1) 1518951480106-0
   2) 1) "sensor-id"
      2) "1234"
      3) "temperature"
      4) "19.8"
2) 1) 1518951482479-0
   2) 1) "sensor-id"
      2) "9999"
      3) "temperature"
      4) "18.2"
```

返回的每个条目都是有两个元素的数组：ID和键值对列表。我们已经说过条目ID与时间有关系，因为在字符`-`左边的部分是创建Stream条目的本地节点上的Unix毫秒时间，即条目创建的那一刻（请注意：Streams的复制使用的是完全详尽的**XADD**命令，因此从节点将具有与主节点相同的ID）。这意味着我可以使用**XRANGE**查询一个时间范围。然而为了做到这一点，我可能想要省略ID的序列号部分：如果省略，区间范围的开始序列号将默认为0，结束部分的序列号默认是有效的最大序列号。这样一来，仅使用两个Unix毫秒时间去查询，我们就可以得到在那段时间内产生的所有条目（包含开始和结束）。例如，我可能想要查询两毫秒时间，可以这样使用：

```
> XRANGE mystream 1518951480106 1518951480107
1) 1) 1518951480106-0
   2) 1) "sensor-id"
      2) "1234"
      3) "temperature"
      4) "19.8"
```

我在这个范围内只有一个条目，然而在实际数据集中，我可以查询数小时的范围，或者两毫秒之间包含了许多的项目，返回的结果集很大。因此，**XRANGE**命令支持在最后放一个可选的**COUNT**选项。通过指定一个count，我可以只获取前面*N*个项目。如果我想要更多，我可以拿返回的最后一个ID，在序列号部分加1，然后再次查询。我们在下面的例子中看到这一点。我们开始使用**XADD**添加10个项目（我这里不具体展示，假设流`mystream`已经填充了10个项目）。要开始我的迭代，每个命令只获取2个项目，我从全范围开始，但count是2。

```
> XRANGE mystream - + COUNT 2
1) 1) 1519073278252-0
   2) 1) "foo"
      2) "value_1"
2) 1) 1519073279157-0
   2) 1) "foo"
      2) "value_2"
```

为了继续下两个项目的迭代，我必须选择返回的最后一个ID，即`1519073279157-0`，并且在ID序列号部分加1。请注意，序列号是64位的，因此无需检查溢出。在这个例子中，我们得到的结果ID是`1519073279157-1`，现在可以用作下一次**XRANGE**调用的新的*start*参数：

```
> XRANGE mystream 1519073279157-1 + COUNT 2
1) 1) 1519073280281-0
   2) 1) "foo"
      2) "value_3"
2) 1) 1519073281432-0
   2) 1) "foo"
      2) "value_4"
```

依此类推。由于**XRANGE**的查找复杂度是*O(log(N))*，因此*O(M)*返回M个元素，这个命令在count较小时，具有对数时间复杂度，这意味着每一步迭代速度都很快。所以**XRANGE**也是事实上的*流迭代器*并且不需要**XSCAN**命令。

**XREVRANGE**命令与**XRANGE**相同，但是以相反的顺序返回元素，因此**XREVRANGE**的实际用途是检查一个Stream中的最后一项是什么：

```
> XREVRANGE mystream + - COUNT 1
1) 1) 1519073287312-0
   2) 1) "foo"
      2) "value_10"
```

请注意：**XREVRANGE**命令以相反的顺序获取*start* 和 *stop*参数。

## 使用XREAD监听新项目

当我们不想按照Stream中的某个范围访问项目时，我们通常想要的是*订阅*到达Stream的新项目。这个概念可能与Redis中你订阅频道的Pub/Sub或者Redis的阻塞列表有关，在这里等待某一个key去获取新的元素，但是这跟你消费Stream有着根本的不同：

1. 一个Stream可以拥有多个客户端（消费者）在等待数据。默认情况下，对于每一个新项目，都会被分发到等待给定Stream的数据的*每一个消费者*。这个行为与阻塞列表不同，每个消费者都会获取到不同的元素。但是，*扇形分发*到多个消费者的能力与Pub/Sub相似。
2. 虽然在Pub/Sub中的消息是*fire and forget*并且从不存储，以及使用阻塞列表时，当一个客户端收到消息时，它会从列表中*弹出*（有效删除），Stream从跟本上以一种不同的方式工作。所有的消息都被无限期地附加到Stream中（除非用户明确地要求删除这些条目）：不同的消费者通过记住收到的最后一条消息的ID，从其角度知道什么是新消息。
3. Streams Consumer Groups提供了一种Pub/Sub或者阻塞列表都不能实现的控制级别，同一个Stream不同的群组，显式地确认已经处理的项目，检查待处理的项目的能力，申明未处理的消息，以及每个消费者拥有连贯历史可见性，单个客户端只能查看自己过去的消息历史记录。

提供监听到达Stream的新消息的能力的命令称为**XREAD**。比**XRANGE**要更复杂一点，所以我们将从简单的形式开始，稍后将提供整个命令布局。

```
> XREAD COUNT 2 STREAMS mystream 0
1) 1) "mystream"
   2) 1) 1) 1519073278252-0
         2) 1) "foo"
            2) "value_1"
      2) 1) 1519073279157-0
         2) 1) "foo"
            2) "value_2"
```

以上是**XREAD**的非阻塞形式。注意**COUNT**选项并不是必需的，实际上这个命令唯一强制的选项是**STREAMS**，指定了一组key以及调用者已经看到的每个Stream相应的最大ID，以便该命令仅向客户端提供ID大于我们指定ID的消息。

在上面的命令中，我们写了`STREAMS mystream 0`，所以我们想要流 `mystream`中所有ID大于`0-0`的消息。正如你在上面的例子中所看到的，命令返回了键名，因为实际上可以通过传入多个key来同时从不同的Stream中读取数据。我可以写一下，例如：`STREAMS mystream otherstream 0 0`。注意在**STREAMS**选项后面，我们需要提供键名称，以及之后的ID。因此，**STREAMS**选项必须始终是最后一个。

除了**XREAD**可以同时访问多个Stream这一事实，以及我们能够指定我们拥有的最后一个ID来获取之后的新消息，在个简单的形式中，这个命令并没有做什么跟**XRANGE**有太大区别的事情。然而，有趣的部分是我们可以通过指定**BLOCK**参数，轻松地将**XREAD** 变成一个 *阻塞命令*：

```
> XREAD BLOCK 0 STREAMS mystream $
```

请注意，在上面的例子中，除了移除**COUNT**以外，我指定了新的**BLOCK**选项，超时时间为0毫秒（意味着永不超时）。此外，我并没有给流 `mystream`传入一个常规的ID，而是传入了一个特殊的ID`$`。这个特殊的ID意思是**XREAD**应该使用流 `mystream`已经存储的最大ID作为最后一个ID。以便我们仅接收从我们开始监听时间以后的*新*消息。这在某种程度上相似于Unix命令`tail -f`。

请注意当使用**BLOCK**选项时，我们不必使用特殊ID`$`。我们可以使用任意有效的ID。如果命令能够立即处理我们的请求而不会阻塞，它将执行此操作，否则它将阻止。通常如果我们想要从新的条目开始消费Stream，我们以`$`开始，接着继续使用接收到的最后一条消息的ID来发起下一次请求，依此类推。

**XREAD**的阻塞形式同样可以监听多个Stream，只需要指定多个键名即可。如果请求可以同步提供，因为至少有一个流的元素大于我们指定的相应ID，则返回结果。否则，该命令将阻塞并将返回获取新数据的第一个流的项目（根据提供的ID）。

跟阻塞列表的操作类似，从等待数据的客户端角度来看，阻塞流读取是*公正*的，由于语义是FIFO样式。阻塞给定Stream的第一个客户端是第一个在新项目可用时将被解除阻塞的客户端。

**XREAD**命令没有除了**COUNT** 和 **BLOCK**以外的其他选项，因此它是一个非常基本的命令，具有特定目的来攻击消费者一个或多个流。使用消费者组API可以用更强大的功能来消费Stream，但是通过消费者组读取是通过另外一个不同的命令来实现的，称为**XREADGROUP**。本指南的下一节将介绍。

## Consumer groups

当手头的任务是从不同的客户端消费同一个Stream，那么**XREAD**已经提供了一种方式可以*扇形分发*到N个客户端，还可以使用从节点来提供更多的读取可伸缩性。然而，在某些问题中，我们想要做的不是向许多客户端提供相同的消息流，而是从同一流向许多客户端提供*不同的消息子集*。这很有用的一个明显的例子是处理消息的速度很慢：能够让N个不同的客户端接收流的不同部分，通过将不同的消息路由到准备做更多工作的不同客户端来扩展消息处理工作。

实际上，假如我们想象有三个消费者C1，C2，C3，以及一个包含了消息1, 2, 3, 4, 5, 6, 7的Stream，我们想要按如下图表的方式处理消息：

```
1 -> C1
2 -> C2
3 -> C3
4 -> C1
5 -> C2
6 -> C3
7 -> C1
```

为了获得这个效果，Redis使用了一个名为*消费者组*的概念。非常重要的一点是，从实现的角度来看，Redis的消费者组与Kafka (TM) 消费者组没有任何关系，它们只是从实施的概念上来看比较相似，所以我决定不改变最初普及这种想法的软件产品已有的术语。

消费者群体就像一个*伪消费者*，从流中获取数据，实际上为多个消费者提供服务，提供某些保证：

1. 每条消息都提供给不同的消费者，因此不可能将相同的消息传递给多个消费者。
2. 消费者在消费者组中通过名称来识别，该名称是实施消费者的客户必须选择的区分大小写的字符串。这意味着即便断开连接过后，消费者组仍然保留了所有的状态，因为客户端会重新申请成为相同的消费者。
然而，这也意味着由客户端提供唯一的标识符。
3. 每一个消费者组都有一个*第一个ID永远不会被消费*的概念，这样一来，当消费者请求新消息时，它能提供以前从未传递过的消息。
4. 消费消息需要使用特定的命令进行显式确认，表示：这条消息已经被正确处理了，所以可以从消费者组中逐出。
5. 消费者组跟踪所有当前所有待处理的消息，也就是，消息被传递到消费者组的一些消费者，但是还没有被确认为已处理。由于这个特性，当访问一个Stream的历史消息的时候，每个消费者*将只能看到传递给它的消息*。

在某种程度上，消费者群体可以被想象为关于流的一些*状态*：

```
| consumer_group_name: mygroup           |
| consumer_group_stream: somekey         |
| last_delivered_id: 1292309234234-92    |
|                                        |
| consumers:                             |
|    "consumer-1" with pending messages  |
|       1292309234234-4                  |
|       1292309234232-8                  |
|    "consumer-42" with pending messages |
|       ... (and so forth)               |
```

如果你从这个视角来看，很容易理解一个消费者组能做什么，如何做到向给消费者提供他们的历史待处理消息，以及当消费者请求新消息的时候，是如何做到只发送ID大于`last_delivered_id`的消息的。同时，如果你把消费者组看成Redis Stream的辅助数据结构，很明显单个Stream可以拥有多个消费者组，每个消费者组都有一组消费者。实际上，同一个Stream甚至可以通过**XREAD**让客户端在没有消费者群体的情况下读取，同时有客户端通过**XREADGROUP**在不同的消费者组中读取。

现在是时候放大来查看基本的消费者组命令了，具体如下：

* **XGROUP** 用于创建，摧毁或者管理消费者组。
* **XREADGROUP** 用于通过消费者组从一个Stream中读取。
* **XACK** 是允许消费者将待处理消息标记为已正确处理的命令。

## 创建一个消费者组

假设我已经存在类型流的 `mystream`，为了创建消费者组，我只需要做：

```
> XGROUP CREATE mystream mygroup $
OK
```

请注意：*目前还不能为不存在的流创建消费者组，但有可能在不久的将来我们会给**XGROUP**命令增加一个选项，以便在这种场景下可以创建一个空的Stream。*

如你所看到的上面这个命令，当创建一个消费者组的时候，我们必须指定一个ID，在这个例子中ID是`$`。这是必要的，因为消费者组在其他状态中必须知道在第一个消费者连接时接下来要服务的消息，即消费者组创建完成时的*最后消息ID*是什么？如果我们就像上面例子一样，提供一个`$`，那么只有从现在开始到达Stream的新消息才会被传递到消费者组中的消费者。如果我们指定的消息ID是`0`，那么消费者组将会开始消费这个Stream中的*所有*历史消息。当然，你也可以指定任意其他有效的ID。你所知道的是，消费者组将开始传递ID大于你所指定的ID的消息。因为`$`表示Stream中当前最大ID的意思，指定`$`会有只消费新消息的效果。

现在消费者组创建好了，我们可以使用**XREADGROUP**命令立即开始尝试通过消费者组读取消息。我们会从消费者那里读到，假设指定消费者分别是Alice和Bob，来看看系统会怎样返回不同消息给Alice和Bob。

**XREADGROUP**和**XREAD**非常相似，并且提供了相同的**BLOCK**选项，除此以外还是一个同步命令。但是有一个*强制的*选项必须始终指定，那就是**GROUP**，并且有两个参数：消费者组的名字，以及尝试读取的消费者的名字。选项**COUNT**仍然是支持的，并且与**XREAD**命令中的用法相同。

在开始从Stream中读取之前，让我们往里面放一些消息：

```
> XADD mystream * message apple
1526569495631-0
> XADD mystream * message orange
1526569498055-0
> XADD mystream * message strawberry
1526569506935-0
> XADD mystream * message apricot
1526569535168-0
> XADD mystream * message banana
1526569544280-0
```

请注意：*在这里消息是字段名称，水果是关联的值，记住Stream中的每一项都是小字典。*

现在是时候尝试使用消费者组读取了：

```
> XREADGROUP GROUP mygroup Alice COUNT 1 STREAMS mystream >
1) 1) "mystream"
   2) 1) 1) 1526569495631-0
         2) 1) "message"
            2) "apple"
```

**XREADGROUP**的响应内容就像**XREAD**一样。但是请注意上面提供的`GROUP <group-name> <consumer-name>`，这表示我想要使用消费者组`mygroup`从Stream中读取，我是消费者`Alice`。每次消费者使用消费者组中执行操作时，都必须要指定可以这个消费者组中唯一标识它的名字。

在以上命令行中还有另外一个非常重要的细节，在强制选项**STREAMS**之后，键`mystream`请求的ID是特殊的ID `>`。这个特殊的ID只在消费者组的上下文中有效，其意思是：**消息到目前为止从未传递给其他消费者**。

这几乎总是你想要的，但是也可以指定一个真实的ID，比如`0`或者任何其他有效的ID，在这个例子中，我们请求**XREADGROUP**只提供给我们**历史待处理的消息**，在这种情况下，将永远不会在组中看到新消息。所以基本上**XREADGROUP**可以根据我们提供的ID有以下行为：

如果ID是特殊ID`>`，那么命令将会返回到目前为止从未传递给其他消费者的新消息，这有一个副作用，就是会更新消费者组的*最后ID*。
如果ID是任意其他有效的数字ID，那么命令将会让我们访问我们的*历史待处理消息*。即传递给这个指定消费者（由提供的名称标识）的消息集，并且到目前为止从未使用**XACK**进行确认。

我们可以立即测试此行为，指定ID为0，不带任何**COUNT**选项：我们只会看到唯一的待处理消息，即关于apples的消息：

```
> XREADGROUP GROUP mygroup Alice STREAMS mystream 0
1) 1) "mystream"
   2) 1) 1) 1526569495631-0
         2) 1) "message"
            2) "apple"
```

但是，如果我们确认这个消息已经处理，它将不再是历史待处理消息的一部分，因此系统将不再报告任何消息：

```
> XACK mystream mygroup 1526569495631-0
(integer) 1
> XREADGROUP GROUP mygroup Alice STREAMS mystream 0
1) 1) "mystream"
   2) (empty list or set)
```

如果你还不清楚**XACK**是如何工作的，请不用担心，这个概念只是已处理的消息不再是我们可以访问的历史记录的一部分。

现在轮到Bob来读取一些东西了：

```
> XREADGROUP GROUP mygroup Bob COUNT 2 STREAMS mystream >
1) 1) "mystream"
   2) 1) 1) 1526569498055-0
         2) 1) "message"
            2) "orange"
      2) 1) 1526569506935-0
         2) 1) "message"
            2) "strawberry"
```

Bob要求最多两条消息，并通过同一消费者组`mygroup`读取。所以发生的是Redis仅报告*新*消息。正如你所看到的，消息"apple"未被传递，因为它已经被传递给Alice，所以Bob获取到了orange和strawberry，以此类推。

这样，Alice，Bob以及这个消费者组中的任何其他消费者，都可以从相同的Stream中读取到不同的消息，读取他们尚未处理的历史消息，或者标记消息为已处理。这允许创建不同的拓扑和语义来从Stream中消费消息。

有几件事需要记住：

* 消费者是在他们第一次被提及的时候自动创建的，不需要显式创建。
* 即使使用**XREADGROUP**，你也可以同时从多个key中读取，但是要让其工作，你需要给每一个Stream创建一个名称相同的消费者组。这并不是一个常见的需求，但是需要说明的是，这个功能在技术上是可以实现的。
* **XREADGROUP**命令是一个*写命令*，因为当它从Stream中读取消息时，消费者组被修改了，所以这个命令只能在master节点调用。

使用Ruby语言编写的使用用户组的消费者实现示例如下。 Ruby代码的编写方式，几乎对使用任何其他语言编程的程序员或者不懂Ruby的人来说，都是清晰可读的：

```ruby
require 'redis'

if ARGV.length == 0
    puts "Please specify a consumer name"
    exit 1
end

ConsumerName = ARGV[0]
GroupName = "mygroup"
r = Redis.new

def process_message(id,msg)
    puts "[#{ConsumerName}] #{id} = #{msg.inspect}"
end

$lastid = '0-0'

puts "Consumer #{ConsumerName} starting..."
check_backlog = true
while true
    # Pick the ID based on the iteration: the first time we want to
    # read our pending messages, in case we crashed and are recovering.
    # Once we consumer our history, we can start getting new messages.
    if check_backlog
        myid = $lastid
    else
        myid = '>'
    end

    items = r.xreadgroup('GROUP',GroupName,ConsumerName,'BLOCK','2000','COUNT','10','STREAMS',:my_stream_key,myid)
    
    if items == nil
        puts "Timeout!"
        next
    end

    # If we receive an empty reply, it means we were consuming our history
    # and that the history is now empty. Let's start to consume new messages.
    check_backlog = false if items[0][1].length == 0
    
    items[0][1].each{|i|
        id,fields = i

        # Process the message
        process_message(id,fields)

        # Acknowledge the message as processed
        r.xack(:my_stream_key,GroupName,id)

        $lastid = id
    }
end
```

正如你所看到的，这里的想法是开始消费历史消息，即我们的待处理消息列表。这很有用，因为消费者可能已经崩溃，因此在重新启动时，我们想要重新读取那些已经传递给我们但还没有确认的消息。通过这种方式，我们可以多次或者一次处理消息（至少在消费者失败的场景中是这样，但是这也受到Redis持久化和复制的限制，请参阅有关此主题的特定部分）。

消耗历史消息后，我们将得到一个空的消息列表，我们可以切换到 `>` ，使用特殊ID来消费新消息。

## 从永久性失败中恢复

上面的例子允许我们编写多个消费者参与同一个消费者组，每个消费者获取消息的一个子集进行处理，并且在故障恢复时重新读取各自的待处理消息。然而在现实世界中，消费者有可能永久地失败并且永远无法恢复。由于任何原因停止后，消费者的待处理消息会发生什么呢？

Redis的消费者组提供了一个专门针对这种场景的特性，用以*认领*给定消费者的待处理消息，这样一来，这些消息就会改变他们的所有者，并且被重新分配给其他消费者。这个特性是非常明确的，消费者必须检查待处理消息列表，并且必须使用特殊命令来认领特定的消息，否则服务器将把待处理的消息永久分配给旧消费者，这样不同的应用程序就可以选择是否使用这样的特性，以及使用它的方式。

这个过程的第一步是使用一个叫做**XPENDING**的命令，这个命令提供消费者组中待处理条目的可观察性。这是一个只读命令，它总是可以安全地调用，不会改变任何消息的所有者。在最简单的形式中，调用这个命令只需要两个参数，即Stream的名称和消费者组的名称。

```
> XPENDING mystream mygroup
1) (integer) 2
2) 1526569498055-0
3) 1526569506935-0
4) 1) 1) "Bob"
      2) "2"
```

当以这种方式调用的时候，命令只会输出给定消费者组的待处理消息总数（在本例中是两条消息），所有待处理消息中的最小和最大的ID，最后是消费者列表和每个消费者的待处理消息数量。我们只有Bob有两条待处理消息，因为Alice请求的唯一一条消息已使用**XACK**确认了。

我们可以通过给**XPENDING**命令传递更多的参数来获取更多信息，完整的命令签名如下：

```
XPENDING <key> <groupname> [<start-id> <end-id> <count> [<conusmer-name>]]
```

通过提供一个开始和结束ID（可以只是`-`和`+`，就像**XRANGE**一样），以及一个控制命令返回的信息量的数字，我们可以了解有关待处理消息的更多信息。如果我们想要将输出限制为仅针对给定使用者组的待处理消息，可以使用最后一个可选参数，即消费者组的名称，但我们不会在以下示例中使用此功能。

```
> XPENDING mystream mygroup - + 10
1) 1) 1526569498055-0
   2) "Bob"
   3) (integer) 74170458
   4) (integer) 1
2) 1) 1526569506935-0
   2) "Bob"
   3) (integer) 74170458
   4) (integer) 1
```

现在我们有了每一条消息的详细信息：消息ID，消费者名称，*空闲时间*（单位是毫秒，意思是：自上次将消息传递给某个消费者以来经过了多少毫秒），以及每一条给定的消息被传递了多少次。我们有来自Bob的两条消息，它们空闲了74170458毫秒，大概20个小时。

请注意，没有人阻止我们检查第一条消息内容是什么，使用**XRANGE**即可。

```
> XRANGE mystream 1526569498055-0 1526569498055-0
1) 1) 1526569498055-0
   2) 1) "message"
      2) "orange"
```

我们只需要在参数中重复两次相同的ID。现在我们有了一些想法，Alice可能会根据过了20个小时仍然没有处理这些消息，来判断Bob可能无法及时恢复，所以现在是时候*认领*这些消息，并继续代替Bob处理了。为了做到这一点，我们使用**XCLAIM**命令。

这个命令非常的复杂，并且在其完整形式中有很多选项，因为它用于复制消费者组的更改，但我们只使用我们通常需要的参数。在这种情况下，它就像调用它一样简单：

```
XCLAIM <key> <group> <consumer> <min-idle-time> <ID-1> <ID-2> ... <ID-N>
```

基本上我们说，对于这个特定的Stream和消费者组，我希望指定的ID的这些消息可以改变他们的所有者，并将被分配到指定的消费者`<consumer>`。但是，我们还提供了最小空闲时间，因此只有在上述消息的空闲时间大于指定的空闲时间时，操作才会起作用。这很有用，因为有可能两个客户端会同时尝试认领一条消息：

```
Client 1: XCLAIM mystream mygroup Alice 3600000 1526569498055-0
Clinet 2: XCLAIM mystream mygroup Lora 3600000 1526569498055-0
```

然而认领一条消息的副作用是会重置它的闲置时间！并将增加其传递次数的计数器，所以上面第二个客户端的认领会失败。通过这种方式，我们可以避免对消息进行简单的重新处理（即使是在一般情况下，你仍然不能获得准确的一次处理）。

下面是命令执行的结果：

```
> XCLAIM mystream mygroup Alice 3600000 1526569498055-0
1) 1) 1526569498055-0
   2) 1) "message"
      2) "orange"
```

Alice成功认领了该消息，现在可以处理并确认消息，尽管原来的消费者还没有恢复，也能往前推动。

从上面的例子很明显能看到，作为成功认领了指定消息的副作用，**XCLAIM**命令也返回了消息数据本身。但这不是强制性的。可以使用**JUSTID**选项，以便仅返回成功认领的消息的ID。如果你想减少客户端和服务器之间的带宽使用量的话，以及考虑命令的性能，这会很有用，并且你不会对消息感兴趣，因为稍后你的消费者的实现方式将不时地重新扫描历史待处理消息。

认领也可以通过一个独立的进程来实现：这个进程只负责检查待处理消息列表，并将空闲的消息分配给看似活跃的消费者。可以通过Redis Stream的可观察特性获得活跃的消费者。这是下一个章节的主题。

## 消息认领及交付计数器

在**XPENDING**的输出中，你所看到的计数器是每一条消息的交付次数。这样的计数器以两种方式递增：消息通过**XCLAIM**成功认领时，或者调用**XREADGROUP**访问历史待处理消息时。

当出现故障时，消息被多次传递是很正常的，但最终它们通常会得到处理。但有时候处理特定的消息会出现问题，因为消息会以触发处理代码中的bug的方式被损坏或修改。在这种情况下，消费者处理这条特殊的消息会一直失败。因为我们有传递尝试的计数器，所以我们可以使用这个计数器来检测由于某些原因根本无法处理的消息。所以一旦消息的传递计数器达到你给定的值，比较明智的做法是将这些消息放入另外一个Stream，并给系统管理员发送一条通知。这基本上是Redis Stream实现的*dead letter*概念的方式。

## Streams 的可观察性

缺乏可观察性的消息系统很难处理。不知道谁在消费消息，哪些消息待处理，不知道给定Stream的活跃消费者组的集合，使得一切都不透明。因此，Redis Stream和消费者组都有不同的方式来观察正在发生的事情。我们已经介绍了**XPENDING**，它允许我们检查在给定时刻正在处理的消息列表，以及它们的空闲时间和传递次数。

但是，我们可能希望做更多的事情，**XINFO**命令是一个可观察性接口，可以与子命令一起使用，以获取有关Stream或消费者组的信息。

这个命令使用子命令来显示有关Stream和消费者组的状态的不同信息，比如使用**XINFO STREAM <key>**可以报告关于Stream本身的信息。

```
> XINFO STREAM mystream
 1) length
 2) (integer) 13
 3) radix-tree-keys
 4) (integer) 1
 5) radix-tree-nodes
 6) (integer) 2
 7) groups
 8) (integer) 2
 9) first-entry
10) 1) 1524494395530-0
    2) 1) "a"
       2) "1"
       3) "b"
       4) "2"
11) last-entry
12) 1) 1526569544280-0
    2) 1) "message"
       2) "banana"
```

输出显示了有关如何在内部编码Stream的信息，以及显示了Stream的第一条和最后一条消息。另一个可用的信息是与这个Stream相关联的消费者组的数量。我们可以进一步挖掘有关消费者组的更多信息。

```
> XINFO GROUPS mystream
1) 1) name
   2) "mygroup"
   3) consumers
   4) (integer) 2
   5) pending
   6) (integer) 2
2) 1) name
   2) "some-other-group"
   3) consumers
   4) (integer) 1
   5) pending
   6) (integer) 0
```

正如你在这里和前面的输出中看到的，**XINFO**命令输出一系列键值对。因为这是一个可观察性命令，允许人类用户立即了解报告的信息，并允许命令通过添加更多字段来报告更多信息，而不会破坏与旧客户端的兼容性。其他更高带宽效率的命令，比如**XPENDING**，只报告没有字段名称的信息。

上面例子中的输出（使用了子命令**GROUPS**）应该能清楚地观察字段名称。我们可以通过检查在此类消费者组中注册的消费者，来更详细地检查特定消费者组的状态。

```
> XINFO CONSUMERS mystream mygroup
1) 1) name
   2) "Alice"
   3) pending
   4) (integer) 1
   5) idle
   6) (integer) 9104628
2) 1) name
   2) "Bob"
   3) pending
   4) (integer) 1
   5) idle
   6) (integer) 83841983
```

如果你不记得命令的语法，只需要查看命令本身的帮助：

```
> XINFO HELP
1) XINFO <subcommand> arg arg ... arg. Subcommands are:
2) CONSUMERS <key> <groupname>  -- Show consumer groups of group <groupname>.
3) GROUPS <key>                 -- Show the stream consumer groups.
4) STREAM <key>                 -- Show information about the stream.
5) HELP                         -- Print this help.
```

## 与Kafka（TM）分区的差异

Redis Stream的消费者组可能类似于基于Kafka（TM）分区的消费者组，但是要注意Redis Stream实际上非常不同。分区仅仅是*逻辑*的，并且消息只是放在一个Redis键中，因此不同客户端的服务方式取决于谁准备处理新消息，而不是从哪个分区客户端读取。例如，如果消费者C3在某一点永久故障，Redis会继续服务C1和C2，将新消息送达，就像现在只有两个*逻辑*分区一样。

类似地，如果一个给定的消费者在处理消息方面比其他消费者快很多，那么这个消费者在相同单位时间内按比例会接收更多的消息。这是有可能的，因为Redis显式地追踪所有未确认的消息，并且记住了谁接收了哪些消息，以及第一条消息的ID从未传递给任何消费者。

但是，这也意味着在Redis中，如果你真的想把同一个Stream的消息分区到不同的Redis实例中，你必须使用多个key和一些分区系统，比如Redis集群或者特定应用程序的分区系统。单个Redis Stream不会自动分区到多个实例上。

我们可以说，以下是正确的：

* 如果你使用一个Stream对应一个消费者，则消息是按顺序处理的。
* 如果你使用N个Stream对应N个消费者，那么只有给定的消费者hits N个Stream的子集，你可以扩展上面的模型来实现。
* 如果你使用一个Stream对应多个消费者，则对N个消费者进行负载平衡，但是在那种情况下，有关同一逻辑项的消息可能会无序消耗，因为给定的消费者处理消息3可能比另一个消费者处理消息4要快。

所以基本上Kafka分区更像是使用了N个不同的Redis键。而Redis消费者组是一个将给定Stream的消息负载均衡到N个不同消费者的服务端负载均衡系统。

## 设置Streams的上限

许多应用并不希望将数据永久收集到一个Stream。有时在Stream中指定一个最大项目数很有用，之后一旦达到给定的大小，将数据从Redis中移到不那么快的非内存存储是有用的，适合用来记录未来几十年的历史数据。Redis Stream对此有一定的支持。这就是**XADD**命令的**MAXLEN**选项，这个选项用起来很简单：

```
> XADD mystream MAXLEN 2 * value 1
1526654998691-0
> XADD mystream MAXLEN 2 * value 2
1526654999635-0
> XADD mystream MAXLEN 2 * value 3
1526655000369-0
> XLEN mystream
(integer) 2
> XRANGE mystream - +
1) 1) 1526654999635-0
   2) 1) "value"
      2) "2"
2) 1) 1526655000369-0
   2) 1) "value"
      2) "3"
```

如果使用**MAXLEN**选项，当Stream的达到指定长度后，老的条目会自动被驱逐，因此Stream的大小是恒定的。目前还没有选项让Stream只保留给定数量的条目，因为为了一致地运行，这样的命令必须为了驱逐条目而潜在地阻塞很长时间。比如可以想象一下如果存在插入尖峰，然后是长暂停，以及另一次插入，全都具有相同的最大时间。Stream会阻塞来驱逐在暂停期间变得太旧的数据。因此，用户需要进行一些规划并了解所需的最大流长度。此外，虽然Stream的长度与内存使用是成正比的，但是按时间来缩减不太容易控制和预测：这取决于插入速率，该变量通常随时间变化（当它不变化时，那么按尺寸缩减是微不足道的）。

However trimming with **MAXLEN** can be expensive: streams are represented by macro nodes into a radix tree, in order to be very memory efficient. Altering the single macro node, consisting of a few tens of elements, is not optimal. So it is possible to give the command in the following special form:

```
XADD mystream MAXLEN ~ 1000 * ... entry fields here ...
```

The `~` argument between the **MAXLEN** option and the actual count means, I don't really need this to be exactly 1000 items. It can be 1000 or 1010 or 1030, just make sure to save at least 1000 items. With this argument, the trimming is performed only when we can remove a whole node. This makes it much more efficient, and it is usually what you want.

There is also the **XTRIM** command available, which performs something very similar to what the **MAXLEN** option does above, but this command does not need to add anything, can be run against any stream in a standalone way.

```
> XTRIM mystream MAXLEN 10
```

Or, as for the **XADD** option:

```
> XTRIM mystream MAXLEN ~ 10
```

However, **XTRIM** is designed to accept different trimming strategies, even if currently only **MAXLEN** is implemented. Given that this is an explicit command, it is possible that in the future it will allow to specify trimming by time, because the user calling this command in a stand-alone way is supposed to know what she or he is doing.

One useful eviction strategy that **XTRIM** should have is probably the ability to remove by a range of IDs. This is currently not possible, but will be likely implemented in the future in order to more easily use **XRANGE** and **XTRIM** together to move data from Redis to other storage systems if needed.

## Persistence, replication and message safety

A Stream, like any other Redis data structure, is asynchronously replicated to slaves and persisted into AOF and RDB files. However what may not be so obvious is that also consumer groups full state is propagated to AOF, RDB and slaves, so if a message is pending in the master, also the slave will have the same information. Similarly, after a restart, the AOF will restore the consumer groups state.

However note that Redis streams and consumer groups are persisted and replicated using the Redis default replication, so:

* AOF must be used with a strong fsync policy if persistence of messages is important in your application.
* By default the asynchronous replication will not guarantee that **XADD** commands or consumer groups state changes are replicated: after a failover something can be missing depending on the ability of slaves to receive the data from the master.
* The **WAIT** command may be used in order to force the propagation of the changes to a set of slaves. However note that while this makes very unlikely that data is lost, the Redis failover process as operated by Sentinel or Redis Cluster performs only a *best effort* check to failover to the slave which is the most updated, and under certain specific failures may promote a slave that lacks some data.

So when designing application using Redis streams and consumer groups, make sure to understand the semantical properties your application should have during failures, and configure things accordingly, evaluating if it is safe enough for your use case.

## Removing single items from a stream

Streams also have a special command to remove items from the middle of a stream, just by ID. Normally for an append only data structure this may look like an odd feature, but it is actually useful for applications involving, for instance, privacy regulations. The command is called **XDEL**, and will just get the name of the stream followed by the IDs to delete:

```
> XRANGE mystream - + COUNT 2
1) 1) 1526654999635-0
   2) 1) "value"
      2) "2"
2) 1) 1526655000369-0
   2) 1) "value"
      2) "3"
> XDEL mystream 1526654999635-0
(integer) 1
> XRANGE mystream - + COUNT 2
1) 1) 1526655000369-0
   2) 1) "value"
      2) "3"
```

However in the current implementation, memory is not really reclaimed until a macro node is completely empty, so you should not abuse this feature.

## Zero length streams

A difference between streams and other Redis data structures is that when the other data structures have no longer elements, as a side effect of calling commands that remove elements, the key itself will be removed. So for instance, a sorted set will be completely removed when a call to **ZREM** will remove the last element in the sorted set. Streams instead are allowed to stay at zero elements, both as a result of using a **MAXLEN** option with a count of zero (**XADD** and **XTRIM** commands), or because **XDEL** was called.

The reason why such an asymmetry exists is because Streams may have associated consumer groups, and we do not want to lose the state that the consumer groups define just because there are no longer items inside the stream. Currently the stream is not deleted even when it has no associated consumer groups, but this may change in the future.
