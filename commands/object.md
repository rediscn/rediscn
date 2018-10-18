---
layout: commands
title: object 命令
permalink: commands/object.html
disqusIdentifier: command_object
disqusUrl: http://redis.cn/commands/object.html
commandsType: keys
discuzTid: 1010
---

`OBJECT` 命令可以在内部调试(debugging)给出keys的内部对象，它用于检查或者了解你的keys是否用到了特殊编码 的数据类型来存储空间z。 当redis作为缓存使用的时候，你的应用也可能用到这些由`OBJECT`命令提供的信息来决定应用层的key的驱逐策略(eviction policies)

`OBJECT` 支持多个子命令:

- OBJECT REFCOUNT <key>该命令主要用于调试(debugging)，它能够返回指定key所对应value被引用的次数.
- OBJECT ENCODING <key> 该命令返回指定key对应value所使用的内部表示(representation)(译者注：也可以理解为数据的压缩方式).
- OBJECT IDLETIME <key> 该命令返回指定key对应的value自被存储之后空闲的时间，以秒为单位(没有读写操作的请求) ，这个值返回以10秒为单位的秒级别时间，这一点可能在以后的实现中改善

###对象可以用多种方式编码:

- 字符串可以被编码为 raw (常规字符串) 或者int (用字符串表示64位无符号整数这种编码方式是为了节省空间).
- 列表类型可以被编码为ziplist 或者 linkedlist. ziplist 是为了节省较小的列表空间而设计一种特殊编码方式.
- 集合被编码为 intset 或者 hashtable. intset 是为了存储数字的较小集合而设计的一种特殊编码方式.
- 哈希表可以被编码为 zipmap 或者hashtable. zipmap 是专为了较小的哈希表而设计的一种特殊编码方式
- 有序集合被编码为ziplist 或者 skiplist 格式. ziplist可以表示较小的有序集合, skiplist 表示任意大小多的有序集合.

一旦你做了一个操作让redis无法再使用那些节省空间的编码方式，它将自动将那些特殊的编码类型转换为普通的编码类型.

## 返回值

不同的子命令会对应不同的返回值.

- refcount 和 idletime 返回整数.
- encoding 返回编码类型.

如果你尝试检查的参数缺失，将会返回为空

#例子

	redis> lpush mylist "Hello World"
	(integer) 4
	redis> object refcount mylist
	(integer) 1
	redis> object encoding mylist
	"ziplist"
	redis> object idletime mylist
	(integer) 10

接下来的例子你可以看到redis一旦不能够实用节省空间的编码类型时编码方式的改变.

	redis> set foo 1000
	OK
	redis> object encoding foo
	"int"
	redis> append foo bar
	(integer) 7
	redis> get foo
	"1000bar"
	redis> object encoding foo
	"raw"