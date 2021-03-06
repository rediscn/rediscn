---
layout: topics
title: Redis安全性
permalink: topics/security.html
disqusIdentifier: topics_security
disqusUrl: http://redis.cn/topics/security.html
discuzTid: 867
---

Redis安全性
===

本文档从以下几点提供了关于Redis安全主题的介绍：Redis提供的访问控制，代码安全问题，通过外部的恶意输入触发的攻击和其它类似的主题也包含在内。

## Redis常规安全模式 ##

Redis被设计成仅有可信环境下的可信用户才可以访问。这意味着将Redis实例直接暴露在网络上或者让不可信用户可以直接访问Redis的tcp端口或Unix套接字，是不安全的。

正常情况下，使用Redis的web应用程序是将Redis作为数据库，缓存，消息系统，网站的前端用户将会查询Redis来生成页面，或者执行所请求的操作，或者被web应用程序用户所触发。

这种情况下，web应用程序需要对不可信的用户(访问web应用程序的用户浏览器)访问Redis进行处理。

这是个特殊的例子，但是，正常情况下，对Redis的非法访问需要通过实现ACLs，验证用户输入和决定Redis实例上可以执行哪些操作这些方式来控制。

总而言之，Redis并没有最大地去优化安全方面，而是尽最大可能去优化高性能和易用性。

## 网络安全 ##

仅有可信的网络用户才可以访问Redis的端口，因此运行Redis的服务器应该只能被用Redis实现的应用程序的计算机直接访问。

一般情况下一台直接暴露在Internet的计算机，例如一个虚拟化Linux实例(Linode, EC2,…)，防火墙应该防止外部用户访问它的redis端口。用户仍可以通过本地接口来访问Redis。

记住在redis.conf文件中增加下面这一行配置就可以把Redis绑定在单个接口上。

	bind 127.0.0.1

不禁止外部访问redis的话，将会产生非常严重的后果。比如，一个FLUSHALL操作就可以当做外部攻击来删除Redis上的所有数据。

## 认证的特性 ##

虽然Redis没有尝试去实现访问控制，但是提供了一个轻量级的认证方式，可以编辑redis.conf文件来启用。

当认证授权方式启用后，Redis将会拒绝来自没有认证的用户的任何查询。一个客户端可以通过发送AUTH命令并带上密码来给自己授权。

这个密码由系统管理员在redis.conf文件里面用明文设置，它需要足够长以应对暴力攻击，这样子设置有以下两个原因：

* Redis的查询速度非常快。外部用户每秒可以尝试非常多个密码。
* Redis的密码存储在redis.conf文件中和存储在客户端的配置中，因此系统管理员没必要去记住它，因此可以设置得非常长。

认证层的目标是提供多一层的保护。假如防火墙或者其它任何系统防护攻击失败的话，外部客户端如果没有认证密码的话将依然无法访问Redis实例。

AUTH命令就像其它Redis命令一样，是通过非加密方式发送的，因此无法防止拥有足够的访问网络权限的攻击者进行窃听。
数据加密支持

Redis并不支持加密。为了实现在网络上或者其它非可信网络访问Redis实例，需要实现新增的保护层，例如SSL代理。

## 禁用的特殊命令 ##

在Redis中可以禁用命令或者将它们重命名成难以推测的名称，这样子普通用户就只能使用部分命令了。

例如，一个虚拟化的服务器提供商可能提供管理Redis实例的服务。在这种情况下，普通用户可能不被允许调用CONFIG命令去修改实例的配置，但是能够提供删除实例的系统需要支持修改配置。

在这种情况下，你可以从命令表中重命名命令或者禁用命令。这个特性可以在redis.conf文件中进行配置。例如：

	rename-command CONFIG b840fc02d524045429941cc15f59e41cb7be6c52

在上面这个例子中，CONFIG命令被重命名成一个不好猜测的名称。把命令重命名成一个空字符串可以禁用掉该命令，例如下面这个例子：

	rename-command CONFIG ""

## 外部客户端通过仔细构造的输入触发的攻击 ##

即便没有外部访问权限，也有种攻击可以让攻击者从外部触发。例如一些攻击者有能力向Redis中插入数据，触发Redis内部数据结构中最差的算法复杂度，

例如一个攻击者可以通过提交表单提交大量一样的字符串到哈希表里，使得 O(1) 的算法复杂度(平均时间)达到最差的O(N) ，Redis将需要更多的CPU来处理，到最后会导致无法提供服务

为了防范这类特殊的攻击，redis的哈希函数使用per-excution的伪随机种子。

Redis用qsort算法来实现SORT命令。当前这个算法还不算随机的，所以通过有意构造输入可能引发最糟糕情况的算法复杂度。

## 字符串转义和NoSQL注入 ##

Redis的协议没有字符串转移的概念，因此一般情况下普通客户端无法实现注入的。该协议采用二进制安全的前缀长度字符串。

通过EVAL和EVALSHA命令运行Lua脚本也是安全的。

虽然这是个很奇怪的用法，应用程序应避免使用不明来源的字符串来写Lua脚本。

## 代码安全 ##

在传统架构的Redis中，客户端是可以使用全部命令的，但是访问redis实例时是没有能力控制运行着Redis的系统的。

本质上，Redis使用一直的最好的编程方法来写安全的代码，防止出现缓存溢出，格式错误和其他内存损坏问题。但是，使用CONFIG命令修改服务器配置的能力使得用户可以改变程序的工作目录和备份文件的名字。这让用户可以将RDB文件写在任意路径，这个安全问题容易引起不受信任的代码在Redis上运行。

Redis不需要root权限来运行，建议使用仅能运行redis的用户运行。Redis的作者正在调查给Redis增加一个新参数来防止CONFIG SET/GET dir和其它命令运行时配置指令的可能。这可以防止客户端强制要求服务器在任意位置写文件。
