---
layout: commands
title: xdel 命令
permalink: commands/xdel.html
disqusIdentifier: command_xdel
disqusUrl: http://redis.cn/commands/xdel.html
commandsType: streams
discuzTid: 13918
---

从指定流中移除指定的条目，并返回成功删除的条目的数量，在传递的ID不存在的情况下，
返回的数量可能与传递的ID数量不同。

通常，你可能将Redis流想象为一个仅附加的数据结构，但是Redis流是存在于内存中的，
所以我们也可以删除条目。这也许会有用，例如，为了遵守特定的隐私策略。

# 理解删除条目的底层细节

Redis流以一种使其内存高效的方式表示：使用基数树来索引包含线性数十个Stream条目的宏节点。
通常，当你从Stream中删除一个条目的时候，条目并没有*真正*被驱逐，只是被标记为删除。

最终，如果宏节点中的所有条目都被标记为删除，则会销毁整个节点，并回收内存。
这意味着如果你从Stream里删除大量的条目，比如超过50%的条目，则每一个条目的内存占用可能会增加，
因为Stream将会开始变得碎片化。然而，流的表现将保持不变。

在Redis未来的版本中，当一个宏节点内删除条目达到一定数量的时候，我们有可能会触发节点垃圾回收机制。
目前，根据我们对这种数据结构的预期用途，还不太适合增加这样的复杂度。

## 返回值

[integer-reply](/topics/protocol.html#integer-reply)：


例子：

```
> XADD mystream * a 1
1538561698944-0
> XADD mystream * b 2
1538561700640-0
> XADD mystream * c 3
1538561701744-0
> XDEL mystream 1538561700640-0
(integer) 1
127.0.0.1:6379> XRANGE mystream - +
1) 1) 1538561698944-0
   2) 1) "a"
      2) "1"
2) 1) 1538561701744-0
   2) 1) "c"
      2) "3"
```
