---
layout: commands
title: swapdb 命令
permalink: commands/swapdb.html
disqusIdentifier: command_swapdb
disqusUrl: http://redis.cn/commands/swapdb.html
commandsType: connection
discuzTid: 13913
---

This command swaps two Redis databases, so that immediately all the
clients connected to a given database will see the data of the other database, and
the other way around. Example:

    SWAPDB 0 1

This will swap database 0 with database 1. All the clients connected with database 0 will immediately see the new data, exactly like all the clients connected with database 1 will see the data that was formerly of database 0.

该命令可以交换同一Redis服务器上的两个DATABASE，可以实现连接指定数据库的连接立即访问到其他DB的数据。访问交换前其他数据库的连接也可以访问到指定DB的数据。
如：
	SWPAP 0 1
交换数据库 0，1。所有访问0号数据库的连接立刻可以访问到1号数据库的数据，同时，访问1号数据库的连接立即可以访问0号数据库的数据。


## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply): `OK` if `SWAPDB` was executed correctly.

## 例子

```
SWAPDB 0 1
```
