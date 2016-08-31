---
layout: commands
title: shutdown 命令
permalink: commands/shutdown.html
disqusIdentifier: command_shutdown
disqusUrl: http://redis.cn/commands/shutdown.html
commandsType: server
discuzTid: 1052
---

这个命令执行如下操作:

- 停止所有客户端.
- 如果配置了**save 策略** 则执行一个阻塞的save命令.
- 如果开启了**AOF**,则刷新aof文件..
- 关闭redis服务进程（redis-server）.

如果配置了持久化策略，那么这个命令将能够保证在关闭redis服务进程的时候数据不会丢失. 如果仅仅在客户端执行SAVE 命令,然后 执行[QUIT](/commands/quit.html) 命令，那么数据的完整性将不会被保证，因为其他客户端可能在执行这两个命令的期间修改数据库的数据.

注意: 一个没有配置持久化策略的redis实例 (没有aof配置, 没有 "save" 命令) 将不会 在执行[SHUTDOWN](/commands/shutdown.html)命令的时候转存一个rdb文件, 通常情况下你不想让一个仅用于缓存的rendis实例宕掉

## SAVE 和 NOSAVE 修饰符 ##

通过指定一个可选的修饰符可以改变这个命令的表现形式 比如:

- **SHUTDOWN SAVE**能够在即使没有配置持久化的情况下强制数据库存储.
- **SHUTDOWN NOSAVE** 能够在配置一个或者多个持久化策略的情况下阻止数据库存储. (你可以假想它为一个中断服务的 **ABORT** 命令).

返回值

当发生错误的时候返回状态码 . 当成功的时候不返回任何值，服务退出，链接关闭.