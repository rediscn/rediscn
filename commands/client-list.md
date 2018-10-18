---
layout: commands
title: client-list 命令
permalink: commands/client-list.html
disqusIdentifier: command_client-list
disqusUrl: http://redis.cn/commands/client-list.html
commandsType: server
discuzTid: 914
---

Redis `CLIENT LIST`命令用于返回所有连接到服务器的客户端信息和统计数据。

## 返回值

[bulk-string-reply](/topics/protocol.html#bulk-string-reply): 一个独特的字符串，格式如下：

* 每个已连接客户端对应一行（以 LF 分割）
* 每行字符串由一系列 属性=值（`property=value`） 形式的域组成，每个域之间以空格分开。

下面是各字段的含义：:

* `id`: 唯一的64位的客户端ID(Redis 2.8.12加入)。
* `addr`: 客户端的地址和端口
* `fd`: 套接字所使用的文件描述符
* `age`: 以秒计算的已连接时长
* `idle`: 以秒计算的空闲时长
* `flags`: 客户端 flag
* `db`: 该客户端正在使用的数据库 ID
* `sub`: 已订阅频道的数量
* `psub`: 已订阅模式的数量
* `multi`: 在事务中被执行的命令数量
* `qbuf`: 查询缓冲区的长度（字节为单位， 0 表示没有分配查询缓冲区）
* `qbuf-free`: 查询缓冲区剩余空间的长度（字节为单位， 0 表示没有剩余空间）
* `obl`: 输出缓冲区的长度（字节为单位， 0 表示没有分配输出缓冲区）
* `oll`: 输出列表包含的对象数量（当输出缓冲区没有剩余空间时，命令回复会以字符串对象的形式被入队到这个队列里）
* `omem`: 输出缓冲区和输出列表占用的内存总量
* `events`: 文件描述符事件
* `cmd`: 最近一次执行的命令

客户端 flag 可以由以下部分组成：

	O: 客户端是 MONITOR 模式下的附属节点（slave）
	S: 客户端是一般模式下（normal）的附属节点
	M: 客户端是主节点（master）
	x: 客户端正在执行事务
	b: 客户端正在等待阻塞事件
	i: 客户端正在等待 VM I/O 操作（已废弃）
	d: 一个受监视（watched）的键已被修改， EXEC 命令将失败
	c: 在将回复完整地写出之后，关闭链接
	u: 客户端未被阻塞（unblocked）
	U: 通过Unix套接字连接的客户端
	r: 客户端是只读模式的集群节点
	A: 尽可能快地关闭连接
	N: 未设置任何 flag


文件描述符事件可以是：

	r: 客户端套接字（在事件 loop 中）是可读的（readable）
	w: 客户端套接字（在事件 loop 中）是可写的（writeable）


## 注意

新字段会随着测试有规律的添加。某些字段将来可能会被删除。一个版本安全的Redis客户端使用这个命令时应该根据字段解析相应内容。（比如：处理未知的字段，应跳过该字段）。
