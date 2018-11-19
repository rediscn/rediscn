---
layout: commands
title: zpopmax 命令
permalink: commands/zpopmax.html
disqusIdentifier: command_zpopmax
disqusUrl: http://redis.cn/commands/zpopmax.html
commandsType: sortedsets
discuzTid: 13928
tranAuthor: wangqiang
---

删除并返回有序集合`key`中的最多`count`个具有最高得分的成员。

如未指定，`count`的默认值为1。指定一个大于有序集合的基数的`count`不会产生错误。
当返回多个元素时候，得分最高的元素将是第一个元素，然后是分数较低的元素。

## 返回值

[array-reply](/topics/protocol.html#array-reply): 弹出的元素和分数列表。

## 例子

	redis> ZADD myzset 1 "one"
	(integer) 1
	redis> ZADD myzset 2 "two"
	(integer) 1
	redis> ZADD myzset 3 "three"
	(integer) 1
	redis> ZPOPMAX myzset
	1) "3"
	2) "three"
	redis> 
