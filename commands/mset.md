---
layout: commands
title: mset 命令
permalink: commands/mset.html
disqusIdentifier: command_mset
disqusUrl: http://redis.cn/commands/mset.html
commandsType: strings
discuzTid: 1007
---

对应给定的keys到他们相应的values上。`MSET`会用新的value替换已经存在的value，就像普通的[SET](/commands/set.html)命令一样。如果你不想覆盖已经存在的values，请参看命令[MSETNX](/commands/msetnx.html)。

`MSET`是原子的，所以所有给定的keys是一次性set的。客户端不可能看到这种一部分keys被更新而另外的没有改变的情况。

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply)：总是OK，因为MSET不会失败。

## 例子

	redis> MSET key1 "Hello" key2 "World"
	OK
	redis> GET key1
	"Hello"
	redis> GET key2
	"World"
	redis> 