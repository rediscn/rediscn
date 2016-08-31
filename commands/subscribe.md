---
layout: commands
title: subscribe 命令
permalink: commands/subscribe.html
disqusIdentifier: command_subscribe
disqusUrl: http://redis.cn/commands/subscribe.html
commandsType: pubsub
discuzTid: 1066
---

订阅给指定频道的信息。

一旦客户端进入订阅状态，客户端就只可接受订阅相关的命令[SUBSCRIBE](/commands/subscribe.html)、[PSUBSCRIBE](/commands/psubscribe.html)、[UNSUBSCRIBE](/commands/unsubscribe.html)和[PUNSUBSCRIBE](/commands/punsubscribe.html)除了这些命令，其他命令一律失效。
