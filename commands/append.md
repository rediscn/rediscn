---
layout: commands
title: APPEND命令 -- Redis中文资料站
permalink: commands/append.html
disqusIdentifier: command_append
disqusUrl: http://redis.cn/commands/append.html
commandsType: strings
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

## 模式：时间序列(Time series)

The [APPEND](/ommands/append.html) command can be used to create a very compact representation of a list of fixed-size samples, usually referred as time series. Every time a new sample arrives we can store it using the command

	APPEND timeseries "fixed-size sample"

Accessing individual elements in the time series is not hard:

- [STRLEN](commands/strlen.html) can be used in order to obtain the number of samples.
- [GETRANGE](/commands/getrange.html) allows for random access of elements. If our time series have associated time information we can easily implement a binary search to get range combining [GETRANGE](/commands/getrange.html) with the Lua scripting engine available in Redis 2.6.
- [SETRANGE](/commands/setrange.html) can be used to overwrite an existing time series.

The limitation of this pattern is that we are forced into an append-only mode of operation, there is no way to cut the time series to a given size easily because Redis currently lacks a command able to trim string objects. However the space efficiency of time series stored in this way is remarkable.

Hint: it is possible to switch to a different key based on the current Unix time, in this way it is possible to have just a relatively small amount of samples per key, to avoid dealing with very big keys, and to make this pattern more friendly to be distributed across many Redis instances.

An example sampling the temperature of a sensor using fixed-size strings (using a binary format is better in real implementations).

	redis> APPEND ts "0043"
	(integer) 4
	redis> APPEND ts "0035"
	(integer) 8
	redis> GETRANGE ts 0 3
	"0043"
	redis> GETRANGE ts 4 7
	"0035"
	redis> 

