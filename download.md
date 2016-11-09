---
layout: index
title: Redis 3.2.5 下载
excerpt: Redis下载中心(Redis download)，下载各种版本的redis，包括最新redis 3.2.5稳定版redis,3.2.5-Beta版本以及win32/64版本
permalink: download.html
disqusIdentifier: download
disqusUrl: http://redis.cn/download.html
discuzTid: 854
---

# 下载（Download） #

Redis 版本号采用标准惯例：主版本号.副版本号.补丁级别,一个副版本号就标记为一个标准发行版本，例如 1.2，2.0，2.2，2.4，2.6，2.8，奇数的副版本号用来表示非标准版本,例如2.9.x发行版本是Redis 3.0标准版本的非标准发行版本。

<div class='text'>
          
          <ul class='download-versions'>
            <li>
              <h2>
                稳定版
                <span class='download-version'>(3.2)</span>
              </h2>
              Redis 3.2 包含Redis API和实现的重大改变。添加了一组新的地理索引（Geo）命令(GEOADD, GEORADIUS 和相关命令)。新的BITFIELD命令能处理整数或任意位宽的计数器数组和字符串内连续偏移。内存优化，相同数据占用更少的内存。Lua脚本新的复制功能。可以用完整的远程Lua脚本调试器编写一个简单任务。快来查看发布日志了解全部新特性吧。
              <div class='download-links'>
                <a class='download-link' href='https://raw.githubusercontent.com/antirez/redis/3.2/00-RELEASENOTES'>
                  <i class='fa fa-file-text-o'></i>
                  发布日志
                </a>
                <a class='download-link' href='http://download.redis.io/releases/redis-3.2.5.tar.gz'>
                  <i class='fa fa-arrow-circle-o-down'></i>
                  下载
                  3.2.5
                </a>
              </div>
            </li>
            <li>
              <h2>
                最新版
              </h2>
              这是所有正在开发中的功能，仅供大家参考研究测试用。这些将是接下来几个月内发布的Redis新特性。
              <div class='download-links'>
                <a class='download-link' href='https://github.com/antirez/redis/archive/unstable.tar.gz'>
                  <i class='fa fa-arrow-circle-o-down'></i>
                  下载<br/>
                  最新版
                </a>
              </div>
            </li>
          </ul>
</div>

## 其他版本 ##

### 老版本（3.0）###

Redis 3.0 介绍了集群，一个分布式的Redis。能自动将数据进行分片和容错处理，另一方面明显提升了读写速度和AOF重写Dendi。您可以查看[版本发布日志](https://raw.githubusercontent.com/antirez/redis/3.0/00-RELEASENOTES)了解更多内容，也可以直接下载[Redis 3.0.7](http://download.redis.io/releases/redis-3.0.7.tar.gz)。

### Windows 版本 ###

Redis 没有官方的Windows版本，但是微软开源技术团队（Microsoft Open Tech group）开发和维护着这个 Win64 的版本。更多信息请参考[这里](https://github.com/MSOpenTech/redis)。

### 其他版本 ###

更多历史版本可以在[Google Code](https://code.google.com/p/redis/downloads/list?can=1)下载。

Scripts and other automatic downloads can easily access the tarball of the latest Redis stable version at [http://download.redis.io/redis-stable.tar.gz](http://download.redis.io/redis-stable.tar.gz). The source code of the latest stable release is [always browsable here](http://download.redis.io/redis-stable), use the file src/version.h in order to extract the version in an automatic way.

### 如何验证文件的完整性 ###

GitHub [redis-hashes](https://github.com/antirez/redis-hashes/blob/master/README)包含了一个README文件，里面有历史发布版本的SHA1摘要。注意：一般redis-stable.tar.gz包不匹配任何hash是因为它是修改后的Redis稳定内容。

### 安装 ###

下载，解压，编译:
	
	$ wget http://download.redis.io/releases/redis-3.2.5.tar.gz
	$ tar xzf redis-3.2.5.tar.gz
	$ cd redis-3.2.5
	$ make

二进制文件是编译完成后在src目录下，通过下面的命令启动Redis服务：

	$ src/redis-server

你可以使用内置的客户端命令redis-cli进行使用：

	$ src/redis-cli
	redis> set foo bar
	OK
	redis> get foo
	"bar"

你刚开始接触Redis? 试试我们的[在线交互教程](http://try.redis.io/)。