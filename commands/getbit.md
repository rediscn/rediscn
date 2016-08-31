---
layout: commands
title: getbit 命令
permalink: commands/getbit.html
disqusIdentifier: command_getbit
disqusUrl: http://redis.cn/commands/getbit.html
commandsType: strings
discuzTid: 969
---

返回key对应的string在offset处的bit值 当offset超出了字符串长度的时候，这个字符串就被假定为由0比特填充的连续空间。当key不存在的时候，它就认为是一个空字符串，所以offset总是超出范围，然后value也被认为是由0比特填充的连续空间。到内存分配。

## 返回值

[integer-reply](/topics/protocol.html#integer-reply)：在offset处的bit值

## 例子

	redis> SETBIT mykey 7 1
	(integer) 0
	redis> GETBIT mykey 0
	(integer) 0
	redis> GETBIT mykey 7
	(integer) 1
	redis> GETBIT mykey 100
	(integer) 0
	redis> 