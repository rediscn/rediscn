---
layout: commands
title: unsubscribe 命令 -- Redis中文资料站
permalink: commands/unsubscribe.html
disqusIdentifier: command_unsubscribe
disqusUrl: http://redis.cn/commands/unsubscribe.html
commandsType: pubsub
---

Unsubscribes the client from the given channels, or from all of them if none is
given.

When no channels are specified, the client is unsubscribed from all the
previously subscribed channels.
In this case, a message for every unsubscribed channel will be sent to the
client.
