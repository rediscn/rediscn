---
layout: commands
title: cluster-saveconfig 命令
permalink: commands/cluster-saveconfig.html
disqusIdentifier: command_cluster-saveconfig
disqusUrl: http://redis.cn/commands/cluster-saveconfig.html
commandsType: cluster
discuzTid: 930
---

强制保存配置`nodes.conf`至磁盘。

该命令主要用于`nodes.conf`节点状态文件丢失或被删除的情况下重新生成文件。当使用`CLUSTER`命令
对群集做日常维护时，该命令可以用于保证新生成的配置信息会被持久化到磁盘。当然，这类命令应该没定时调用
将配置信息持久化到磁盘，保证系统重启之后状态信息还是正确的。

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply): `OK` 或者发生错误时回复错误。