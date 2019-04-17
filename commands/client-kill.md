---
layout: commands
title: client-kill 命令
permalink: commands/client-kill.html
disqusIdentifier: command_client-kill
disqusUrl: http://redis.cn/commands/client-kill.html
commandsType: server
discuzTid: 913
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

可以在执行命令时同时给定多个筛选条件。该命令会使用逻辑AND来处理多个筛选条件，比如：

    CLIENT KILL addr 127.0.0.1:6379 type slave

是可以的，并且只会杀死给定IP地址的的slave。这种包含多个筛选条件的格式目前很少使用。

当使用新的格式时，该命令不再返回`OK`或者错误，而是返回被杀死的客户端个数，有可能为0.

## CLIENT KILL and Redis Sentinel

当前版本的Redis Sentinel 可以在实例被重新配置的时候使用CLIENT KILL 杀死客户端。这样可以强制客户端和一个Sentinel重新连接并更新自己的配置。 

## Notes

因为Redis的单线程属性，不可能在客户端执行命令时杀掉它. 从客户端的角度看，永远无法杀死一个正在执行命令的连接。
但是当客户端发送下一条命令时会意识到连接已被关闭,原因为网络错误。

## 返回值

三参数格式执行命令：

[simple-string-reply](/topics/protocol.html#simple-string-reply): 连接存在并被关闭返回`OK`

过滤/值格式执行命令：

[integer-reply](/topics/protocol.html#integer-reply): 被杀死的客户端个数
