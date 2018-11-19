---
layout: commands
title: xinfo 命令
permalink: commands/xinfo.html
disqusIdentifier: command_xinfo
disqusUrl: http://redis.cn/commands/xinfo.html
commandsType: streams
discuzTid: 13920
tranAuthor: wangqiang
---

这是一个内省命令，用于检索关于流和关联的消费者组的不同的信息。有三种可能的形式：

* `XINFO STREAM <key>`

在这种形式下，此命令返回有关存储在特定键的流的一般信息。

```
> XINFO STREAM mystream
 1) length
 2) (integer) 2
 3) radix-tree-keys
 4) (integer) 1
 5) radix-tree-nodes
 6) (integer) 2
 7) groups
 8) (integer) 2
 9) last-generated-id
10) 1538385846314-0
11) first-entry
12) 1) 1538385820729-0
    2) 1) "foo"
       2) "bar"
13) last-entry
14) 1) 1538385846314-0
    2) 1) "field"
       2) "value"
```

在以上例子中，你可以看到报告的信息是流的元素的数量，有关表示流的基数树的详细信息（主要用于优化和调试任务），与流关联的消费者组的数量，最后生成的ID（某些条目被删除时，此ID可能与最后一个条目的ID不同），最后显示了流中完整的第一个和最后一个条目，以便了解流的内容是什么。

* `XINFO GROUPS <key>`

在这种形式中，我们只获得与流关联的所有消费者组的输出：

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

对每一个列出的消费者组，该命令还显示该组中已知的消费者数量，以及该组中的待处理消息（已传递但尚未确认）数量。

* `XINFO CONSUMERS <key> <group>`

最后，还可以取得指定消费者组中的消费者列表：

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

我们可以看到这个消费者的空闲毫秒时间（最后一个字段）以及消费者名称和待处理消息数量。

**请注意，你不应该依赖字段的确切位置**，也不应该依赖字段的数量，因为将来可能会增加新的字段。因此，表现良好的客户端应该获取整个列表，并将其报告给用户，例如，作为字典数据结构。低级客户端（例如C客户端，其中项目可能以线性数组报告）应该注明顺序是不确定的。

最后，通过使用`HELP`子命令，可以从命令获得帮助，以防用户无法记住确切的语法：

```
> XINFO HELP
1) XINFO <subcommand> arg arg ... arg. Subcommands are:
2) CONSUMERS <key> <groupname>  -- Show consumer groups of group <groupname>.
3) GROUPS <key>                 -- Show the stream consumer groups.
4) STREAM <key>                 -- Show information about the stream.
5) HELP
```
