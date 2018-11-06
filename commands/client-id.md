---
layout: commands
title: client-id 命令
permalink: commands/client-id.html
disqusIdentifier: command_id
disqusUrl: http://redis.cn/commands/client-id.html
commandsType: server
discuzTid: 13901
---

该命令返回当前连接的ID，每个ID符合如下约束：
1. 永不重复。当调用命令`CLIENT ID`返回相同的值时，调用者可以确认原连接未被断开，只是被重用 ，因此仍可以认为是同一连接
2. ID值单调递增。若某一连接的ID值比其他连接的ID值大，可以确认该连接是较新创建的

该命令和同为Redis 5 新增的命令 `CLIENT UNBLOCK`一起使用，会有更好的效果。两条命令的使用格式参照`CLIENT UNBLOCK`说明页。

## 例子

	redis> CLIENT ID
	ERR Unknown or disabled command 'CLIENT'
	redis> 
