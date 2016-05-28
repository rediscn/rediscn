---
layout: commands
title: monitor 命令
permalink: commands/monitor.html
disqusIdentifier: command_monitor
disqusUrl: http://redis.cn/commands/monitor.html
commandsType: server
---

[MONITOR](/commands/monitor.html) 是一个调试命令，返回服务器处理的每一个命令，它能帮助我们了解在数据库上发生了什么操作，可以通过redis-cli和telnet命令使用.

	$ redis-cli monitor
	1339518083.107412 [0 127.0.0.1:60866] "keys" "*"
	1339518087.877697 [0 127.0.0.1:60866] "dbsize"
	1339518090.420270 [0 127.0.0.1:60866] "set" "x" "6"
	1339518096.506257 [0 127.0.0.1:60866] "get" "x"
	1339518099.363765 [0 127.0.0.1:60866] "del" "x"
	1339518100.544926 [0 127.0.0.1:60866] "get" "x"

使用SIGINT (Ctrl-C)来停止 通过redis-cli使用[MONITOR](/commands/monitor.html)命令返回的输出.

	$ telnet localhost 6379
	Trying 127.0.0.1...
	Connected to localhost.
	Escape character is '^]'.
	MONITOR
	+OK
	+1339518083.107412 [0 127.0.0.1:60866] "keys" "*"
	+1339518087.877697 [0 127.0.0.1:60866] "dbsize"
	+1339518090.420270 [0 127.0.0.1:60866] "set" "x" "6"
	+1339518096.506257 [0 127.0.0.1:60866] "get" "x"
	+1339518099.363765 [0 127.0.0.1:60866] "del" "x"
	+1339518100.544926 [0 127.0.0.1:60866] "get" "x"
	QUIT
	+OK
	Connection closed by foreign host.

使用[QUIT](/commands/quit.html)命令来停止通过telnet使用[MONITOR](/commands/monitor.html)返回的输出.

##MONITOR 性能消耗

由于[MONITOR](/commands/monitor.html)命令返回 服务器处理的所有的 命令, 所以在性能上会有一些消耗.

在不运行[MONITOR](/commands/monitor.html)命令的情况下，benchmark的测试结果:

	$ src/redis-benchmark -c 10 -n 100000 -q
	PING_INLINE: 101936.80 requests per second
	PING_BULK: 102880.66 requests per second
	SET: 95419.85 requests per second
	GET: 104275.29 requests per second
	INCR: 93283.58 requests per second

在运行[MONITOR](/commands/monitor.html)命令的情况下，benchmark的测试结果: (redis-cli monitor > /dev/null):

	$ src/redis-benchmark -c 10 -n 100000 -q
	PING_INLINE: 58479.53 requests per second
	PING_BULK: 59136.61 requests per second
	SET: 41823.50 requests per second
	GET: 45330.91 requests per second
	INCR: 41771.09 requests per second

在这种特定的情况下，运行一个[MONITOR](/commands/monitor.html)命令能够降低50%的吞吐量，运行多个[MONITOR](/commands/monitor.html)命令 降低的吞吐量更多.

##返回值

**没有统一标准的返回值**, 无限的返回服务器端处理的命令流.