---
layout: commands
title: APPEND命令
permalink: commands/append.html
disqusIdentifier: command_append
disqusUrl: http://redis.cn/commands/append.html
commandsType: strings
discuzTid: 902
---

如果 `key` 已经存在，并且值为字符串，那么这个命令会把 `value` 追加到原来值（value）的结尾。 如果 `key` 不存在，那么它将首先创建一个空字符串的`key`，再执行追加操作，这种情况 [APPEND](/ommands/append.html) 将类似于 [SET](/ommands/set.html) 操作。


## 返回值

[Integer reply](/topics/protocol.html#integer-reply)：返回append后字符串值（value）的长度。

##例子

	redis> EXISTS mykey
	(integer) 0
	redis> APPEND mykey "Hello"
	(integer) 5
	redis> APPEND mykey " World"
	(integer) 11
	redis> GET mykey
	"Hello World"
	redis>

## 模式：节拍序列(Time series)

[APPEND](/ommands/append.html) 命令可以用来连接一系列固定长度的样例,与使用列表相比这样更加紧凑. 通常会用来记录节拍序列. 每收到一个新的节拍样例就可以这样记录:

	APPEND timeseries "fixed-size sample"

在节拍序列里, 可以很容易地访问序列中的每个元素:

- [STRLEN](commands/strlen.html) 可以用来计算样例个数.
- [GETRANGE](/commands/getrange.html) 允许随机访问序列中的各个元素. 如果序列中有明确的节拍信息, 在Redis 2.6中就可以使用[GETRANGE](/commands/getrange.html)配合Lua脚本来实现一个二分查找算法.
- [SETRANGE](/commands/setrange.html) 可以用来覆写已有的节拍序列.

该模式的局限在于只能做追加操作. Redis目前缺少剪裁字符串的命令, 所以无法方便地把序列剪裁成指定的尺寸. 但是, 节拍序列在空间占用上效率极好.

小贴士: 在键值中组合Unix时间戳, 可以在构建一系列相关键值时缩短键值长度,更优雅地分配Redis实例.

使用定长字符串进行温度采样的例子(在实际使用时,采用二进制格式会更好).

	redis> APPEND ts "0043"
	(integer) 4
	redis> APPEND ts "0035"
	(integer) 8
	redis> GETRANGE ts 0 3
	"0043"
	redis> GETRANGE ts 4 7
	"0035"
	redis>
