---
layout: commands
title: xrevrange 命令
permalink: commands/xrevrange.html
disqusIdentifier: command_xrevrange
disqusUrl: http://redis.cn/commands/xrevrange.html
commandsType: streams
discuzTid: 13926
---

此命令与`XRANGE`完全相同，但显著的区别是以相反的顺序返回条目，并以相反的顺序获取开始-结束参数：在`XREVRANGE`中，你需要先指定*结束ID*，再指定*开始ID*，该命令就会从*结束ID*侧开始生成两个ID之间（或完全相同）的所有元素。

因此，例如，要获得从较高ID到较低ID的所有元素，可以使用：

    XREVRANGE + -

类似于只获取添加到流中的最后一个元素，可以使用：

    XREVRANGE + - COUNT 1

## 使用XREVRANGE迭代

与`XRANGE`一样，此命令可以用于迭代整个流的内容，但请注意，在这种情况中，下一个命令调用应该使用最后一个条目的ID，序列号减1。但如果序列号已经是0，则ID的时间部分应该减1，且序列号部分应该设置成最大可能的序列号，即18446744073709551615，或者可以完全省略，命令将自动假设它是这样一个数字（有关不完整ID的更多信息，请参阅`XRANGE`）。

例子：

```
> XREVRANGE writers + - COUNT 2
1) 1) 1526985723355-0
   2) 1) "name"
      2) "Ngozi"
      3) "surname"
      4) "Adichie"
2) 1) 1526985712947-0
   2) 1) "name"
      2) "Agatha"
      3) "surname"
      4) "Christie"
```

返回的最后ID是`1526985712947-0`，因为序列号已经是0，下一个ID我将不使用特殊ID`+`，而是`1526985712946-18446744073709551615`，或者只是`18446744073709551615`：

```
> XREVRANGE writers 1526985712946-18446744073709551615 - COUNT 2
1) 1) 1526985691746-0
   2) 1) "name"
      2) "Toni"
      3) "surname"
      4) "Morris"
2) 1) 1526985685298-0
   2) 1) "name"
      2) "Jane"
      3) "surname"
      4) "Austen"
```

所以直到迭代完成并且没有返回结果。更多有关迭代的信息，请参阅`XRANGE`页面。

## 返回值

[array-reply](/topics/protocol.html#array-reply)：


此命令返回ID在指定区间的条目，从较高的ID到较低的ID中匹配。
返回的条目是完整的，这意味着将返回ID及其组成的所有字段。
此外，返回的条目及其字段和值的顺序与以使用`XADD`添加的完全相同。

## 例子

	redis> XADD writers * name Virginia surname Woolf
	"1539863673862-0"
	redis> XADD writers * name Jane surname Austen
	"1539863673863-0"
	redis> XADD writers * name Toni surname Morris
	"1539863673865-0"
	redis> XADD writers * name Agatha surname Christie
	"1539863673866-0"
	redis> XADD writers * name Ngozi surname Adichie
	"1539863673867-0"
	redis> XLEN writers
	(integer) 5
	redis> XREVRANGE writers + - COUNT 1
	1) 1) "1539863673867-0"
	   2) 1) "name"
		  2) "Ngozi"
		  3) "surname"
		  4) "Adichie"
	redis> 