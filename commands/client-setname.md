---
layout: commands
title: client-setname 命令
permalink: commands/client-setname.html
disqusIdentifier: command_client-setname
disqusUrl: http://redis.cn/commands/client-setname.html
commandsType: server
discuzTid: 916
---

命令`CLIENT SETNAME` 为当前连接分配一个名字。

这个名字会显示在`CLIENT LIST`命令的结果中， 用于识别当前正在与服务器进行连接的客户端。

举个例子， 在使用 Redis 构建队列（queue）时， 可以根据连接负责的任务（role）， 为信息生产者（producer）和信息消费者（consumer）分别设置不同的名字。

名字使用 Redis 的字符串类型来保存， 最大可以占用 512 MB 。 另外， 为了避免和`CLIENT LIST` 命令的输出格式发生冲突， 名字里不允许使用空格。

要移除一个连接的名字， 可以将连接的名字设为空字符串 "" 。

使用 `CLIENT GETNAME` 命令可以取出连接的名字。

新创建的连接默认是没有名字的。

提示：在 Redis 应用程序发生连接泄漏时，为连接设置名字是一种很好的 debug 手段。

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply): 连接名称设置成功返回`OK`.
