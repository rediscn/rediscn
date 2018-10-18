---
layout: commands
title: bitop 命令
permalink: commands/bitop.html
disqusIdentifier: command_bitop
disqusUrl: http://redis.cn/commands/bitop.html
commandsType: strings
discuzTid: 907
---

对一个或多个保存二进制位的字符串 key 进行位元操作，并将结果保存到 destkey 上。

`BITOP` 命令支持 AND 、 OR 、 NOT 、 XOR 这四种操作中的任意一种参数：


* `BITOP AND destkey srckey1 srckey2 srckey3 ... srckeyN` ，对一个或多个 key 求逻辑并，并将结果保存到 destkey 。
* `BITOP OR  destkey srckey1 srckey2 srckey3 ... srckeyN`，对一个或多个 key 求逻辑或，并将结果保存到 destkey 。
* `BITOP XOR destkey srckey1 srckey2 srckey3 ... srckeyN`，对一个或多个 key 求逻辑异或，并将结果保存到 destkey 。
* `BITOP NOT destkey srckey`，对给定 key 求逻辑非，并将结果保存到 destkey 。

除了 NOT 操作之外，其他操作都可以接受一个或多个 key 作为输入。

执行结果将始终保持到`destkey`里面。

## 处理不同长度的字符串

当 BITOP 处理不同长度的字符串时，较短的那个字符串所缺少的部分会被看作 0 。

空的 key 也被看作是包含 0 的字符串序列。


## 返回值

[Integer reply](/topics/protocol.html#integer-reply)

保存到 destkey 的字符串的长度，和输入 key 中最长的字符串长度相等。

## 例子

	redis> SET key1 "foobar"
	OK
	redis> SET key2 "abcdef"
	OK
	redis> BITOP AND dest key1 key2
	(integer) 6
	redis> GET dest
	"`bc`ab"
	redis>

## 模式：使用 bitop 实现用户上线次数统计

`BITOP`是对[BITCOUNT](/commands/bitcount.html)命令一个很好的补充。

不同的bitmaps进行组合操作可以获得目标bitmap以进行人口统计操作。

[Fast easy realtime metrics using Redis
bitmaps](http://blog.getspool.com/2011/11/29/fast-easy-realtime-metrics-using-redis-bitmaps)这篇文章介绍了一个有趣的用例。

## 性能

`BITOP`可能是一个缓慢的命令，它的时间复杂度是O(N)。
在处理长字符串时应注意一下效率问题。

对于实时的指标和统计，涉及大输入一个很好的方法是
使用bit-wise操作以避免阻塞主实例。
