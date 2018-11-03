---
layout: commands
title: client-reply 命令
permalink: commands/client-reply.html
disqusIdentifier: command_reply
disqusUrl: http://redis.cn/commands/client-reply.html
commandsType: server
discuzTid: 13902
---

Sometimes it can be useful for clients to completely disable replies from the Redis server. 
For example when the client sends fire and forget commands or performs a mass loading of data, 
or in caching contexts where new data is streamed constantly. 
In such contexts to use server time and bandwidth in order to send back replies to clients, 
which are going to be ignored, is considered wasteful.

当需要完全禁用redis服务器对客户端的回复时可使用该命令。
当客户端执行命令fire和forget，或者在抽取大量数据或者正在建缓存新数据在不断传输，在这种场景下，客户端会忽视收到的回复，消耗服务器时间和带宽回复客户端，是一种资源浪费
The `CLIENT REPLY` command controls whether the server will reply the client's commands. The following modes are available:
`CLIENT REPLY`命令可对服务器是否回复客户端的命令进行设置。有如下选项可以设置

* `ON`. This is the default mode in which the server returns a reply to every command.
* `ON`. 默认选项，回复客户端每条命令
* `OFF`. In this mode the server will not reply to client commands.
* `OFF`. 不回复客户端命令
* `SKIP`. This mode skips the reply of command immediately after it.
* `SKIP`. 跳过该设置命令后紧跟的一条命令
## 返回值

When called with either `OFF` or `SKIP` subcommands, no reply is made. When called with `ON`:
当执行命令设置为`OFF`或`SKIP`，设置命令收不到任何回复，当设置为 `ON`时，设置命令收到`OK`
[simple-string-reply](/topics/protocol.html#simple-string-reply): `OK`.

