---
layout: commands
title: swapdb 命令
permalink: commands/swapdb.html
disqusIdentifier: command_swapdb
disqusUrl: http://redis.cn/commands/swapdb.html
commandsType: connection
discuzTid: 13913
---

该命令可以交换同一Redis服务器上的两个DATABASE，可以实现连接某一数据库的连接立即访问到其他DATABASE的数据。访问交换前其他database的连接也可以访问到该DATABASE的数据。
如：
	SWPAP 0 1
交换DATABASE 0，1。所有访问0号数据库的连接立刻可以访问到1号数据库的数据，同样的，访问1号数据库的连接立即可以访问0号数据库的数据。


## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply): `SWAPDB` 执行成功返回`OK` .

## 例子

```
SWAPDB 0 1
```
