---
layout: commands
title: bgsave 命令 -- Redis中文资料站
permalink: commands/bgsave.html
disqusIdentifier: command_bgsave
disqusUrl: http://redis.cn/commands/bgsave.html
commandsType: server
---

后台保存DB。会立即返回 OK 状态码。 Redis forks, 父进程继续提供服务以供客户端调用，子进程将DB数据保存到磁盘然后退出。如果操作成功，可以通过客户端命令LASTSAVE来检查操作结果。

详细信息请参阅[persistence documentation](/topics/persistence.html)。

##返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply)
