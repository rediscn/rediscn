---
layout: index
title: Redis 5.0.0 下载
excerpt: Redis下载中心(Redis download)，下载各种版本的redis，包括最新redis 5.0.0稳定版redis,5.0.0-Beta版本以及win32/64版本
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
                <span class='download-version'>(4.0)</span>
              </h2>
              Redis 4.0 was released as GA in July 2017. Contains several big improvements: a modules system, much better replication (PSYNC2), improvements to eviction policies, threaded DEL/FLUSH, mixed RDB+AOF format, Raspberry Pi support as primary platform, the new MEMORY command, Redis Cluster support for Nat/Docker, active memory defragmentation, memory usage and performance improvements, much faster Redis Cluster key creation, many other smaller features and a number of behavior fixed.
              <div class='download-links'>
                <a class='download-link' href='https://raw.githubusercontent.com/antirez/redis/3.2/00-RELEASENOTES'>
                  <i class='fa fa-file-text-o'></i>
                  发布日志
                </a>
                <a class='download-link' href='http://download.redis.io/releases/redis-5.0.0.tar.gz'>
                  <i class='fa fa-arrow-circle-o-down'></i>
                  下载
                  5.0.0
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

### 老版本（3.2）###

Redis 3.2 is the previous stable release. Does not include all the improvements in Redis 4.0 but is a very battle tested release, probably a good pick for critical applications while 4.0 matures more in the next months. 
See the [release notes](https://raw.githubusercontent.com/antirez/redis/3.2/00-RELEASENOTES) or [download 3.2.9](http://download.redis.io/releases/redis-3.2.9.tar.gz).

### Windows 版本 ###

Redis 没有官方的Windows版本，但是微软开源技术团队（Microsoft Open Tech group）开发和维护着这个 Win64 的版本。更多信息请参考[这里](https://github.com/MSOpenTech/redis)。

### 其他版本 ###

更多历史版本可以在[Google Code](https://code.google.com/p/redis/downloads/list?can=1)下载。

Scripts and other automatic downloads can easily access the tarball of the latest Redis stable version at [http://download.redis.io/redis-stable.tar.gz](http://download.redis.io/redis-stable.tar.gz). The source code of the latest stable release is [always browsable here](http://download.redis.io/redis-stable), use the file src/version.h in order to extract the version in an automatic way.

### 如何验证文件的完整性 ###

GitHub [redis-hashes](https://github.com/antirez/redis-hashes/blob/master/README)包含了一个README文件，里面有历史发布版本的SHA1摘要。注意：一般redis-stable.tar.gz包不匹配任何hash是因为它是修改后的Redis稳定内容。

### 安装 ###

下载，解压，编译:
	
	$ wget http://download.redis.io/releases/redis-5.0.0.tar.gz
	$ tar xzf redis-5.0.0.tar.gz
	$ cd redis-5.0.0
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