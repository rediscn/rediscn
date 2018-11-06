---
layout: commands
title: memory-usage 命令
permalink: commands/memory-usage.html
disqusIdentifier: command_memory-usage
disqusUrl: http://redis.cn/commands/memory-usage.html
commandsType: server
discuzTid: 13910
---

命令`MEMORY USAGE` 给出一个key和它值在RAM中占用的字节数

返回的结果是key的值以及为管理该key分配的内存总字节数

对于嵌套数据类型，可以使用选项`SAMPLES`，其中COUNT表示抽样的元素个数，默认值为5。当需要抽样所有元素时，使用`SAMPLES 0`

## 例子

在redis 64位版本V4.0.1 和**jemalloc**做内存分配器的情况下，空string 可定义如下： 
```
> SET "" ""
OK
> MEMORY USAGE ""
(integer) 51
```
如上，实际数据为空，但是存储时仍然耗费了一些内存，这些内存用于Redis 服务器维护内部数据结构。随着key和value的增大，内存使用量和key 大小基本成
线性关系。

```
> SET foo bar
OK
> MEMORY USAGE foo
(integer) 54
> SET cento 01234567890123456789012345678901234567890123
45678901234567890123456789012345678901234567890123456789
OK
127.0.0.1:6379> MEMORY USAGE cento
(integer) 153
```

@return

@integer-reply: the memory usage in bytes 