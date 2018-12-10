---
layout: commands
title: config-rewrite 命令
permalink: commands/config-rewrite.html
disqusIdentifier: command_config-rewrite
disqusUrl: http://redis.cn/commands/config-rewrite.html
commandsType: server
discuzTid: 941
tranAuthor: wangqiang
---

`CONFIG REWRITE`命令重写服务器启动时指定的`redis.conf`文件，应用所需的最小更改来反应服务器当前使用的配置，由于使用了`CONFIG SET`，因此与原始配置相比可能有所不同。

重写以非常保守的方式执行：

* 注释和原始redis.conf文件的整体结构会尽可能的保留下来。
* 如果一个选项在旧的redis.conf文件中已经存在，那么它会在相同的位置（行号）被重写。
* 如果某个选项在配置文件中尚不存在，但被设置为了该选项的默认值，那么他将不会被重写进程写入配置文件。
* 如果某个选项在配置文件中尚不存在，但被设置了一个非默认值，那么它会被追加到文件的末尾。
* 未使用的行将会留空。例如，如果你之前在配置文件中有多个`save`配置项，但由于你禁用了RDB持久化，当前的`save`配置变少了或者变为空，那么所有的那些行将会是空行。

如果原始文件由于某些原因不再存在，CONFIG REWRITE也能够从头开始重写配置文件。但是，如果服务器启动的时候没有指定任何配置文件，则CONFIG REWRITE将只会返回一个错误。

## 原子重写过程

为了保证redis.conf文件始终是一致的，也即，在异常或者崩溃的时候，你的配置文件要么是旧的文件，或者是重写完的新文件。重写是通过一次具有足够内容的`write(2)`调用来执行的，至少和旧的文件一样大。有时会以注释的形式添加额外的padding，以确保生成的文件足够大，稍后文件会被截断以删除末尾的padding。

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply)：当配置被正确重写时返回`OK`，否则返回错误。
