---
layout: commands
title: xadd 命令
permalink: commands/xadd.html
disqusIdentifier: command_xadd
disqusUrl: http://redis.cn/commands/xadd.html
commandsType: streams
discuzTid: 13915
tranAuthor: wangqiang
---

将指定的流条目追加到指定key的流中。
如果key不存在，作为运行这个命令的副作用，将使用流的条目自动创建key。

一个条目是由一组键值对组成的，它基本上是一个小的字典。
键值对以用户给定的顺序存储，并且读取流的命令（如`XRANGE` 或者 `XREAD`）
可以保证按照通过`XADD`添加的顺序返回。

`XADD`是*唯一可以向流添加数据的Redis命令*，但是还有其他命令，
例如`XDEL`和`XTRIM`，他们能够从流中删除数据。

## 将Stream ID指定为参数

流条目ID标识流内的给定条目。
如果指定的ID参数是字符`*`（星号ASCII字符），`XADD`命令会自动为您生成一个唯一的ID。
但是，也可以指定一个良好格式的ID，以便新的条目以指定的ID准确存储，
虽然仅在极少数情况下有用。

ID是由`-`隔开的两个数字组成的：

    1526919030474-55

两个部分数字都是64位的，当自动生成ID时，第一部分是生成ID的Redis实例的毫秒格式的Unix时间。
第二部分只是一个序列号，以及是用来区分同一毫秒内生成的ID的。

ID保证始终是递增的：如果比较刚插入的条目的ID，它将大于其他任何过去的ID，
因此条目在流中是完全排序的。为了保证这个特性，如果流中当前最大的ID的时间
大于实例的当前本地时间，将会使用前者，并将ID的序列部分递增。例如，
本地始终回调了，或者在故障转移之后新主机具有不同的绝对时间，则可能发生这种情况。

当用户为`XADD`命令指定显式ID时，最小有效的ID是`0-1`，
并且用户*必须*指定一个比当前流中的任何ID都要大的ID，否则命令将失败。
通常使用特定ID仅在您有另一个系统生成唯一ID（例如SQL表），
并且您确实希望Redis流ID与该另一个系统的ID匹配时才有用。

## 上限流

可以使用**MAXLEN**选项来限制流中的最大元素数量。

与使用`XADD`添加条目相比较，使用**MAXLEN**修整会很昂贵：
流由宏节点表示为基数树，以便非常节省内存。改变由几十个元素组成的单个宏节点不是最佳的。
因此可以使用以下特殊形式提供命令：

    XADD mystream MAXLEN ~ 1000 * ... entry fields here ...

在选项**MAXLEN**和实际计数中间的参数`~`的意思是，用户不是真的需要精确的1000个项目。
它可以多几十个条目，但决不能少于1000个。通过使用这个参数，仅当我们移除整个节点的时候才执行修整。
这使得命令更高效，而且这也是我们通常想要的。

## 有关流的其他信息

更多关于Redis流的信息请参阅我们的【Redis Streams介绍文档】(/topics/streams-intro.html)。

## 返回值

[bulk-string-reply](/topics/protocol.html#bulk-string-reply)：

该命令返回添加的条目的ID。如果ID参数传的是`*`，那么ID是自动生成的，
否则，命令仅返回用户在插入期间指定的相同的ID。

## 例子

	redis> XADD mystream * name Sara surname OConnor
	"1539863454486-0"
	redis> XADD mystream * field1 value1 field2 value2 field3 value3
	"1539863454486-1"
	redis> XLEN mystream
	(integer) 2
	redis> XRANGE mystream - +
	1) 1) "1539863454486-0"
	   2) 1) "name"
		  2) "Sara"
		  3) "surname"
		  4) "OConnor"
	2) 1) "1539863454486-1"
	   2) 1) "field1"
		  2) "value1"
		  3) "field2"
		  4) "value2"
		  5) "field3"
		  6) "value3"
	redis> 
