---
layout: commands
title: subscribe 命令 -- Redis中文资料站
permalink: commands/subscribe.html
disqusIdentifier: command_subscribe
disqusUrl: http://redis.cn/commands/subscribe.html
commandsType: pubsub
---

Subscribes the client to the specified channels.

Once the client enters the subscribed state it is not supposed to issue any
other commands, except for additional `SUBSCRIBE`, `PSUBSCRIBE`, `UNSUBSCRIBE`
and `PUNSUBSCRIBE` commands.
