---
layout: commands
title: hincrbyfloat 命令
permalink: commands/hincrbyfloat.html
disqusIdentifier: command_hincrbyfloat
disqusUrl: http://redis.cn/commands/hincrbyfloat.html
commandsType: hashes
discuzTid: 977
---

为指定`key`的hash的`field`字段值执行float类型的`increment`加。如果`field`不存在，则在执行该操作前设置为0.如果出现下列情况之一，则返回错误：

* `field`的值包含的类型错误(不是字符串)。
* 当前`field`或者`increment`不能解析为一个float类型。

此命令的确切行为与[INCRBYFLOAT](/commands/incrbyfloat.html)命令相同，请参阅[INCRBYFLOAT](/commands/incrbyfloat.html)命令获取更多信息。

## 返回值

[bulk-string-reply](/topics/protocol.html#bulk-string-reply)：
`field`执行`increment`加后的值

## 例子

	redis> HSET mykey field 10.50
	(integer) 1
	redis> HINCRBYFLOAT mykey field 0.1
	"10.6"
	redis> HSET mykey field 5.0e3
	(integer) 0
	redis> HINCRBYFLOAT mykey field 2.0e2
	"5200"
	redis> 

## 实现细节

该命令始终是在复制和模仿[HSET](/commands/hset.html)，因此，在底层的浮点数运算不会出现数据不一致性问题。
