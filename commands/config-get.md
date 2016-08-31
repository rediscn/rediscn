---
layout: commands
title: config-get 命令
permalink: commands/config-get.html
disqusIdentifier: command_config-get
disqusUrl: http://redis.cn/commands/config-get.html
commandsType: server
discuzTid: 939
---

CONFIG GET命令用来读取redis服务器的配置文件参数，但并不是所有参数都支持。 与之对应的命令是CONFIG SET用来设置服务器的配置参数。

CONFIG GET 命令只接受一个参数，所有配置参数都采用key-value的形式。 例如:

	redis> config get *max-*-entries*
	1) "hash-max-zipmap-entries"
	2) "512"
	3) "list-max-ziplist-entries"
	4) "512"
	5) "set-max-intset-entries"
	6) "512"

通过 CONFIG GET * 可以查看所有支持的参数。

所有支持的参数都与[redis.conf](http://github.com/antirez/redis/raw/2.2/redis.conf) 里面的一样，除了如下的重要差异：

- Where bytes or other quantities are specified, it is not possible to use the redis.conf abbreviated form (10k 2gb ... and so forth), everything should be specified as a well formed 64 bit integer, in the base unit of the configuration directive.
- The save parameter is a single string of space separated integers. Every pair of integers represent a seconds/modifications threshold.

举例说明，像redis.conf里面的如下配置:

	save 900 1
	save 300 10

它的意思是：如果900秒内有一个数据发生变化，或者300秒内有10个数据发生变化，那么使用 CONFIG GET 查看时将会看到 "900 1 300 10"。

## 返回值

该命令返回的类型是Bulk reply.
