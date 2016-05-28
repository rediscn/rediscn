---
layout: commands
title: client-kill 命令
permalink: commands/client-kill.html
disqusIdentifier: command_client-kill
disqusUrl: http://redis.cn/commands/client-kill.html
commandsType: server
---

`CLIENT KILL`关闭一个指定的连接。在Redis2.8.11时可以根据客户端地址关闭指定连接，关闭方式如下：

    CLIENT KILL addr:port

`ip:port`应该是`CLIENT LIST` 命令里面列出的客户端连接之一。

然而，从Redis 2.8.12开始，这个命令改为如下格式：

    CLIENT KILL <filter> <value> ... ... <filter> <value>

新的格式可以根据不同属性杀死客户端而不是只按地址杀死。他们有以下一些格式：

* `CLIENT KILL ADDR ip:port`. 和旧版的三个参数时的行为完全一样。
* `CLIENT KILL ID client-id`. 可以通过唯一`ID`字段杀死一个客户端，唯一`ID`可以通过Redis2.8.12的`CLIENT LIST`命令查询。
* `CLIENT KILL TYPE type`, 这里的 *type* 可以是 `normal`, `slave`, `pubsub`。 这将关闭所有特殊类的客户端. 请注意被认为是属于正常类的客户端将会被`MONITOR`命令监视到。
* `CLIENT KILL SKIPME yes/no`. By default this option is set to `yes`, that is, the client calling the command will not get killed, however setting this option to `no` will have the effect of also killing the client calling the command.

It is possible to provide multiple filters at the same time. The command will handle multiple filters via logical AND. For example:

    CLIENT KILL addr 127.0.0.1:6379 type slave

is valid and will kill only a slaves with the specified address. This format containing multiple filters is rarely useful currently.

When the new form is used the command no longer returns `OK` or an error, but instead the number of killed clients, that may be zero.

## CLIENT KILL and Redis Sentinel

Recent versions of Redis Sentinel (Redis 2.8.12 or greater) use CLIENT KILL
in order to kill clients when an instance is reconfigured, in order to
force clients to perform the handshake with one Sentinel again and update
its configuration.

## Notes

Due to the single-threaded nature of Redis, it is not possible to
kill a client connection while it is executing a command. From
the client point of view, the connection can never be closed
in the middle of the execution of a command. However, the client
will notice the connection has been closed only when the
next command is sent (and results in network error).

@return

When called with the three arguments format:

@simple-string-reply: `OK` if the connection exists and has been closed

When called with the filter / value format:

@integer-reply: the number of clients killed.
