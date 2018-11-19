---
layout: commands
title: xrange 命令
permalink: commands/xrange.html
disqusIdentifier: command_xrange
disqusUrl: http://redis.cn/commands/xrange.html
commandsType: streams
discuzTid: 13923
tranAuthor: wangqiang
---

此命令返回流中满足给定ID范围的条目。范围由最小和最大ID指定。所有ID在指定的两个ID之间或与其中一个ID相等（闭合区间）的条目将会被返回。

`XRANGE`命令有许多用途：

* 返回特定时间范围的项目。这是可能的，因为流的ID[与时间相关](/topics/streams-intro.html)。
* 增量迭代流，每次迭代只返回几个项目。但它在语义上比`SCAN`函数族强大很多。
* 从流中获取单个条目，提供要获取两次的条目的ID：作为查询间隔的开始和结束。

该命令还有一个倒序命令，以相反的顺序返回项目，叫做`XREVRANGE`，除了返回顺序相反以外，它们是完全相同的。

## 特殊ID：`-` 和 `+`

特殊ID`-`和`+`分别表示流中可能的最小ID和最大ID，因此，以下命令将会返回流中的每一个条目：

```
> XRANGE somestream - +
1) 1) 1526985054069-0
   2) 1) "duration"
      2) "72"
      3) "event-id"
      4) "9"
      5) "user-id"
      6) "839248"
2) 1) 1526985069902-0
   2) 1) "duration"
      2) "415"
      3) "event-id"
      4) "2"
      5) "user-id"
      6) "772213"
... other entries here ...
```

`-` ID实际上与指定`0-0`完全一样，而`+`则相当于`18446744073709551615-18446744073709551615`，但是它们更适合输入。

## 不完全ID

流的ID由两部分组成，一个Unix毫秒时间戳和一个为同一毫秒插入的序列号。使用`XRANGE`仅指定ID的第一部分是可能的，即毫秒时间部分，如下面的例子所示：

```
> XRANGE somestream 1526985054069 1526985055069
```

在这种情况中，`XRANGE`将会使用`-0`自动补全开始ID，以及使用`-18446744073709551615`自动补全结束ID，以便返回所有在两个毫秒值之间生成的条目。这同样意味着，重复两个相同的毫秒时间，我们将会得到在这一毫秒内产生的所有条目，因为序列号范围将从0到最大值。

以这种方式使用`XRANGE`用作范围查询命令以在指定时间内获取条目。这非常方便，以便访问流中过去事件的历史记录。

## 返回最大条目数

使用**COUNT**选项可以减少报告的条目数。这是一个非常重要的特性，虽然它看起来很边缘，因为它允许，例如，模型操作，比如*给我大于或等于以下ID的条目*：

```
> XRANGE somestream 1526985054069-0 + COUNT 1
1) 1) 1526985054069-0
   2) 1) "duration"
      2) "72"
      3) "event-id"
      4) "9"
      5) "user-id"
      6) "839248"
```

在上面的例子中，条目`1526985054069-0`存在，否则服务器将发送给我们下一个条目。使用`COUNT`也是使用`XRANGE`作为迭代器的基础。

## 迭代流

为了迭代流，我们可以如下进行。让我们假设每次迭代我们需要两个元素。我们开始获取前两个元素，这是微不足道的：

```
> XRANGE writers - + COUNT 2
1) 1) 1526985676425-0
   2) 1) "name"
      2) "Virginia"
      3) "surname"
      4) "Woolf"
2) 1) 1526985685298-0
   2) 1) "name"
      2) "Jane"
      3) "surname"
      4) "Austen"
```

然后，不是从`-`再次开始迭代，我们使用前一次`XRANGE`调用中返回的*最后的条目ID*作为范围的开始，将ID的序列部分加1。

最后一个条目的ID是`1526985685298-0`，所以我们只需要在序列中加1以获得`1526985685298-1`，并继续我们的迭代：

```
> XRANGE writers 1526985685298-1 + COUNT 2
1) 1) 1526985691746-0
   2) 1) "name"
      2) "Toni"
      3) "surname"
      4) "Morris"
2) 1) 1526985712947-0
   2) 1) "name"
      2) "Agatha"
      3) "surname"
      4) "Christie"
```

依此类推，最终，这将允许访问流中的所有条目。很明显，我们可以从任意ID开始迭代，或者甚至从特定的时间开始，通过提供一个不完整的开始ID。此外，我们可以限制迭代到一个给定的ID或时间安，通过提供一个结束ID或不完整ID而不是`+`。

`XREAD`命令同样可以迭代流。`XREVRANGE`命令可以反向迭代流，从较高的ID（或时间）到较低的ID（或时间）。

## 获取单个项目

如果你在查找一个`XGET`命令，你将会失望，因为`XRANGE`实际上就是从流中获取单个条目的方式。所有你需要做的，就是在XRANGE的参数中指定ID两次：

```
> XRANGE mystream 1526984818136-0 1526984818136-0
1) 1) 1526984818136-0
   2) 1) "duration"
      2) "1532"
      3) "event-id"
      4) "5"
      5) "user-id"
      6) "7782813"
```

## 有关流的其他信息

更多有关Redis流的信息，请参阅我们的[Redis Streams介绍文档](/topics/streams-intro)。

## 返回值

[array-reply](/topics/protocol.html#array-reply)：

该命令返回ID与指定范围匹配的条目。返回的条目是完整的，这意味着ID和所有组成条目的字段都将返回。此外，返回的条目及其字段和值的顺序与使用`XADD`添加它们的顺序完全一致。

## 例子


	redis> XADD writers * name Virginia surname Woolf
	"1539863591459-0"
	redis> XADD writers * name Jane surname Austen
	"1539863591460-0"
	redis> XADD writers * name Toni surname Morris
	"1539863591460-1"
	redis> XADD writers * name Agatha surname Christie
	"1539863591461-0"
	redis> XADD writers * name Ngozi surname Adichie
	"1539863591462-0"
	redis> XLEN writers
	(integer) 5
	redis> XRANGE writers - + COUNT 2
	1) 1) "1539863591459-0"
	   2) 1) "name"
		  2) "Virginia"
		  3) "surname"
		  4) "Woolf"
	2) 1) "1539863591460-0"
	   2) 1) "name"
		  2) "Jane"
		  3) "surname"
		  4) "Austen"
	redis> 

