---
layout: topics
title: REDIS notifications
permalink: topics/notifications.html
disqusIdentifier: topics_notifications
disqusUrl: http://redis.cn/topics/notifications.html
discuzTid: 873
tranAuthor: wangqiang
---

Redis键空间通知
===

**重要：**键空间通知功能自2.8.0版本开始可用。

功能概述
---

键空间通知允许客户端订阅发布/订阅频道，以便以某种方式接收影响Redis数据集的事件。

可能接收的事件示例如下：

* 所有影响给定键的命令。
* 所有接收LPUSH操作的键。
* 所有在数据库0中到期的键。

事件使用Redis的普通发布/订阅层传递，因此实现了发布/订阅的客户端无需修改即可使用此功能。

由于Redis的发布/订阅是*fire and forget*，因此如果你的应用要求**可靠的事件通知**，目前还不能使用这个功能，也就是说，如果你的发布/订阅客户端断开连接，并在稍后重连，那么所有在客户端断开期间发送的事件将会丢失。

将来有计划允许更可靠的事件传递，但可能会在更一般的层面上解决，要么为发布/订阅本身带来可靠性，要么允许Lua脚本拦截发布/订阅的消息以执行推送等操作，就像往队列里推送事件一样。

事件类型
---

键空间通知的实现是为每一个影响Redis数据空间的操作发送两个不同类型的事件。例如，在数据库`0`中名为`mykey`的键上执行`DEL`操作，将触发两条消息的传递，完全等同于下面两个`PUBLISH`命令：


    PUBLISH __keyspace@0__:mykey del
    PUBLISH __keyevent@0__:del mykey

以上很容易看到，一个频道允许监听所有以键`mykey`为目标的所有事件，以及另一个频道允许获取有关所有`DEL`操作目标键的信息。

第一种事件，在频道中使用`keyspace`前缀的被叫做**键空间通知**，第二种，使用`keyevent`前缀的，被叫做**键事件通知**。

在以上例子中，为键`mykey`生成了一个`del`事件。
会发生什么：

* 键空间频道接收到的消息是事件的名称。
* 键事件频道接收到的消息是键的名称。

可以只启用其中一种通知，以便只传递我们感兴趣的事件子集。

配置
---

默认情况下，键空间事件通知是不启用的，因为虽然不太明智，但该功能会消耗一些CPU。可以使用redis.conf中的`notify-keyspace-events`或者使用**CONFIG SET**命令来开启通知。

将参数设置为空字符串会禁用通知。
为了开启通知功能，使用了一个非空字符串，由多个字符组成，每一个字符都有其特殊的含义，具体参见下表：

    K     键空间事件，以__keyspace@<db>__前缀发布。
    E     键事件事件，以__keyevent@<db>__前缀发布。
    g     通用命令（非类型特定），如DEL，EXPIRE，RENAME等等
    $     字符串命令
    l     列表命令
    s     集合命令
    h     哈希命令
    z     有序集合命令
    x     过期事件（每次键到期时生成的事件）
    e     被驱逐的事件（当一个键由于达到最大内存而被驱逐时产生的事件）
    A     g$lshzxe的别名，因此字符串AKE表示所有的事件。

字符串中应当至少存在`K`或者`E`，否则将不会传递事件，不管字符串中其余部分是什么。

例如，要为列表开启键空间事件，则配置参数必须设置为`Kl`，以此类推。

字符串`KEA`可以用于开启所有可能的事件。

不同的命令生成的事件
---

根据以下列表，不同的命令产生不同种类的事件。

* `DEL`命令为每一个删除的key生成一个`del`事件。
* `RENAME`生成两个事件，一个是为源key生成的`rename_from`事件，一个是为目标key生成的`rename_to`事件。
* `EXPIRE`在给一个键设置有效期时，会生成一个`expire`事件，或者每当设置有效期导致键被删除时，生成`expired`事件（请查阅`EXPIRE`文档以获取更多信息）。
* `SORT`会在使用`STORE`选项将结果存储到新键时，生成一个`sortstore`事件。如果结果列表为空，且使用了`STORE`选项，并且已经存在具有该名称的键时，那个键将被删除，因此在这种场景下会生成一个`del`事件。
* `SET`以及所有其变种（`SETEX`，`SETNX`，`GETSET`）生成`set`事件。但是`SETEX`还会生成一个`expire`事件。
* `MSET`为每一个key生成一个`set`事件。
* `SETRANGE`生成一个`setrange`事件。
* `INCR`、`DECR`、`INCRBY`、`DECRBY`命令都生成`incrby`事件。
* `INCRBYFLOAT`生成一个`incrbyfloat`事件。
* `APPEND`生成一个`append`事件。
* `LPUSH`和`LPUSHX`生成一个`lpush`事件，即使在可变参数情况下也是如此。
* `RPUSH`和`RPUSHX`生成一个`rpush`事件，即使在可变参数情况下也是如此。
* `RPOP`生成`rpop`事件。此外，如果键由于列表中的最后一个元素弹出而被删除，则会生成一个`del`事件。
* `LPOP`生成`lpop`事件。此外，如果键由于列表中的最后一个元素弹出而被删除，则会生成一个`del`事件。
* `LINSERT`生成一个`linsert`事件。
* `LSET`生成一个`lset`事件。
* `LTRIM`生成`ltrim`事件，此外，如果结果列表为空或者键被移除，将会生成一个`del`事件。
* `RPOPLPUSH`和`BRPOPLPUSH`生成`rpop`事件和`lpush`事件。这两种情况下，顺序都将得到保证（`lpush`事件将总是在`rpop`事件之后传递）。此外，如果结果列表长度为零且键被删除，则会生成一个`del`事件。
* `HSET`、`HSETNX`以及`HMSET`都生成一个`hset`事件。
* `HINCRBY`生成一个`hincrby`事件。
* `HINCRBYFLOAT`生成一个`hincrbyfloat`事件。
* `HDEL`生成一个`hdel`事件，此外，如果结果哈希集为空或者键被移除，将生成一个`del`事件。
* `SADD`生成一个`sadd`事件，即使在可变参数情况下也是如此。
* `SREM`生成一个`srem`事件，此外，如果结果集合为空或者键被移除，将生成一个`del`事件。
* `SMOVE`为每一个源key生成一个`srem`事件，以及为每一个目标key生成一个`sadd`事件。
* `SPOP`生成一个`spop`事件，此外，如果结果集合为空或者键被移除，将生成一个`del`事件。
* `SINTERSTORE`、`SUNIONSTORE`、`SDIFFSTORE`分别生成`sinterstore`、`sunionostore`、`sdiffstore`事件。在特殊情况下，结果集是空的，并且存储结果的键已经存在，因为删除了键，所以会生成`del`事件。
* `ZINCR`生成一个`zincr`事件。
* `ZADD`生成一个`zadd`事件，即使添加了多个元素。
* `ZREM`生成一个`zrem`事件，即使删除了多个元素。当结果有序集合为空且生成了键，则会生成额外的`del`事件。
* `ZREMBYSCORE`生成一个`zrembyscore`事件。当结果有序集合为空且生成了键，则会生成额外的`del`事件。
* `ZREMBYRANK`生成一个`zrembyrank`事件。当结果有序集合为空且生成了键，则会生成额外的`del`事件。
* `ZINTERSTORE`和`ZUNIONSTORE`分别生成`zinterstore`和`zunionstore`事件。在特殊情况下，结果有序集合是空的，并且存储结果的键已经存在，因为删除了键，所以会生成`del`事件。
* 每次一个拥有过期时间的键由于过期而从数据集中移除时，将生成一个`expired`事件。
* 每次一个键由于`maxmemory`策略而被从数据集中驱逐，以便释放内存时，将生成一个`evicted`事件。

**重要** 所有命令仅在真正修改目标键时才生成事件。例如，使用`SREM`命令从集合中删除一个不存在的元素将不会改变键的值，因此不会生成任何事件。

如果对某个命令如何生成事件有疑问，最简单的方法是自己观察：

    $ redis-cli config set notify-keyspace-events KEA
    $ redis-cli --csv psubscribe '__key*__:*'
    Reading messages... (press Ctrl-C to quit)
    "psubscribe","__key*__:*",1

此时，在另外一个终端使用`redis-cli`发送命令到Redis服务器，并观察生成的事件：

    "pmessage","__key*__:*","__keyspace@0__:foo","set"
    "pmessage","__key*__:*","__keyevent@0__:set","foo"
    ...

过期事件的时间安排
---

设置了生存时间的键由Redis以两种方式过期：

* 当命令访问键时，发现键已过期。
* 通过后台系统在后台逐步查找过期的键，以便能够收集那些从未被访问的键。

当通过以上系统之一访问键且发现键已经过期时，将生成`expired`事件。因此无法保证Redis服务器在键过期的那一刻同时生成`expired`事件。

如果没有命令不断地访问键，并且有很多键都有关联的TTL，那么在键的生存时间降至零到生成`expired`事件之间，将会有明显的延迟。

基本上，**`expired`事件是在Redis服务器删除键的时候生成的**，而不是在理论上生存时间达到零值时生成的。
