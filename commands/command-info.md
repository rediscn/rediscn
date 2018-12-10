---
layout: commands
title: command-info 命令
permalink: commands/command-info.html
disqusIdentifier: command_command-info
disqusUrl: http://redis.cn/commands/command-info.html
commandsType: server
discuzTid: 938
tranAuthor: wangqiang
---

以[array-reply](/topics/protocol.html#array-reply)的形式返回多个Redis命令的详细信息。

此命令返回的结果与`COMMAND`相同，但是你可以指定返回哪些命令。

如果你指定了一些不存在的命令，那么在它们的返回位置将会是nil。

## 返回值

[array-reply](/topics/protocol.html#array-reply)：嵌套的命令详情列表。

## 例子

    redis> COMMAND INFO get set foo eval
        1) 1) "get"
           2) (integer) 2
           3) 1) "readonly"
              2) "fast"
           4) (integer) 1
           5) (integer) 1
           6) (integer) 1
        2) 1) "set"
           2) (integer) -3
           3) 1) "write"
              2) "denyoom"
           4) (integer) 1
           5) (integer) 1
           6) (integer) 1
        3) (nil)
        4) 1) "eval"
           2) (integer) -3
           3) 1) "noscript"
              2) "movablekeys"
           4) (integer) 0
           5) (integer) 0
           6) (integer) 0

