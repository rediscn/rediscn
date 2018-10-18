---
layout: commands
title: setnx 命令
permalink: commands/setnx.html
disqusIdentifier: command_setnx
disqusUrl: http://redis.cn/commands/setnx.html
commandsType: strings
discuzTid: 1050
tranAuthor: menwengit
---

将`key`设置值为`value`，如果`key`不存在，这种情况下等同[SET](/commands/set.html)命令。
当`key`存在时，什么也不做。`SETNX`是"**SET** if **N**ot e**X**ists"的简写。

## 返回值

[Integer reply](/topics/protocol.html#integer-reply), 特定值:

* `1` 如果key被设置了
* `0` 如果key没有被设置

## 例子

	redis> SETNX mykey "Hello"
	(integer) 1
	redis> SETNX mykey "World"
	(integer) 0
	redis> GET mykey
	"Hello"
	redis> 

## Design pattern: Locking with `!SETNX`

### 设计模式：使用`!SETNX`加锁

**Please note that:**

**请注意：**

1. 不鼓励以下模式来实现[the Redlock algorithm](http://redis.cn/topics/distlock.html) ，该算法实现起来有一些复杂，但是提供了更好的保证并且具有容错性。

2. 无论如何，我们保留旧的模式，因为肯定存在一些已实现的方法链接到该页面作为引用。而且，这是一个有趣的例子说明Redis命令能够被用来作为编程原语的。

3. 无论如何，即使假设一个单例的加锁原语，但是从 2.6.12 开始，可以创建一个更加简单的加锁原语，相当于使用`SET`命令来获取锁，并且用一个简单的 Lua 脚本来释放锁。该模式被记录在`SET`命令的页面中。

也就是说，`SETNX`能够被使用并且以前也在被使用去作为一个加锁原语。例如，获取键为`foo`的锁，客户端可以尝试一下操作：


	SETNX lock.foo <current Unix time + lock timeout + 1>


如果客户端获得锁，`SETNX`返回`1`，那么将`lock.foo`键的Unix时间设置为不在被认为有效的时间。客户端随后会使用`DEL lock.foo`去释放该锁。

如果`SETNX`返回`0`，那么该键已经被其他的客户端锁定。如果这是一个非阻塞的锁，才能立刻返回给调用者，或者尝试重新获取该锁，直到成功或者过期超时。

## 处理死锁

以上加锁算法存在一个问题：如果客户端出现故障，崩溃或者其他情况无法释放该锁会发生什么情况？这是能够检测到这种情况，因为该锁包含一个Unix时间戳，如果这样一个时间戳等于当前的Unix时间，该锁将不再有效。

当以下这种情况发生时，我们不能调用`DEL`来删除该锁，并且尝试执行一个`SETNX`，因为这里存在一个竞态条件，当多个客户端察觉到一个过期的锁并且都尝试去释放它。

* C1 和 C2 读`lock.foo`检查时间戳，因为他们执行完`SETNX`后都被返回了`0`，因为锁仍然被 C3 所持有，并且 C3 已经崩溃。
* C1 发送`DEL lock.foo`
* C1 发送`SETNX lock.foo`命令并且成功返回
* C2 发送`DEL lock.foo`
* C2 发送`SETNX lock.foo`命令并且成功返回
* **错误**：由于竞态条件导致 C1 和 C2 都获取到了锁

幸运的是，可以使用以下的算法来避免这种情况，请看 C4 客户端所使用的好的算法：

*   C4 发送`SETNX lock.foo`为了获得该锁
*   已经崩溃的客户端 C3 仍然持有该锁，所以Redis将会返回`0`给 C4
*   C4 发送`GET lock.foo`检查该锁是否已经过期。如果没有过期，C4 客户端将会睡眠一会，并且从一开始进行重试操作
*   另一种情况，如果因为 `lock.foo`键的Unix时间小于当前的Unix时间而导致该锁已经过期，C4 会尝试执行以下的操作：


    	GETSET lock.foo <current Unix timestamp + lock timeout + 1>


*   由于`GETSET` 的语意，C4会检查已经过期的旧值是否仍然存储在`lock.foo`中。如果是的话，C4 会获得锁
*   如果另一个客户端，假如为 C5 ，比 C4 更快的通过`GETSET`操作获取到锁，那么 C4 执行`GETSET`操作会被返回一个不过期的时间戳。C4 将会从第一个步骤重新开始。请注意：即使 C4 在将来几秒设置该键，这也不是问题。


为了使这种加锁算法更加的健壮，持有锁的客户端应该总是要检查是否超时，保证使用`DEL`释放锁之前不会过期，因为客户端故障的情况可能是复杂的，不止是崩溃，还会阻塞一段时间，阻止一些操作的执行，并且在阻塞恢复后尝试执行`DEL`（此时，该LOCK已经被其他客户端所持有）