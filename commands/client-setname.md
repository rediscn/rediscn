---
layout: commands
title: client-setname 命令
permalink: commands/client-setname.html
disqusIdentifier: command_client-setname
disqusUrl: http://redis.cn/commands/client-setname.html
commandsType: server
discuzTid: 916
---

The `CLIENT SETNAME` command assigns a name to the current connection.
命令`CLIENT SETNAME` 为当前连接分配一个名字。

The assigned name is displayed in the output of `CLIENT LIST` so that it is possible to identify the client that performed a given connection.
这个名字会显示在`CLIENT LIST`命令的结果中， 用于识别当前正在与服务器进行连接的客户端。

For instance when Redis is used in order to implement a queue, producers and consumers of messages may want to set the name of the connection according to their role.
举个例子， 在使用 Redis 构建队列（queue）时， 可以根据连接负责的任务（role）， 为信息生产者（producer）和信息消费者（consumer）分别设置不同的名字。
There is no limit to the length of the name that can be assigned if not the usual limits of the Redis string type (512 MB). However it is not possible to use spaces in the connection name as this would violate the format of the `CLIENT LIST` reply.
名字使用 Redis 的字符串类型来保存， 最大可以占用 512 MB 。 另外， 为了避免和`CLIENT LIST` 命令的输出格式发生冲突， 名字里不允许使用空格。

It is possible to entirely remove the connection name setting it to the empty string, that is not a valid connection name since it serves to this specific purpose.
要移除一个连接的名字， 可以将连接的名字设为空字符串 "" 。
The connection name can be inspected using `CLIENT GETNAME`.
使用 `CLIENT GETNAME` 命令可以取出连接的名字。

Every new connection starts without an assigned name.
新创建的连接默认是没有名字的。

Tip: setting names to connections is a good way to debug connection leaks due to bugs in the application using Redis.
在 Redis 应用程序发生连接泄漏时，为连接设置名字是一种很好的 debug 手段。
@return

@simple-string-reply: `OK` if the connection name was successfully set.
@simple-string-reply: 连接名称设置成功返回`OK`.
