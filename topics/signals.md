---
layout: topics
title: REDIS signals
permalink: topics/signals.html
disqusIdentifier: signals
disqusUrl: http://redis.cn/topics/signals.html
discuzTid: 868
---

Redis信号处理
===

本文档提供的信息是有关Redis是如何应对不同POSIX系统下产生的信号异常，比如`SIGTERM`,`SIGSEGV`等等。

本文档中的信息**只适用于Redis2.6或更高版本**。

## SIGTERM信号的处理 ##

SIGTERM信号会让Redis安全的关闭。Redis收到信号时并不立即退出，而是开启一个定时任务，这个任务就类似执行一次SHUTDOWN命令的。 这个定时关闭任务会在当前执行命令终止后立即施行，因此通常有有0.1秒或更少时间延迟。

万一Server被一个耗时的LUA脚本阻塞，如果这个脚本可以被SCRIPT KILL命令终止，那么定时执行任务就会在脚本被终止后立即执行，否则直接执行。

这种情况下的Shutdown过程也会同时包含以下的操作：

* 如果存在正在执行RDB文件保存或者AOF重写的子进程，子进程被终止。
* 如果AOF功能是开启的，Redis会通过系统调用fsync将AOF缓冲区数据强制输出到硬盘。
* 如果Redis配置了使用RDB文件进行持久化，那么此时就会进行同步保存。由于保存时同步的，那也就不需要额外的内存。
* 如果Server是守护进程，PID文件会被移除。
* 如果Unix域的Socket是可用的，它也会被移除。
* Server退出，退出码为0.

万一RDB文件保存失败，Shutdown失败，Server则会继续运行以保证没有数据丢失。自从Redis2.6.11之后，Redis不会再次主动Shutdown，除非它接收到了另一个SIGTERM信号或者另外一个SHUTDOWN命令

## SIGSEGV,SIGBUS,SIGFPF和SIGILL信号的处理 ##

Redis接收到以下几种信号时会崩溃：

- SIGSEGV
- SIGBUS
- SIGFPE
- SIGILL

如果以上信号被捕获，Redis会终止所有正在进行的操作，并进行以下操作：

- 包括调用栈信息，寄存器信息，以及clients信息会以bug报告的形式写入日志文件。
- 自从Redis2.8（当前为开发版本）之后，Redis会在系统崩溃时进行一个快速的内存检测以保证系统的可靠性。
- 如果Server是守护进程，PID文件会被移除。
- 最后server会取消自己对当前所接收信号的信号处理器的注册，并重新把这个信号发给自己，这是为了保证一些默认的操作被执行，比如把Redis的核心Dump到文件系统。

## 子进程被终止时会发生什么 ##

当一个正在进行AOF重写的子进程被信号终止，Redis会把它当成一个错误并丢弃这个AOF文件(可能是部分或者完全损坏)。AOF重写过程会在以后被重新触发。

当一个正在执行RDB文件保存的子进程被终止Redis会把它当做一个严重的错误，因为AOF重写只会导致AOF文件冗余，但是RDB文件保存失败会导致Redis不可用。

如果一个正在保存RDB文件的子进程被信号终止或者自身出现了错误(非0退出码)，Redis会进入一种特殊的错误状态，不允许任何写操作。

- Redis会继续回复所有的读请求。
- Redis会回复给所有的写请求一个MISCONFIG错误。

此错误状态只需被清楚一次就可以进行成功创建数据库文件。

## 不触发错误状态的情况下终止RDB文件的保存 ##

但是有时用户希望可以在不触发错误的情况下终止保存RDB文件的子进程。自从Redis2.6.10之后就可以使用信号SIGUSR1，这个信号会被特殊处理：它会像其他信号一样终止子进程，但是父进程不会检测到这个严重的错误，照常接收所有的用户写请求。