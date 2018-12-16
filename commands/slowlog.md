---
layout: commands
title: slowlog 命令
permalink: commands/slowlog.html
disqusIdentifier: command_slowlog
disqusUrl: http://redis.cn/commands/slowlog.html
commandsType: server
discuzTid: 1057
tranAuthor: wangqiang
---

此命令用于读取和重置Redis慢查询日志。

## Redis慢查询日志概述

Redis慢查询日志是一个记录超过指定执行时间的查询的系统。
这里的执行时间不包括IO操作，比如与客户端通信，发送回复等等，而只是实际执行命令所需的时间（这是唯一在命令执行过程中线程被阻塞且不能同时处理其他请求的阶段）。

你可以用两个参数配置慢查询日志：_slowlog-log-slower-than_告诉Redis命令的执行时间超过多少微秒将会被记录。
请注意，使用负数将会关闭慢查询日志，而值为0将强制记录每一个命令。
_slowlog-max-len_是慢查询日志的长度。
最小值是0。
当一个新命令被记录，且慢查询日志已经达到其最大长度时，将从记录命令的队列中移除删除最旧的命令以腾出空间。

配置可以通过编辑`redis.conf`文件来完成，或者在服务器运行期间通过使用`CONFIG GET`和`CONFIG SET`命令来完成。

## 读取慢查询日志

慢查询日志在内存中堆积，因此不会写入一个包含慢速命令执行信息的文件。
这使得慢查询日志非常快，你可以开启所有命令的日志记录（设置_slowlog-log-slower-than_参数值为零），但性能较低。

要读取慢查询日志，请使用**SLOWLOG GET**命令，此命令返回慢查询日志中的每一个条目。
可以只返回最近的N个条目，通过给命令传入一个额外的参数（例如：**SLOWLOG GET 10**）。

请注意，你需要最新版本的redis-cli才能读取慢查询日志的输出，因为它使用了以前未在redis-cli中实现的协议的某些功能（深层嵌套的多批量回复）。

## 输出格式

```
redis 127.0.0.1:6379> slowlog get 2
1) 1) (integer) 14
   2) (integer) 1309448221
   3) (integer) 15
   4) 1) "ping"
2) 1) (integer) 13
   2) (integer) 1309448128
   3) (integer) 30
   4) 1) "slowlog"
      2) "get"
      3) "100"
```

每一个条目由四个字段组成：

* 每个慢查询条目的唯一的递增标识符。
* 处理记录命令的unix时间戳。
* 命令执行所需的总时间，以微秒为单位。
* 组成该命令的参数的数组。

条目的唯一ID可以用于避免慢查询条目被多次处理（例如，你也许有一个脚本使用每个新的慢查询日志条目给你发送报警邮件）。

条目ID在Redis服务器运行期间绝不会被重置，仅在Redis服务重启才重置它。

## 获取慢查询日志的当前长度

使用命令**SLOWLOG LEN**可以获得慢查询日志的长度。

## 重置慢查询日志

你可以使用命令**SLOWLOG RESET**来重置慢查询日志。

删除后，信息将永远丢失。

