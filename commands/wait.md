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

Note that `WAIT` does not make Redis a strongly consistent store: while synchronous replication is part of a replicated state machine, it is not the only thing needed. However in the context of Sentinel or Redis Cluster failover, `WAIT` improves the real world data safety.

Specifically if a given write is transferred to one or more slaves, it is more likely (but not guaranteed) that if the master fails, we'll be able to promote, during a failover, a slave that received the write: both Sentinel and Redis Cluster will do a best-effort attempt to promote the best slave among the set of available slaves.

However this is just a best-effort attempt so it is possible to still lose a write synchronously replicated to multiple slaves.

Implementation details
---

Since the introduction of partial resynchronization with slaves (PSYNC feature)
Redis slaves asynchronously ping their master with the offset they already
processed in the replication stream. This is used in multiple ways:

1. Detect timed out slaves.
2. Perform a partial resynchronization after a disconnection.
3. Implement `WAIT`.

In the specific case of the implementation of `WAIT`, Redis remembers, for each client, the replication offset of the produced replication stream when a given
write command was executed in the context of a given client. When `WAIT` is
called Redis checks if the specified number of slaves already acknowledged
this offset or a greater one.

@return

@integer-reply: The command returns the number of slaves reached by all the writes performed in the context of the current connection.

@examples

```
> SET foo bar
OK
> WAIT 1 0
(integer) 1
> WAIT 2 1000
(integer) 1
```

In the following example the first call to `WAIT` does not use a timeout and asks for the write to reach 1 slave. It returns with success. In the second attempt instead we put a timeout, and ask for the replication of the write to two slaves. Since there is a single slave available, after one second `WAIT` unblocks and returns 1, the number of slaves reached.
