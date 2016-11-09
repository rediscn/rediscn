---
layout: commands
title: sort 命令
permalink: commands/sort.html
disqusIdentifier: command_sort
disqusUrl: http://redis.cn/commands/sort.html
commandsType: keys
discuzTid: 1060
---

返回或存储`key`的[list][tdtl]、 [set][tdts] 或[sorted set][tdtss] 中的元素。默认是按照数值类型排序的，并且按照两个元素的双精度浮点数类型值进行比较。下面是`SORT`的最简形式：

[tdtl]: /topics/data-types#lists
[tdts]: /topics/data-types#set
[tdtss]: /topics/data-types#sorted-sets

```
SORT mylist
```

假设`mylist`是一个数字列表，这条命令将返回一个元素从小到大排序的相同大小列表。如果想从大到小排序，可以使用 `!DESC` 修饰符。

```
SORT mylist DESC
```

当 `mylist` 包含的是字符串值并且需要按照字典顺序排序，可以使用 `ALPHA` 修饰符：

```
SORT mylist ALPHA
```

假设正确地设置了环境变量 `!LC_COLLATE` ，Redis可以感知UTF-8编码。

返回元素的数量可以通过 `LIMIT` 修饰符限制。此修饰符有一个 `offset` 参数，指定了跳过的元素数量；还带有一个 `count` 参数，指定了从 `offset` 开始返回的元素数量。下面的例子将会返回排序后的列表 `mylist` 从第0个元素（`offset` 是从0开始的）开始的10个元素： 

```
SORT mylist LIMIT 0 10
```

几乎所有的修饰符可以一起使用。下述例子将返回按字典顺序降序排序后的前5个元素：

```
SORT mylist LIMIT 0 5 ALPHA DESC
```

## 通过外部key排序

有时我们需要使用外部的key作为权重来排序，而不是使用列表、集合或有序集合中实际的元素值。假设列表 `mylist`包含元素`1`、 `2` 和 `3`，分别代表了存储在`object_1`、`object_2` 和 `object_3`中的对象的唯一ID。当这些对象关联到存储在`weight_1`、 `weight_2` 和 `weight_3` 中的权重后， `SORT`  命令就能使用这些权重按照下述语句来对 `mylist` 排序：

```
SORT mylist BY weight_*
```

`BY` 选项带有一个模式（此例中的 `weight_*` ），用于生成用于排序的 Key 。这些key的名称指向首次与列表(本例中的`1`、 `2` 和 `3`)中元素的实际值出现 `*` 

## 跳过排序的元素 

`BY` 选项可以是一个并不存在的key，这会导致 `SORT` 命令跳过排序操作。这在我们获取未经排序的外部key(参考下文的 `GET` 选项)时非常有用。

```
SORT mylist BY nosort
```

## 获取外部key

前面的例子仅仅是返回排序后的ID。在某些情况下，获取实际的对象而不是他们的ID更加重要(`object_1`、`object_2` 和 `object_3`)。获取存储在一个列表、集合或者有序集合中的key可以使用以下命令：

```
SORT mylist BY weight_* GET object_*
```

`GET` 选项可多次使用，以便获取每一个原始列表、集合或有序集合中元素的key。

还可以通过使用特殊 `#` 模式获取 `GET` 元素本身：

```
SORT mylist BY weight_* GET object_* GET #
```

## 保存排序操作的结果

默认的，`SORT`　命令返回排序后的元素给客户端。使用　`STORE`　选项，可以将结果存储于一个特定的列表中，以代替返回到客户端。

```
SORT mylist BY weight_* STORE resultkey
```

`SORT ... STORE`的一种有趣应用模式，是联合　`EXPIRE`　超时命令返回key，以便在应用中可以缓存`SORT`操作的返回结果。
其他客户端将会使用已缓存的列表，代替每个请求的 `SORT` 调用。当key即将过期时，一个更新版本的缓存将会通过 `SORT ... STORE` 再次创建。

注意，为了正确实现这种模式，很重要的一点是防止多个客户端同时重建缓存。
此时需要使用一些锁（具体的使用 `SETNX`）。

## 在 `BY` 和 `GET`中使用hash

可以在hash的属性上按下述语法使用 `BY` 和 `GET` 选项：

```
SORT mylist BY weight_*->fieldname GET object_*->fieldname
```

字符串 `->` 用于区分key名称和哈希属性的名称。key被替换为上面所记录的，结果key中存储的hash用于获取特定hash的属性。

## 返回值

[array-reply](/topics/protocol.html#array-reply): 返回排序后的元素列表
