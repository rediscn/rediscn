---
layout: commands
title: randomkey 命令
permalink: commands/randomkey.html
disqusIdentifier: command_randomkey
disqusUrl: http://redis.cn/commands/randomkey.html
commandsType: keys
discuzTid: 1025
---

从当前数据库返回一个随机的key。

##返回值

[bulk-string-reply](/topics/protocol.html#bulk-string-reply):如果数据库没有任何key，返回nil，否则返回一个随机的key。