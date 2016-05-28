---
layout: commands
title: punsubscribe 命令
permalink: commands/punsubscribe.html
disqusIdentifier: command_punsubscribe
disqusUrl: http://redis.cn/commands/punsubscribe.html
commandsType: pubsub
---

Unsubscribes the client from the given patterns, or from all of them if none is
given.

When no patterns are specified, the client is unsubscribed from all the
previously subscribed patterns.
In this case, a message for every unsubscribed pattern will be sent to the
client.
