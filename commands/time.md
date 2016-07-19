---
layout: commands
title: time 命令
permalink: commands/time.html
disqusIdentifier: command_time
disqusUrl: http://redis.cn/commands/time.html
commandsType: server
---

TIME 命令返回当前Unix时间戳和这一秒已经过去的微秒数。基本上，该接口非常相似gettimeofday.

## 返回值

[array-reply](/topics/protocol#array-reply):
返回内容包含两个元素

- UNIX时间戳（单位：秒）
- 微秒

## 例子：

	redis> TIME
	1) "1349834472"
	2) "465608"
	redis> TIME
	1) "1349834472"
	2) "466541"
	redis> 

