---
layout: topics
title: REDIS problems
permalink: topics/problems.html
disqusIdentifier: topics_problems
disqusUrl: http://redis.cn/topics/problems.html
---

Redis的问题? 这是一个很好的起点。
===

在这里，我们会想办法解决你遇到的有关Redis的问题。一些Redis的项目正在帮助大家解决这些问题，因为我们不想让大家单独面对自己的问题。

* 如果你使用Redis有**延时问题（latency problems）**，在某种程度上视乎是闲置一段时间，请阅读我们的[Redis延迟故障排除指南](/topics/latency.html)。
* Redis的稳定版本通常是非常可靠的,但在极少数情况下也会遇到**崩溃（experiencing crashes）**，这里可以提供更多的调试信息。请阅读我们的Redis调试指南（[Debugging Redis guide](/topics/debugging.html)）。
* 我们经历过很长时期的崩溃历史，实际上那是服务器的**broken RAM**引起的。请使用**redis-server --test-memory** 测试您的非稳定版Redis的 **broken RAM**。Redis的内置内存测试（Redis built-in memory test）是快速并且非常可靠的，但是如果可以的话你可以重启你的服务器并使用[memtest86](http://memtest86.com)测试。

其他问题可以加入我们的[redis论坛](http://bbs.redis.cn)留言，我们会乐意帮助的。

Redis 3.0.x, 2.8.x 和 2.6.x已知的重大bug列表
===

查找重大bug列表请参阅更新记录：

* [Redis 3.0 Changelog](https://raw.githubusercontent.com/antirez/redis/3.0/00-RELEASENOTES)。
* [Redis 2.8 Changelog](https://raw.githubusercontent.com/antirez/redis/2.8/00-RELEASENOTES)。
* [Redis 2.6 Changelog](https://raw.githubusercontent.com/antirez/redis/2.6/00-RELEASENOTES)。

了解每次*紧急升级（upgrade urgency）*的级别更容易知道重点修复的内容。

已知的与Linux相关的Redis bug列表。
===

* Ubuntu 10.04和10.10有严重的错误（尤其是10.10）会导致实例慢慢的挂掉。请从本发行的默认内核中移动。[Link to 10.04 bug](https://silverline.librato.com/blog/main/EC2_Users_Should_be_Cautious_When_Booting_Ubuntu_10_04_AMIs). [Link to 10.10 bug](https://bugs.launchpad.net/ubuntu/+source/linux/+bug/666211)。这两个bug多次在ec2中报道，但是其他用户也确认会影响本地服务器（至少有一个）。
* 某些版本的Xen hypervisor的fork()性能很差，查看[the latency page](/topics/latency.html)了解更多信息。
