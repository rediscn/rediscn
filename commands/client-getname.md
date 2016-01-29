---
layout: commands
title: client-getname 命令 -- Redis中文资料站
permalink: commands/client-getname.html
disqusIdentifier: command_client-getname
disqusUrl: http://redis.cn/commands/client-getname.html
commandsType: keys
---

`CLIENT GETNAME` 返回当前连接由`CLIENT SETNAME`设置的名字。如果没有用`CLIENT SETNAME`设置名字，将返回一个空的回复。

返回

[bulk-string-reply](/topics/protocol.html#bulk-string-reply):
返回连接名字或者空（没有设置名字时）。
