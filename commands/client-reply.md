---
layout: commands
title: client-reply 命令
permalink: commands/client-reply.html
disqusIdentifier: command_reply
disqusUrl: http://redis.cn/commands/client-reply.html
commandsType: server
discuzTid: 13902
---
当需要完全禁用redis服务器对客户端的回复时可使用该命令。
当客户端执行命令fire和forget，或者在抽取大量数据或者正在建缓存，新数据在不断传输，这种场景下，客户端会忽略收到的回复，消耗服务器时间和带宽回复客户端，是一种资源浪费

`CLIENT REPLY`命令可对服务器是否回复客户端的命令进行设置。有如下选项
* `ON`. 默认选项，回复客户端每条命令
* `OFF`. 不回复客户端命令
* `SKIP`. 跳过该设置命令后紧跟的一条命令
## 返回值

当执行命令设置为`OFF`或`SKIP`，设置命令收不到任何回复，当设置为 `ON`时，设置命令收到`OK`
[simple-string-reply](/topics/protocol.html#simple-string-reply): `OK`.

