---
layout: commands
title: unsubscribe 命令
permalink: commands/unsubscribe.html
disqusIdentifier: command_unsubscribe
disqusUrl: http://redis.cn/commands/unsubscribe.html
commandsType: pubsub
discuzTid: 1073
---

Unsubscribes the client from the given channels, or from all of them if none is
given.
指示客户端退订给定的频道，若没有指定频道，则退订所有频道.

When no channels are specified, the client is unsubscribed from all the
previously subscribed channels.
In this case, a message for every unsubscribed channel will be sent to the
client.

如果没有频道被指定，即，一个无参数的 UNSUBSCRIBE 调用被执行，那么客户端使用 SUBSCRIBE 命令订阅的所有频道都会被退订。
在这种情况下，命令会返回一个信息，告知客户端所有被退订的频道。