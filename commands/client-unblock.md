---
layout: commands
title: client-unblock 命令
permalink: commands/client-unblock.html
disqusIdentifier: command_unblock
disqusUrl: http://redis.cn/commands/client-unblock.html
commandsType: server
discuzTid: 13903
---

当客户端因为执行具有阻塞功能的命令如`BRPOP`、`XREAD`或者`WAIT`被阻塞时，该命令可以通过其他连接解除客户端的阻塞

默认情况下，当命令timeout设置超时时，客户端会被解除阻塞。当提供了额外(可选)的设置，可以确定解除阻塞的类型，可以是**TIMEOUT**或者**ERROR**类型。当时*ERROR*类型时，客户端阻塞被强制解除同时收到如下明确报错信息：
    -UNBLOCKED client unblocked via CLIENT UNBLOCK	
注意：当然，通常情况下错误信息不会完全一样，但是错误代码中一定包含`-UNBLOCKED`字样

这个命令，在仅能使用较少连接但要监控大量keys的时候特别有用。例如使用命令`XREAD`和很少连接监控多个消息流，在某个时间点，信息流消费进程
需要新增一个消息流key的监控，为了避免使用更多连接，最好的方法是从连接池中停掉一个阻塞的连接，增加新的要监控的key，在重启该阻塞命令即可。

我们使用如下操作流程来实现实现这种操作：
管理进程使用额外的连接*control connection*在必要时执行`CLIENT UNBLOCK`,同时，在某一连接执行阻塞命令之前，进程执行`CLIENT ID`获取该连接的ID值。
当需要监控一个新增的key或者取消一个key的监控时，通过在*control connection*中执行`CLIENT UNBLOCK`+ 上一步获取ID值来解除相关连接的阻塞。监控key 调整后再次
执行阻塞命令即可。

上述例子以Redis streams为例介绍了操作流程，该操作流程也可以应用到其他数据结构类型

## 例子

```
Connection A (blocking connection):
> CLIENT ID
2934
> BRPOP key1 key2 key3 0
(client is blocked)

... Now we want to add a new key ...

Connection B (control connection):
> CLIENT UNBLOCK 2934
1

Connection A (blocking connection):
... BRPOP reply with timeout ...
NULL
> BRPOP key1 key2 key3 key4 0
(client is blocked again)
```
