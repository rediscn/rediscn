---
layout: commands
title: quit 命令
permalink: commands/quit.html
disqusIdentifier: command_quit
disqusUrl: http://redis.cn/commands/quit.html
commandsType: connection
---

请求服务器关闭连接。连接将会尽可能快的将未完成的客户端请求完成处理。

##返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply): 始终返回 OK.