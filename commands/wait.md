---
layout: commands
title: wait 命令
permalink: commands/wait.html
disqusIdentifier: command_wait
disqusUrl: http://redis.cn/commands/wait.html
commandsType: keys
discuzTid: 1075
---

此命令阻塞当前客户端，直到所有以前的写命令都成功的传输和指定的slaves确认。如果超时，指定以毫秒为单位，即使指定的slaves还没有到达，命令任然返回。

命令**始终返回**之前写命令发送的slaves的数量，无论是在指定slaves的情况还是达到超时。


注意点:

1. 当'WAIT'返回时，所有之前的写命令保证接收由`WAIT`返回的slaves的数量。
2. 如果命令呗当做事务的一部分发送，该命令不阻塞，而是只尽快返回先前写命令的slaves的数量。
3. 如果timeout是0那意味着永远阻塞。
4. 由于`WAIT`返回的是在失败和成功的情况下的slaves的数量。客户端应该检查返回的slaves的数量是等于或更大的复制水平。

一致性（Consistency and WAIT）
---

`WAIT` 不能保证Redis强一致：尽管同步复制是复制状态机的一个部分，但是还需要其他条件。不过，在sentinel和Redis群集故障转移中，`WAIT` 能够增强数据的安全性。

如果写操作已经被传送给一个或多个slave节点，当master发生故障我们极大概率(不保证100%)提升一个受到写命令的slave节点为master:不管是Sentinel还是Redis Cluster 都会尝试选slave节点中最优(日志最新)的节点，提升为master。

尽管是选择最优节点，但是仍然会有丢失一个同步写操作可能行。


实现细节
---

因为引入了部分同步，Redis slave节点在ping主节点时会携带已经处理的复制偏移量。
这被用在多个地方：

1. 检测超时的slaves

2. 断开连接后的部分复制

3. 实现`WAIT`

在`WAIT`实现的案例中，当客户端执行完一个写命令后，针对每一个复制客户端，Redis会为其记录写命令产生的复制偏移量。当执行命令`WAIT`时，Redis会检测
slaves节点是否已确认完成该操作或更新的操作。

## 返回值

[integer-reply](/topics/protocol.html#integer-reply): 当前连接的写操作会产生日志偏移，该命令会返回已处理至该偏移量的slaves的个数。


## 例子


	> SET foo bar
	OK
	> WAIT 1 0
	(integer) 1
	> WAIT 2 1000
	(integer) 1


在例子中，第一次调用`WAIT`并没有使用超时设置，并且设置写命令传输到一个slave节点，返回成功。第二次使用时，我们设置了超时值并要求写命令传输到两个节点。
因为只有一个slave节点有效，1秒后`WAIT`解除阻塞并返回1--传输成功的slave节点数。
