---
layout: commands
title: client-reply 命令
permalink: commands/client-reply.html
disqusIdentifier: command_reply
disqusUrl: http://redis.cn/commands/client-reply.html
commandsType: server
discuzTid: 13902
---
当需要完全禁用redis服务器对当前客户端的回复时可使用该命令。

在如下几种场景：执行fire和forget类型的命令；正在进行大量数据加载；正在建缓存，数据在不断传输过程中，客户端会忽略收到的回复，此时消耗服务器时间和带宽回复客户端，是一种资源浪费。

注：fire 和 forget 就是发送命令，然后完全不关心最终什么时候完成命令操作。

`CLIENT REPLY`可设置服务器是否对客户端的命令进行回复。有如下选项：
* `ON`.   默认选项，回复客户端每条命令
* `OFF`.  不回复客户端命令
* `SKIP`. 跳过该命令的回复

## 返回值
   当执行命令设置为`OFF`或`SKIP`，设置命令收不到任何回复，当设置为 `ON`时，返回`OK`
   
[simple-string-reply](/topics/protocol.html#simple-string-reply): `OK`.

