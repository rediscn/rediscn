---
layout: commands
title: punsubscribe 命令
permalink: commands/punsubscribe.html
disqusIdentifier: command_punsubscribe
disqusUrl: http://redis.cn/commands/punsubscribe.html
commandsType: pubsub
discuzTid: 1023
---

Unsubscribes the client from the given patterns, or from all of them if none is
given.
指示客户端退订指定模式，若果没有提供模式则退出所有模式。
When no patterns are specified, the client is unsubscribed from all the
previously subscribed patterns.
In this case, a message for every unsubscribed pattern will be sent to the
client.
如果没有模式被指定，即一个无参数的 PUNSUBSCRIBE 调用被执行，那么客户端使用 PSUBSCRIBE 命令订阅的所有模式都会被退订。
在这种情况下，命令会返回一个信息，告知客户端所有被退订的模式。