---
layout: commands
title: incr 命令 -- Redis中文资料站
permalink: commands/incr.html
disqusIdentifier: command_incr
disqusUrl: http://redis.cn/commands/incr.html
commandsType: strings
---


对存储在指定`key`的数值执行原子的加1操作。

如果指定的key不存在，那么在执行incr操作之前，会先将它的值设定为`0`。

如果指定的key中存储的值不是字符串类型（fix：）或者存储的字符串类型不能表示为一个整数，

那么执行这个命令时服务器会返回一个错误(eq:(error) ERR value is not an integer or out of range)。

这个操作仅限于64位的有符号整型数据。

**注意**: 由于redis并没有一个明确的类型来表示整型数据，所以这个操作是一个字符串操作。

执行这个操作的时候，key对应存储的字符串被解析为10进制的**64位有符号整型数据**。

事实上，Redis 内部采用整数形式（Integer representation）来存储对应的整数值，所以对该类字符串值实际上是用整数保存，也就不存在存储整数的字符串表示（String representation）所带来的额外消耗。


## 返回值

@integer-reply: the value of `key` after the increment

[integer-reply](/topics/protocol.html#integer-reply):执行递增操作后`key`对应的值。

## 例子

	redis> SET mykey "10"
	OK
	redis> INCR mykey
	(integer) 11
	redis> GET mykey
	"11"
	redis> 


## 实例：计数器

Redis的原子递增操作最常用的使用场景是计数器。

使用思路是：每次有相关操作的时候，就向Redis服务器发送一个incr命令。

例如这样一个场景：我们有一个web应用，我们想记录每个用户每天访问这个网站的次数。


web应用只需要通过拼接用户id和代表当前时间的字符串作为key，每次用户访问这个页面的时候对这个key执行一下incr命令。

这个场景可以有很多种扩展方法:

* 通过结合使用`INCR`和[EXPIRE](/commands/expire.html)命令，可以实现一个只记录用户在指定间隔时间内的访问次数的计数器
* 客户端可以通过[GETSET](/commands/getset.html)命令获取当前计数器的值并且重置为0
* 通过类似于[DECR](/commands/decr.html)或者[INCRBY](/commands/incrby.html)等原子递增/递减的命令，可以根据用户的操作来增加或者减少某些值
  比如在线游戏，需要对用户的游戏分数进行实时控制，分数可能增加也可能减少。

## 实例: 限速器

限速器是一种可以限制某些操作执行速率的特殊场景。

传统的例子就是限制某个公共api的请求数目。

假设我们要解决如下问题：限制某个api每秒每个ip的请求次数不超过10次。

我们可以通过incr命令来实现两种方法解决这个问题。

## 实例: 限速器 1

更加简单和直接的实现如下：

	FUNCTION LIMIT_API_CALL(ip)
	ts = CURRENT_UNIX_TIME()
	keyname = ip+":"+ts
	current = GET(keyname)
	IF current != NULL AND current > 10 THEN
	    ERROR "too many requests per second"
	ELSE
	    MULTI
	        INCR(keyname,1)
	        EXPIRE(keyname,10)
	    EXEC
	    PERFORM_API_CALL()
	END

这种方法的基本点是每个ip每秒生成一个可以记录请求数的计数器。

但是这些计数器每次递增的时候都设置了10秒的过期时间，这样在进入下一秒之后，redis会自动删除前一秒的计数器。

注意上面伪代码中我们用到了[MULTI](/commands/multi.html)和[EXEC](/commands/exec.html)命令，将递增操作和设置过期时间的操作放在了一个事务中，
从而保证了两个操作的原子性。

## 实例: 限速器 2

另外一个实现是对每个ip只用一个单独的计数器（不是每秒生成一个），但是需要注意避免竟态条件。
我们会对多种不同的变量进行测试。

	FUNCTION LIMIT_API_CALL(ip):
	current = GET(ip)
	IF current != NULL AND current > 10 THEN
	    ERROR "too many requests per second"
	ELSE
	    value = INCR(ip)
	    IF value == 1 THEN
	        EXPIRE(value,1)
	    END
	    PERFORM_API_CALL()
	END

上述方法的思路是，从第一个请求开始设置过期时间为1秒。如果1秒内请求数超过了10个，那么会抛异常。

否则，计数器会清零。

**上述代码中**，可能会进入竞态条件，比如客户端在执行INCR之后，没有成功设置[EXPIRE](/commands/expire.html)时间。这个ip的key
会造成内存泄漏，直到下次有同一个ip发送相同的请求过来。

把上述INCR和[EXPIRE](/commands/expire.html)命令写在lua脚本并执行[EVAL](/commands/eval.html)命令可以避免上述问题（只有redis版本>＝2.6才可以使用）

	local current
	current = redis.call("incr",KEYS[1])
	if tonumber(current) == 1 then
	    redis.call("expire",KEYS[1],1)
	end

还可以通过使用redis的list来解决上述问题避免进入竞态条件。

实现代码更加复杂并且利用了一些redis的新的feature，可以记录当前请求的客户端ip地址。这个有没有好处
取决于应用程序本身。

	FUNCTION LIMIT_API_CALL(ip)
	current = LLEN(ip)
	IF current > 10 THEN
	    ERROR "too many requests per second"
	ELSE
	    IF EXISTS(ip) == FALSE
	        MULTI
	            RPUSH(ip,ip)
	            EXPIRE(ip,1)
	        EXEC
	    ELSE
	        RPUSHX(ip,ip)
	    END
	    PERFORM_API_CALL()
	END

The `RPUSHX` command only pushes the element if the key already exists.

[RPUSHX](/commands.rpushx.html)命令会往list中插入一个元素，如果key存在的话

上述实现也可能会出现竞态，比如我们在执行[EXISTS](/commands/exists.html)指令之后返回了false，但是另外一个客户端创建了这个key。

后果就是我们会少记录一个请求。但是这种情况很少出现，所以我们的请求限速器还是能够运行良好的。
