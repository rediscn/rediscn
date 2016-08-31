---
layout: commands
title: bgrewriteaof 命令
permalink: commands/bgrewriteaof.html
disqusIdentifier: command_bgrewriteaof
disqusUrl: http://redis.cn/commands/bgrewriteaof.html
commandsType: server
discuzTid: 904
---

Redis `BGREWRITEAOF` 命令用于异步执行一个 AOF（AppendOnly File）文件重写操作。重写会创建一个当前AOF文件的体积优化版本。

即使 `BGREWRITEAOF` 执行失败，也不会有任何数据丢失，因为旧的AOF文件在`BGREWRITEAOF` 成功之前不会被修改。

 AOF 重写由 Redis 自行触发， `BGREWRITEAOF`仅仅用于手动触发重写操作。

具体内容:

* 如果一个子Redis是通过磁盘快照创建的，AOF重写将会在RDB终止后才开始保存。这种情况下`BGREWRITEAOF`任然会返回OK状态码。从Redis 2.6起你可以通过[INFO](/commands/info.html)命令查看AOF重写执行情况。
* 如果只在执行的AOF重写返回一个错误，AOF重写将会在稍后一点的时间重新调用。

从 Redis 2.4 开始，AOF重写由 Redis 自行触发，`BGREWRITEAOF`仅仅用于手动触发重写操作。

请参考[Redis 持久化](/topics/persistence.html)了解更多详细信息。

##返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply): 总是返回 `OK`。
