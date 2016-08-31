---
layout: topics
title: REDIS sentinel-old
permalink: topics/replication.html
disqusIdentifier: topics_replication
disqusUrl: http://redis.cn/topics/replication.html
discuzTid: 864
---

复制
===

Redis复制很简单易用，它通过配置允许slave Redis Servers或者Master Servers的复制品。接下来有几个关于redis复制的非常重要特性：

* 一个Master可以有多个Slaves。
* Slaves能过接口其他slave的链接，除了可以接受同一个master下面slaves的链接以外，还可以接受同一个结构图中的其他slaves的链接。
* redis复制是在master段是非阻塞的，这就意味着master在同一个或多个slave端执行同步的时候还可以接受查询。
* 复制在slave端也是非阻塞的，假设你在redis.conf中配置redis这个功能，当slave在执行的新的同步时，它仍可以用旧的数据信息来提供查询，否则，你可以配置当redis slaves去master失去联系是，slave会给发送一个客户端错误。
* 为了有多个slaves可以做只读查询，复制可以重复2次，甚至多次，具有可扩展性（例如：slaves对话与重复的排序操作，有多份数据冗余就相对简单了）。
* 通过复制可以避免master全量写硬盘的消耗：只要配置 master 的配置文件redis.conf来“避免保存”（注释掉所有"save"命令），然后连接一个用来持久化数据的slave即可。但是这样要确保masters 不会自动重启（更多内容请阅读下段）

## redis复制是怎么进行工作 ##

如果设置了一个slave，不管是在第一次链接还是重新链接master的时候，slave会发送一个同步命令
然后master开始后台保存，收集所有对修改数据的命令。当后台保存完成，master会将这个数据文件传送到slave，然后保存在磁盘，加载到内存中；master接着发送收集到的所有的修改数据的命令，这好比一个流命令，是redis协议本身来实现的。

你可以自己通过远程登录来进行尝试，当服务器在做一些工作并发送同步命令的时候链接到redis端口，你将会看到大量的数据传输，然后收到的每个命令会会显示在远程登录的会话中。

当master和slave因一些故障当机时，slaves会自动的重链，如果master收到多个slave的同步请求，master会执行一个后台保存，以确保所有的slaves都是正常的。

当master和slave能够维持链接，就会有一个完整的同步进行。

## 配置 ##

配置复制是很简单的，仅仅在slave的配置文件中增加类似下面这行的内容:

	slaveof 192.168.1.1 6379

你可以更换master的ip地址或地址，或者，你可以使用slaveof命令，master就会启动和slave的同步。

## 设置slave到master的认证 ##

如果master需要通过密码登陆，那就需要配置slave在进行所有同步操作也要使用到密码。
在一个运行的实例上尝试，使用 redis-cli :

	config set masterauth <password>

To set it permanently, add this to your config file:

	masterauth <password>