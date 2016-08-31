---
layout: topics
title: REDIS quickstart
permalink: topics/quickstart.html
disqusIdentifier: topics_quickstart
disqusUrl: http://redis.cn/topics/quickstart.html
discuzTid: 894
---

快速上手Redis
===

本文适用于于没有使用redis经验的新人，通过阅读本文档能帮助您学会以下一些事情：

* 下载和编译Rieds
* 使用 **redis-cli** 连接服务器
* 在您的应用中实用Redis
* 了解Redis持续性工作原理。
* 更好的掌控Rieds安装
* 发现和学习Redis的今后发展道路

安装Redis
===

我们建议您直接从官网下载源码编译安装Redis,编译它仅仅需要GCC和libc库即可。
当然您也可以实用liunx的安装管理器来安装Redis,但是我们不鼓励您这么做，因为这样安装的版本通常不是最新的稳定版本。

您可以通过[本网站](/)直接下载最新稳定版本,同时也可以直接点击[http://download.redis.io/redis-stable.tar.gz](http://download.redis.io/redis-stable.tar.gz)下载。

编译Redis只需要下面简单几个步骤：

    wget http://download.redis.io/redis-stable.tar.gz
    tar xvzf redis-stable.tar.gz
    cd redis-stable
    make

当然，在**make**之前，你可以使用**make test**命令（可选的）尝试编译一下，在**src**目录下有以下一些可执行文件：


* **redis-server** 启动Redis服务的脚本
* **redis-sentinel** Redis 哨兵脚本 (监控和故障转移).
* **redis-cli** Redis自带的命令行客户端
* **redis-benchmark** Redis测试脚本
* **redis-check-aof** 和 **redis-check-dump** 极少数情况下用于处理损坏的数据文件，但是非常有用。

把redis的启动脚本和自带的命令行工具拷贝到系统的可执行目录是一个不错的主意，手动执行下面的命令即可：

* sudo cp src/redis-server /usr/local/bin/
* sudo cp src/redis-cli /usr/local/bin/

或者使用 `make install`也可以。

现在，我们假设您已经把/usr/local/bin添加到PATH环境变量，同时上面两个文件也拷贝到了这个目录。

启动Redis
===

下面是最简单的启动Redis服务的方法，不添加任何参数直接执行**redis-server**脚本：

    $ redis-server
    [28550] 01 Aug 19:29:28 # Warning: no config file specified, using the default config. In order to specify a config file use 'redis-server /path/to/redis.conf'
    [28550] 01 Aug 19:29:28 * Server started, Redis version 2.2.12
    [28550] 01 Aug 19:29:28 * The server is now ready to accept connections on port 6379
    ... more logs ...

上面的例子中使用没有任何显式配置文件，所有的参数将使用内部默认配置。
刚开始学习和开发环境时这样做很好，但是在生产环境中，你应该使用配置文件进行配置设置。

带配置文件启动Redis时，只需在启动命令后面指定配置文件即可，例如：**redis-server /etc/redis.conf**。
Redis源码根目录下有默认的`redis.conf`配置文件，你应该参考这个文件来进行配置设置。

检查Redis是否正常工作
=========================

不同语言的外部程序可以通过TCP socket和Redis具体协议来实现redis与的连接，但是Redis本身提供了一个简单的命令行工具**redis-cli**就可以直接连接到Redis服务。

检查Redis是否正常工作要做的第一件事情就是发送一个**PING**命令：

    $ redis-cli ping
    PONG

通过命令行运行**redis-cli**命令，它后面跟着的参数将会发送到本机的6379端口的Redis服务上。你也可以指定特定host和端口进行连接，试试**redis-cli --help**学习怎么连接到指定的host和端口。

另一个有趣的方法是使用命令行运行不带参数：程序将在互动模式启动，你可以输入不同的命令和看到他们的回复。

    $ redis-cli                                                                
    redis 127.0.0.1:6379> ping
    PONG
    redis 127.0.0.1:6379> set mykey somevalue
    OK
    redis 127.0.0.1:6379> get mykey
    "somevalue"

现在，你已经可以与Redis进行交互了，是时候去看看[十五分钟介绍Redis数据类型](/topics/data-types-intro.html)，如果你已经知道一些基本的Redis命令，那么恭喜你，你可以继续阅读下面的内容了。

在应用程序中使用Redis
===

仅仅知道Redis的命令行工具是不够的，我们的目标是在应用程序中实用Redis。为了在应用程序中使用Redis，您需要到[Redis的客户端](/clients.html)里面下载您编程语言的一个redis客户端库。

例如，如果你使用Ruby编程语言，我们最好的建议是使用[Redis-rb](http://github.com/ezmobius/redis-rb)客户端。你可以使用**gem install redis**命令安装它（请确认您的系统已经安装好了gem命令）。

这些命令是Ruby所特有的，但实际很多客户端类库语言和这很相似：创建一个Redis对象和执行命令调用方法。一个简单的用Ruby操作的例子：

    >> require 'rubygems'
    => false
    >> require 'redis'
    => true
    >> r = Redis.new
    => #<Redis client v2.2.1 connected to redis://127.0.0.1:6379/0 (Redis v2.3.8)>
    >> r.ping
    => "PONG"
    >> r.set('foo','bar')
    => "OK"
    >> r.get('foo')
    => "bar"

Redis 持久化
=================

你可以通过 [Redis持久化](/topics/persistence.html)学习更多相关内容,然而重要的是需要知道默认情况下，快速启动的Redis会时不时的保存数据 (例如至少五分钟后，如果至少有100个数据的变化),所以，如果你想让你的数据确切的保存下来，你需要手动执行**SAVE**命令以保存当前快照。否则请确保使用 **SHUTDOWN** 命令来关闭Redis。

    $ redis-cli shutdown

这样能确保将所有数据都保存到磁盘上。

强烈建议您阅读 [Redis持久化](/topics/persistence.html)。以便更好的了解Redis持久化。

Redis高级安装使用篇
==============================

Running Redis from the command line is fine just to hack a bit with it or for
development. However at some point you'll have some actual application to run
on a real server. For this kind of usage you have two different choices:

* Run Redis using screen.
* Install Redis in your Linux box in a proper way using an init script, so that after a restart everything will start again properly.

A proper install using an init script is strongly suggested.
The following instructions can be used to perform a proper installation using the init script shipped with Redis 2.4 in a Debian or Ubuntu based distribution.

We assume you already copied **redis-server** and **redis-cli** executables under /usr/local/bin.

* Create a directory where to store your Redis config files and your data:

        sudo mkdir /etc/redis
        sudo mkdir /var/redis

* Copy the init script that you'll find in the Redis distribution under the **utils** directory into /etc/init.d. We suggest calling it with the name of the port where you are running this instance of Redis. For example:

        sudo cp utils/redis_init_script /etc/init.d/redis_6379

* Edit the init script.

        sudo vi /etc/init.d/redis_6379

Make sure to modify **REDISPORT** accordingly to the port you are using.
Both the pid file path and the configuration file name depend on the port number.

* Copy the template configuration file you'll find in the root directory of the Redis distribution into /etc/redis/ using the port number as name, for instance:

        sudo cp redis.conf /etc/redis/6379.conf

* Create a directory inside /var/redis that will work as data and working directory for this Redis instance:

        sudo mkdir /var/redis/6379

* Edit the configuration file, making sure to perform the following changes:
    * Set **daemonize** to yes (by default it is set to no).
    * Set the **pidfile** to `/var/run/redis_6379.pid` (modify the port if needed).
    * Change the **port** accordingly. In our example it is not needed as the default port is already 6379.
    * Set your preferred **loglevel**.
    * Set the **logfile** to `/var/log/redis_6379.log`
    * Set the **dir** to /var/redis/6379 (very important step!)
* Finally add the new Redis init script to all the default runlevels using the following command:

        sudo update-rc.d redis_6379 defaults

You are done! Now you can try running your instance with:

    /etc/init.d/redis_6379 start

Make sure that everything is working as expected:

* Try pinging your instance with redis-cli.
* Do a test save with **redis-cli save** and check that the dump file is correctly stored into /var/redis/6379/ (you should find a file called dump.rdb).
* Check that your Redis instance is correctly logging in the log file.
* If it's a new machine where you can try it without problems make sure that after a reboot everything is still working.

Note: In the above instructions we skipped many Redis configuration parameters that you would like to change, for instance in order to use AOF persistence instead of RDB persistence, or to setup replication, and so forth.
Make sure to read the example `redis.conf` file (that is heavily commented) and the other documentation you can find in this web site for more information.
