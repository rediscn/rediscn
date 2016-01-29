---
layout: topics
title: REDIS 管理 -- Redis中文资料站
permalink: topics/admin.html
disqusIdentifier: admin
disqusUrl: http://redis.cn/topics/admin.html
---

## Redis 的管理 ##

此篇包含关于管理 Redis 实例的话题。每个话题均包含在一个常见问题表单中。将来会有新的话题加入。

### Redis安装提示


- 我们建议使用linux部署Redis。Redis也在osx，FreeBSD，OpenBSD上经过测试，但Linux经过所有主要的压力测试，并且最多产品部署。
确保设置Linux内核overcommit memory setting为1。向/etc/sysctl.conf添加vm.overcommit_memory = 1然后重启，或者运行命令sysctl vm.overcommit_memory=1以便立即生效。


- 确保禁用Linux内核特性transparent huge pages，它对内存使用和延迟有非常大的负面影响。通过命令echo never > sys/kernel/mm/transparent_hugepage/enabled来完成。


- 确保你的系统设置了一些swap（我们建议和内存一样大）。如果linux没有swap并且你的redis实例突然消耗了太多内存，或者Redis由于内存溢出会当掉，或者Linux内核OOM Killer会杀掉Redis进程。


- 设置一个明确的maxmemory参数来限制你的实例，以便确保实例会报告错误而不是当接近系统内存限制时失败


- 如果你对一个写频繁的应用使用redis，当向磁盘保存RDB文件或者改写AOF日志时，**redis可能会用正常使用内存2倍的内存**。额外使用的内存和保存期间写修改的内存页数量成比例，因此经常和这期间改动的键的数量成比例。确保相应的设置内存的大小。


- 当在daemontools下运行时，使用daemonize no


- 即使你禁用持久化，如果你使用复制，redis会执行rdb保存，除非你使用新的无磁盘复制特性，这个特性目前还是实验性的。


- 如果你使用复制，确保要么你的master激活了持久化，要么它不会在当掉后自动重启。slave是master的完整备份，因此如果master通过一个空数据集重启，slave也会被清掉。

### 在EC2上运行redis


- 使用基于HVM的实例，不是基于PV的实例。


- 不要使用老的实例家族。例如，使用HVM的m3.medium代替PV的m1.medium。


- Redis持久化使用EC2 EBS卷需要小心处理，因为有时EBS卷有高延迟特性。


- 如果当slave和master同步时有问题，你可能想尝试新的**无磁盘复制**特性。

### 无需停机升级或重启 Redis 实例。

Redis 被设计成服务器上的长时间运行进程。针对运行实例，有许多配置选项可以通过 [CONFIG SET](/commands/config-set.html) 命令进行修改，而无需执行任何形式的重启。
从 Redis 2.2 开始，可以从 AOF 切换到 RDB 的快照持久性或其他方式而不需要重启 Redis。检索 'CONFIG GET *' 命令获取更多信息。
但偶尔重新启动是必须的，如为升级 Redis 程序到新的版本，或者当你需要修改某些目前 CONFIG 命令还不支持的配置参数的时候。
下列步骤通常用来避免任何形式的停机。


- 为你的 Redis 实例配置新的从实例。为此你需要一台额外的服务器，或者你的服务器有足够的内存以便同时运行两个 Redis 实例。


- 如果你用单一的服务器，需确保从实例用与主实例不同的端口启动，否则从实例根本不会启动成功。


- 等待复制机制的初始同步完成（检查从实例的日志文件）。


- 用 INFO 命令确认在主从实例中有同样数量的键值。用 redis-cli 检查从实例工作正常并响应你的命令。
使用config set slave-read-only no，允许写slave。


- 配置你所有的客户端以便使用新的实例（即从实例）


- 当你确认主实例不再接收到任何请求（你可以用 [MONITOR](/commands/monitor.html) 命令监视到），使用 **SLAVEOF NO ONE** 命令切换从实例为主实例，然后关闭原先的主实例。