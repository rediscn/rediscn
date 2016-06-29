---
layout: commands
title: expire 命令
permalink: commands/expire.html
disqusIdentifier: command_expire
disqusUrl: http://redis.cn/commands/expire.html
commandsType: keys
---

设置`key`的过期时间，超过时间后，将会自动删除该`key`。在Redis的术语中一个`key`的相关超时是不确定的。

超时后只有对`key`执行[DEL](/commands/del.html)命令或者[SET](/commands/set.html)命令或者[GETSET](/commands/getset.html)时才会清除。
这意味着，从概念上讲所有改变`key`的值的操作都会使他清除。
例如，[INCR](/commands/incr.html)递增key的值，执行[LPUSH](/commands/lpush.html)操作，或者用[HSET](/commands/hset.html)改变hash的`field`所有这些操作都会触发删除动作。

使用[PERSIST](/commands/persist.html)命令可以清除超时，使其变成一个永久的`key`。

如果`key`被[RENAME](/commands/rename.html)命令修改，相关的超时时间会转移到新`key`上面。

如果`key`被[RENAME](/commands/rename.html)命令修改，比如原来就存在`Key_A`,然后调用`RENAME Key_B Key_A`命令，这时不管原来`Key_A`是永久的还是设置为超时的，都会由`Key_B`的有效期状态覆盖。

## 刷新过期时间

对已经有过期时间的`key`执行`EXPIRE`操作，将会更新它的过期时间。有很多应用有这种业务场景，例如记录会话的session。

## 返回值

[integer-reply](/topics/protocol.html#integer-reply), 具体的:

* `1` 如果成功设置过期时间。
* `0` 如果`key`不存在或者不能设置过期时间。

## 例子

	redis> SET mykey "Hello"
	OK
	redis> EXPIRE mykey 10
	(integer) 1
	redis> TTL mykey
	(integer) 10
	redis> SET mykey "Hello World"
	OK
	redis> TTL mykey
	(integer) -1
	redis> 

## 案例: Navigation session

想象一下，你有一个网络服务器，你对用户最近访问的N个网页感兴趣，每一个相邻的页面设置超时时间为60秒。在概念上你为这些网页添加Navigation session，如果你的用户，可能包含有趣的信息，他或她正在寻找什么样的产品，你可以推荐相关产品。

你可以使用下面的策略模型，使用这种模式：每次用户浏览网页调用下面的命令：

	MULTI
	RPUSH pagewviews.user:<userid> http://.....
	EXPIRE pagewviews.user:<userid> 60
	EXEC

如果用户60秒没有操作，这个key将会被删除，不到60秒的话，后续网页将会被继续记录。

这个案例很容易用[INCR](/commands/incr.html)代替[RPUSH](/commands/rpush.html)

# 附录: Redis 过期时间

## Keys的过期时间

通常Redis keys创建时没有设置相关过期时间。他们会一直存在，除非使用显示的命令移除，例如，使用[DEL](/commands/del.html)命令。

`EXPIRE`一类命令能关联到一个有额外内存开销的key。当key执行过期操作时，Redis会确保按照规定时间删除他们。

key的过期时间和永久有效性可以通过`EXPIRE`和[PERSIST](/commands/persist.html)命令（或者其他相关命令）来进行更新或者删除过期时间。

## 过期精度

在 Redis 2.4 及以前版本，过期期时间可能不是十分准确，有0-1秒的误差。

从 Redis 2.6 起，过期时间误差缩小到0-1毫秒。

## 过期和持久

Keys的过期时间使用Unix时间戳存储(从Redis 2.6开始以毫秒为单位)。这意味着即使Redis实例不可用，时间也是一直在流逝的。

要想过期的工作处理好，计算机必须采用稳定的时间。
如果你将RDB文件在两台时钟不同步的电脑间同步，有趣的事会发生（所有的 keys装载时就会过期）。

即使正在运行的实例也会检查计算机的时钟，例如如果你设置了一个key的有效期是1000秒，然后设置你的计算机时间为未来2000秒，这时key会立即失效，而不是等1000秒之后。

## Redis如何淘汰过期的keys

Redis keys过期有两种方式：被动和主动方式。

当一些客户端尝试访问它时，key会被发现并主动的过期。

当然，这样是不够的，因为有些过期的keys，永远不会访问他们。
无论如何，这些keys应该过期，所以定时随机测试设置keys的过期时间。所有这些过期的keys将会从密钥空间删除。

具体就是Redis每秒10次做的事情：

1. 测试随机的20个keys进行相关过期检测。
2. 删除所有已经过期的keys。
3. 如果有多于25%的keys过期，重复步奏1.

这是一个平凡的概率算法，基本上的假设是，我们的样本是这个密钥控件，并且我们不断重复过期检测，直到过期的keys的百分百低于25%,这意味着，在任何给定的时刻，最多会清除1/4的过期keys。

## 在复制AOF文件时如何处理过期

为了获得正确的行为而不牺牲一致性，当一个key过期，`DEL`将会随着AOF文字一起合成到所有附加的slaves。在master实例中，这种方法是集中的，并且不存在一致性错误的机会。

然而，当slaves连接到master时，不会独立过期keys（会等到master执行DEL命令），他们任然会在数据集里面存在，所以当slave当选为master时淘汰keys会独立执行，然后成为master。

