---
layout: commands
title: spop 命令
permalink: commands/spop.html
disqusIdentifier: command_spop
disqusUrl: http://redis.cn/commands/spop.html
commandsType: sets
discuzTid: 1061
tranAuthor: wangqiang
---

从存储在`key`的集合中移除并返回一个或多个随机元素。

此操作与`SRANDMEMBER`类似，它从一个集合中返回一个或多个随机元素，但不删除元素。

`count`参数将在更高版本中提供，但是在2.6、2.8、3.0中不可用。

## 返回值

[bulk-string-reply](/topics/protocol.html#bulk-string-reply)：被删除的元素，或者当`key`不存在时返回`nil`。

## 例子

```cli
SADD myset "one"
SADD myset "two"
SADD myset "three"
SPOP myset
SMEMBERS myset
SADD myset "four"
SADD myset "five"
SPOP myset 3
SMEMBERS myset
```

## 传递count时的行为规范

如果count大于集合内部的元素数量，此命令将会返回整个集合，不会有额外的元素。

## 返回元素的分布

请注意，当你需要保证均匀分布返回的元素时，此命令不适用。更多有关SPOP使用的算法的信息，请查阅Knuth采样和Floyd采样算法。

## count参数扩展

Redis 3.2是第一个可以给`SPOP`传递可选参数`count`的版本，以便在一次调用中取回多个元素。此实现已经在`unstable`分支中可用。

