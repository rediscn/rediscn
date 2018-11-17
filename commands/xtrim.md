---
layout: commands
title: xtrim 命令
permalink: commands/xtrim.html
disqusIdentifier: command_xtrim
disqusUrl: http://redis.cn/commands/xtrim.html
commandsType: streams
discuzTid: 13927
tranAuthor: wangqiang
---

`XTRIM`将流裁剪为指定数量的项目，如有需要，将驱逐旧的项目（ID较小的项目）。此命令被设想为接受多种修整策略，但目前只实现了一种，即`MAXLEN`，并且与`XADD`中的`MAXLEN`选项完全相同。

例如，下面的命令会将流裁剪到最新的1000个项目：

```
XTRIM mystream MAXLEN 1000
```

可以使用以下特殊形式提供命令，以提高其效率：

```
XTRIM mystream MAXLEN ~ 1000
```

在选项**MAXLEN**和实际计数中间的参数`~`的意思是，用户不是真的需要精确的1000个项目。它可以多几十个条目，但决不能少于1000个。通过使用这个参数，仅当我们移除整个节点的时候才执行修整。这使得命令更高效，而且这也是我们通常想要的。

## 返回值

[integer-reply](/topics/protocol.html#integer-reply)：

该命令返回从流中删除的条目数。

	redis> XADD mystream * field1 A field2 B field3 C field4 D
	"1539863719429-0"
	redis> XTRIM mystream MAXLEN 2
	ERR Unknown or disabled command 'XTRIM'
	redis> XRANGE mystream - +
	1) 1) "1539863719429-0"
	   2) 1) "field1"
		  2) "A"
		  3) "field2"
		  4) "B"
		  5) "field3"
		  6) "C"
		  7) "field4"
		  8) "D"
	redis> 
