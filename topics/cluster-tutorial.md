---
layout: topics
title: REDIS cluster-tutorial -- Redis中文资料站
permalink: topics/cluster-tutorial.html
disqusIdentifier: topics_cluster-tutorial
disqusUrl: http://redis.cn/topics/cluster-tutorial.html
discuzTid: 886
---

Redis 集群教程
===

本文档是Redis集群的一般介绍，没有涉及复杂难懂的分布式概念的赘述，只是提供了从用户角度来如何搭建测试以及使用的方法，如果你打算使用并深入了解Redis集群，推荐阅读完本章节后,仔细阅读 [Redis 集群规范](/topics/cluster-spec.html) 一章。

本教程试图提供最终用户一个简单的关于集群和一致性特征的描述

请注意，本教程使用于Redis3.0（包括3.0）以上版本

如果你计划部署集群，那么我们建议你从阅读这个文档开始。

Redis集群介绍
---

Redis 集群是一个提供在**多个Redis间节点间共享数据**的程序集。

Redis集群并不支持处理多个keys的命令,因为这需要在不同的节点间移动数据,从而达不到像Redis那样的性能,在高负载的情况下可能会导致不可预料的错误.

Redis 集群通过分区来提供**一定程度的可用性**,在实际环境中当某个节点宕机或者不可达的情况下继续处理命令.
Redis 集群的优势:

* 自动分割数据到不同的节点上。
* 整个集群的部分节点失败或者不可达的情况下能够继续处理命令。

Redis 集群的数据分片
---

Redis 集群没有使用一致性hash, 而是引入了 **哈希槽**的概念.

Redis 集群有16384个哈希槽,每个key通过CRC16校验后对16384取模来决定放置哪个槽.集群的每个节点负责一部分hash槽,举个例子,比如当前集群有3个节点,那么:

* 节点 A 包含 0 到 5500号哈希槽.
* 节点 B 包含5501 到 11000 号哈希槽.
* 节点 C 包含11001 到 16384号哈希槽.

这种结构很容易添加或者删除节点. 比如如果我想新添加个节点D, 我需要从节点 A, B, C中得部分槽到D上. 如果我像移除节点A,需要将A中得槽移到B和C节点上,然后将没有任何槽的A节点从集群中移除即可.
由于从一个节点将哈希槽移动到另一个节点并不会停止服务,所以无论添加删除或者改变某个节点的哈希槽的数量都不会造成集群不可用的状态.

Redis 集群的主从复制模型
---

为了使在部分节点失败或者大部分节点无法通信的情况下集群仍然可用，所以集群使用了主从复制模型,每个节点都会有N-1个复制品.

在我们例子中具有A，B，C三个节点的集群,在没有复制模型的情况下,如果节点B失败了，那么整个集群就会以为缺少5501-11000这个范围的槽而不可用.

然而如果在集群创建的时候（或者过一段时间）我们为每个节点添加一个从节点A1，B1，C1,那么整个集群便有三个master节点和三个slave节点组成，这样在节点B失败后，集群便会选举B1为新的主节点继续服务，整个集群便不会因为槽找不到而不可用了

不过当B和B1 都失败后，集群是不可用的.

Redis 一致性保证
---

Redis 并不能保证数据的**强一致性**. 这意味这在实际中集群在特定的条件下可能会丢失写操作.

第一个原因是因为集群是用了异步复制. 写操作过程:

* 客户端向主节点B写入一条命令.
* 主节点B向客户端回复命令状态.
* 主节点将写操作复制给他得从节点 B1, B2 和 B3.

主节点对命令的复制工作发生在返回命令回复之后， 因为如果每次处理命令请求都需要等待复制操作完成的话， 那么主节点处理命令请求的速度将极大地降低 —— 我们必须在性能和一致性之间做出权衡。
注意：Redis 集群可能会在将来提供同步写的方法。
Redis 集群另外一种可能会丢失命令的情况是集群出现了网络分区， 并且一个客户端与至少包括一个主节点在内的少数实例被孤立。

举个例子 假设集群包含 A 、 B 、 C 、 A1 、 B1 、 C1 六个节点， 其中 A 、B 、C 为主节点， A1 、B1 、C1 为A，B，C的从节点， 还有一个客户端 Z1
假设集群中发生网络分区，那么集群可能会分为两方，大部分的一方包含节点 A 、C 、A1 、B1 和 C1 ，小部分的一方则包含节点 B 和客户端 Z1 .

Z1仍然能够向主节点B中写入, 如果网络分区发生时间较短,那么集群将会继续正常运作,如果分区的时间足够让大部分的一方将B1选举为新的master，那么Z1写入B中得数据便丢失了.

注意， 在网络分裂出现期间， 客户端 Z1 可以向主节点 B 发送写命令的最大时间是有限制的， 这一时间限制称为节点超时时间（node timeout）， 是 Redis 集群的一个重要的配置选项：

搭建并使用Redis集群
===

搭建集群的第一件事情我们需要一些运行在 集群模式的Redis实例. 这意味这集群并不是由一些普通的Redis实例组成的，集群模式需要通过配置启用，开启集群模式后的Redis实例便可以使用集群特有的命令和特性了.

下面是一个最少选项的集群的配置文件:

	port 7000
	cluster-enabled yes
	cluster-config-file nodes.conf
	cluster-node-timeout 5000
	appendonly yes

文件中的 cluster-enabled 选项用于开实例的集群模式， 而 cluster-conf-file 选项则设定了保存节点配置文件的路径， 默认值为 nodes.conf.节点配置文件无须人为修改， 它由 Redis 集群在启动时创建， 并在有需要时自动进行更新。

要让集群正常运作至少需要三个主节点，不过在刚开始试用集群功能时， 强烈建议使用六个节点： 其中三个为主节点， 而其余三个则是各个主节点的从节点。

首先， 让我们进入一个新目录， 并创建六个以端口号为名字的子目录， 稍后我们在将每个目录中运行一个 Redis 实例：
命令如下:


	mkdir cluster-test
	cd cluster-test
	mkdir 7000 7001 7002 7003 7004 7005


在文件夹 7000 至 7005 中， 各创建一个 redis.conf 文件， 文件的内容可以使用上面的示例配置文件， 但记得将配置中的端口号从 7000 改为与文件夹名字相同的号码。

从 Redis Github 页面 的 unstable 分支中取出最新的 Redis 源码， 编译出可执行文件 redis-server ， 并将文件复制到 cluster-test 文件夹， 然后使用类似以下命令， 在每个标签页中打开一个实例：

	cd 7000
	../redis-server ./redis.conf

实例打印的日志显示， 因为 nodes.conf 文件不存在， 所以每个节点都为它自身指定了一个新的 ID ：

    [82462] 26 Nov 11:56:55.329 * No cluster configuration found, I'm 97a3a64667477371c4479320d683e4c8db5858b1

实例会一直使用同一个 ID ， 从而在集群中保持一个独一无二（unique）的名字。

搭建集群
---

现在我们已经有了六个正在运行中的 Redis 实例， 接下来我们需要使用这些实例来创建集群， 并为每个节点编写配置文件。

通过使用 Redis 集群命令行工具 redis-trib ， 编写节点配置文件的工作可以非常容易地完成： redis-trib 位于 Redis 源码的 src 文件夹中， 它是一个 Ruby 程序， 这个程序通过向实例发送特殊命令来完成创建新集群， 检查集群， 或者对集群进行重新分片（reshared）等工作。

    ./redis-trib.rb create --replicas 1 127.0.0.1:7000 127.0.0.1:7001 \
    127.0.0.1:7002 127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005

这个命令在这里用于创建一个新的集群, 选项--replicas 1 表示我们希望为集群中的每个主节点创建一个从节点。

之后跟着的其他参数则是这个集群实例的地址列表,3个master3个slave
redis-trib 会打印出一份预想中的配置给你看， 如果你觉得没问题的话， 就可以输入 yes ， redis-trib 就会将这份配置应用到集群当中,让各个节点开始互相通讯,最后可以得到如下信息：

    [OK] All 16384 slots covered

这表示集群中的 16384 个槽都有至少一个主节点在处理， 集群运作正常。

Creating a Redis Cluster using the create-cluster script
---

If you don't want to create a Redis Cluster by configuring and executing
individual instances manually as explained above, there is a much simpler
system (but you'll not learn the same amount of operational details).

Just check `utils/create-cluster` directory in the Redis distribution.
There is a script called `create-cluster` inside (same name as the directory
it is contained into), it's a simple bash script. In order to start
a 6 nodes cluster with 3 masters and 3 slaves just type the following
commands:

1. `create-cluster start`
2. `create-cluster create`

Reply to `yes` in step 2 when the `redis-trib` utility wants you to accept
the cluster layout.

You can now interact with the cluster, the first node will start at port 30001
by default. When you are done, stop the cluster with:

3. `create-cluster stop`.

Please read the `README` inside this directory for more information on how
to run the script.

使用集群
---

Redis 集群现阶段的一个问题是客户端实现很少。 

以下是一些我知道的实现：

* [redis-rb-cluster](http://github.com/antirez/redis-rb-cluster) 是我（@antirez）编写的 Ruby 实现， 用于作为其他实现的参考。 该实现是对 redis-rb 的一个简单包装， 高效地实现了与集群进行通讯所需的最少语义（semantic）.
* [redis-py-cluster](https://github.com/Grokzen/redis-py-cluster) 看上去是 redis-rb-cluster 的一个 Python 版本， 这个项目有一段时间没有更新了（最后一次提交是在六个月之前）， 不过可以将这个项目用作学习集群的起点。
* 流行的 [Predis](https://github.com/nrk/predis) 曾经对早期的 Redis 集群有过一定的支持， 但我不确定它对集群的支持是否完整， 也不清楚它是否和最新版本的 Redis 集群兼容 （因为新版的 Redis 集群将槽的数量从 4k 改为 16k 了）.
* 使用最多的时java客户端,  [Jedis](https://github.com/xetorthio/jedis) 最近添加了对集群的支持, 详细请查看项目README中*Jedis Cluster*部分.
* [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) 提供对 C# 的支持(并且包括大部分 .NET 下面的语言，比如： VB, F#等等)
* [thunk-redis](https://github.com/thunks/thunk-redis) 提供对 Node.js 和 io.js的支持。
* Redis unstable 分支中的 `redis-cli` 程序实现了非常基本的集群支持， 可以使用命令 redis-cli -c 来启动。

测试 Redis 集群比较简单的办法就是使用 redis-rb-cluster 或者 redis-cli ， 接下来我们将使用 redis-cli 为例来进行演示：


	$ redis-cli -c -p 7000
	redis 127.0.0.1:7000> set foo bar
	-> Redirected to slot [12182] located at 127.0.0.1:7002
	OK
	redis 127.0.0.1:7002> set hello world
	-> Redirected to slot [866] located at 127.0.0.1:7000
	OK
	redis 127.0.0.1:7000> get foo
	-> Redirected to slot [12182] located at 127.0.0.1:7002
	"bar"
	redis 127.0.0.1:7000> get hello
	-> Redirected to slot [866] located at 127.0.0.1:7000
	"world"


**注意:** 如果你是使用脚本创建的集群节点，那么默认端口可能是从30001开始。

redis-cli 对集群的支持是非常基本的， 所以它总是依靠 Redis 集群节点来将它转向（redirect）至正确的节点。一个真正的（serious）集群客户端应该做得比这更好： 它应该用缓存记录起哈希槽与节点地址之间的映射（map）， 从而直接将命令发送到正确的节点上面。这种映射只会在集群的配置出现某些修改时变化， 比如说， 在一次故障转移（failover）之后， 或者系统管理员通过添加节点或移除节点来修改了集群的布局（layout）之后， 诸如此类。

使用redis-rb-cluster写一个例子
---

在展示如何使用集群进行故障转移、重新分片等操作之前， 我们需要创建一个示例应用， 了解一些与 Redis 集群客户端进行交互的基本方法。

在运行示例应用的过程中， 我们会尝试让节点进入失效状态， 又或者开始一次重新分片， 以此来观察 Redis 集群在真实世界运行时的表现， 并且为了让这个示例尽可能地有用， 我们会让这个应用向集群进行写操作。

本节将通过两个示例应用来展示 redis-rb-cluster 的基本用法， 以下是本节的第一个示例应用， 它是一个名为 example.rb 的文件， 包含在redis-rb-cluster 项目里面


     1  require './cluster'
     2
     3  startup_nodes = [
     4      {:host => "127.0.0.1", :port => 7000},
     5      {:host => "127.0.0.1", :port => 7001}
     6  ]
     7  rc = RedisCluster.new(startup_nodes,32,:timeout => 0.1)
     8
     9  last = false
    10
    11  while not last
    12      begin
    13          last = rc.get("__last__")
    14          last = 0 if !last
    15      rescue => e
    16          puts "error #{e.to_s}"
    17          sleep 1
    18      end
    19  end
    20
    21  ((last.to_i+1)..1000000000).each{|x|
    22      begin
    23          rc.set("foo#{x}",x)
    24          puts rc.get("foo#{x}")
    25          rc.set("__last__",x)
    26      rescue => e
    27          puts "error #{e.to_s}"
    28      end
    29      sleep 0.1
    30  }

这个应用所做的工作非常简单： 它不断地以 `foo<number>` 为键， `number` 为值， 使用 SET 命令向数据库设置键值对:

* SET foo0 0
* SET foo1 1
* SET foo2 2
* And so forth...

代码中的每个集群操作都使用一个 begin 和 rescue 代码块（block）包裹着， 因为我们希望在代码出错时， 将错误打印到终端上面， 而不希望应用因为异常（exception）而退出。

代码的第七行是代码中第一个有趣的地方， 它创建了一个 Redis 集群对象， 其中创建对象所使用的参数及其意义如下：第一个参数是记录了启动节点的 startup_nodes 列表， 列表中包含了两个集群节点的地址。第二个参数指定了对于集群中的各个不同的节点， Redis 集群对象可以获得的最大连接数 ，第三个参数 timeout 指定了一个命令在执行多久之后， 才会被看作是执行失败。

启动列表中并不需要包含所有集群节点的地址， 但这些地址中至少要有一个是有效的： 一旦 redis-rb-cluster 成功连接上集群中的某个节点时， 集群节点列表就会被自动更新， 任何真正的的集群客户端都应该这样做。

现在， 程序创建的 Redis 集群对象实例被保存到 rc 变量里面， 我们可以将这个对象当作普通 Redis 对象实例来使用。

在十一至十九行， 我们先尝试阅读计数器中的值， 如果计数器不存在的话， 我们才将计数器初始化为 0 ： 通过将计数值保存到 Redis 的计数器里面， 我们可以在示例重启之后， 仍然继续之前的执行过程， 而不必每次重启之后都从 foo0 开始重新设置键值对。为了让程序在集群下线的情况下， 仍然不断地尝试读取计数器的值， 我们将读取操作包含在了一个 while 循环里面， 一般的应用程序并不需要如此小心。

二十一至三十行是程序的主循环， 这个循环负责设置键值对， 并在设置出错时打印错误信息。程序在主循环的末尾添加了一个 sleep 调用， 让写操作的执行速度变慢， 帮助执行示例的人更容易看清程序的输出。执行 example.rb 程序将产生以下输出：

	ruby ./example.rb
	1
	2
	3
	4
	5
	6
	7
	8
	9
	^C (I stopped the program here)

这个程序并不是十分有趣， 稍后我们就会看到一个更有趣的集群应用示例， 不过在此之前， 让我们先使用这个示例来演示集群的重新分片操作。

集群重新分片
---

现在， 让我们来试试对集群进行重新分片操作。在执行重新分片的过程中， 请让你的 example.rb 程序处于运行状态， 这样你就会看到， 重新分片并不会对正在运行的集群程序产生任何影响， 你也可以考虑将 example.rb 中的 sleep 调用删掉， 从而让重新分片操作在近乎真实的写负载下执行
重新分片操作基本上就是将某些节点上的哈希槽移动到另外一些节点上面， 和创建集群一样， 重新分片也可以使用 redis-trib 程序来执行
执行以下命令可以开始一次重新分片操作：

    ./redis-trib.rb reshard 127.0.0.1:7000

你只需要指定集群中其中一个节点的地址， redis-trib 就会自动找到集群中的其他节点。

目前 redis-trib 只能在管理员的协助下完成重新分片的工作， 要让 redis-trib 自动将哈希槽从一个节点移动到另一个节点， 目前来说还做不到

    你想移动多少个槽( 从1 到 16384)?

我们尝试从将100个槽重新分片， 如果 example.rb 程序一直运行着的话， 现在 1000 个槽里面应该有不少键了。

除了移动的哈希槽数量之外， redis-trib 还需要知道重新分片的目标， 也即是， 负责接收这 1000 个哈希槽的节点。

	$ redis-cli -p 7000 cluster nodes | grep myself
	97a3a64667477371c4479320d683e4c8db5858b1 :0 myself,master - 0 0 0 connected 0-5460

我的目标节点是 97a3a64667477371c4479320d683e4c8db5858b1.

现在需要指定从哪些节点来移动keys到目标节点 我输入的是all ，这样就会从其他每个master上取一些哈希槽。

最后确认后你将会看到每个redis-trib移动的槽的信息，每个key的移动的信息也会打印出来
在重新分片的过程中，你的例子程序是不会受到影响的,你可以停止或者重新启动多次。

在重新分片结束后你可以通过如下命令检查集群状态:

    ./redis-trib.rb check 127.0.0.1:7000


一个更有趣的程序
---

我们在前面使用的示例程序 example.rb 并不是十分有趣， 因为它只是不断地对集群进行写入， 但并不检查写入结果是否正确。 比如说， 集群可能会错误地将 example.rb 发送的所有 SET 命令都改成了 SET foo 42 ， 但因为 example.rb 并不检查写入后的值， 所以它不会意识到集群实际上写入的值是错误的 因为这个原因， redis-rb-cluster 项目包含了一个名为 consistency-test.rb 的示例应用， 这个应用比起 example.rb 有趣得多： 它创建了多个计数器（默认为 1000 个）， 并通过发送 INCR 命令来增加这些计数器的值。

在增加计数器值的同时， consistency-test.rb 还执行以下操作：
每次使用 INCR 命令更新一个计数器时， 应用会记录下计数器执行 INCR 命令之后应该有的值。 举个例子， 如果计数器的起始值为 0 ， 而这次是程序第 50 次向它发送 INCR 命令， 那么计数器的值应该是 50 。

在每次发送 INCR 命令之前， 程序会随机从集群中读取一个计数器的值， 并将它与自己记录的值进行对比， 看两个值是否相同。

换句话说， 这个程序是一个一致性检查器（consistency checker）： 如果集群在执行 INCR 命令的过程中， 丢失了某条 INCR 命令， 又或者多执行了某条客户端没有确认到的 INCR 命令， 那么检查器将察觉到这一点 —— 在前一种情况中， consistency-test.rb 记录的计数器值将比集群记录的计数器值要大； 而在后一种情况中， consistency-test.rb 记录的计数器值将比集群记录的计数器值要小。

运行 consistency-test 程序将产生类似以下的输出：

	$ ruby consistency-test.rb
	925 R (0 err) | 925 W (0 err) |
	5030 R (0 err) | 5030 W (0 err) |
	9261 R (0 err) | 9261 W (0 err) |
	13517 R (0 err) | 13517 W (0 err) |
	17780 R (0 err) | 17780 W (0 err) |
	22025 R (0 err) | 22025 W (0 err) |
	25818 R (0 err) | 25818 W (0 err) |

结果展示了执行的读和 写,和错误(由于系统不可用而没有接受的查询发生的错误）的数量.

如果程序察觉了不一致的情况出现， 它将在输出行的末尾显式不一致的详细情况。比如说， 如果我们在 consistency-test.rb 运行的过程中， 手动修改某个计数器的值：

	$ redis 127.0.0.1:7000> set key_217 0
	OK
	
	(in the other tab I see...)
	
	94774 R (0 err) | 94774 W (0 err) |
	98821 R (0 err) | 98821 W (0 err) |
	102886 R (0 err) | 102886 W (0 err) | 114 lost |
	107046 R (0 err) | 107046 W (0 err) | 114 lost |


在我们修改计数器值的时候， 计数器的正确值是 114 （执行了 114 次 INCR 命令）， 因为我们将计数器的值设成了 0 ， 所以 consistency-test.rb 会向我们报告说丢失了 114 个 INCR 命令。

这个程序作为测试程序很有意思，所以我们用这个程序来测试故障恢复.

测试故障转移
---

在执行本节操作的过程中， 请一直运行 consistency-test 程序。
要触发一次故障转移， 最简单的办法就是令集群中的某个主节点进入下线状态。首先用以下命令列出集群中的所有主节点：

	$ redis-cli -p 7000 cluster nodes | grep master
	3e3a6cb0d9a9a87168e266b0a0b24026c0aae3f0 127.0.0.1:7001 master - 0 1385482984082 0 connected 5960-10921
	2938205e12de373867bf38f1ca29d31d0ddb3e46 127.0.0.1:7002 master - 0 1385482983582 0 connected 11423-16383
	97a3a64667477371c4479320d683e4c8db5858b1 :0 myself,master - 0 0 0 connected 0-5959 10922-11422

通过命令输出得知端口号为 7000 、 7001 和 7002 的节点都是主节点， 然后我们可以通过向端口号为7002 的主节点发送 **DEBUG SEGFAULT** 命令， 让这个主节点崩溃：

	$ redis-cli -p 7002 debug segfault
	Error: Server closed the connection

现在，切换到运行着 consistency-test 的标签页， 可以看到， consistency-test 在 7002 下线之后的一段时间里将产生大量的错误警告信息：

	18849 R (0 err) | 18849 W (0 err) |
	23151 R (0 err) | 23151 W (0 err) |
	27302 R (0 err) | 27302 W (0 err) |
	
	... many error warnings here ...
	
	29659 R (578 err) | 29660 W (577 err) |
	33749 R (578 err) | 33750 W (577 err) |
	37918 R (578 err) | 37919 W (577 err) |
	42077 R (578 err) | 42078 W (577 err) |


从 consistency-test 的这段输出可以看到， 集群在执行故障转移期间， 总共丢失了 578 个读命令和 577 个写命令， 但是并没有产生任何数据不一致。这听上去可能有点奇怪， 因为在教程的开头我们提到过， Redis 使用的是异步复制， 在执行故障转移期间， 集群可能会丢失写命令。但是在实际上， 丢失命令的情况并不常见， 因为 Redis 几乎是同时执行将命令回复发送给客户端， 以及将命令复制给从节点这两个操作， 所以实际上造成命令丢失的时间窗口是非常小的。不过， 尽管出现的几率不高， 但丢失命令的情况还是有可能会出现的， 所以我们对 Redis 集群不能提供强一致性的这一描述仍然是正确的。现在， 让我们使用 cluster nodes 命令,查看集群在执行故障转移操作之后， 主从节点的布局情况：

	$ redis-cli -p 7000 cluster nodes
	3fc783611028b1707fd65345e763befb36454d73 127.0.0.1:7004 slave 3e3a6cb0d9a9a87168e266b0a0b24026c0aae3f0 0 1385503418521 0 connected
	a211e242fc6b22a9427fed61285e85892fa04e08 127.0.0.1:7003 slave 97a3a64667477371c4479320d683e4c8db5858b1 0 1385503419023 0 connected
	97a3a64667477371c4479320d683e4c8db5858b1 :0 myself,master - 0 0 0 connected 0-5959 10922-11422
	3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e 127.0.0.1:7005 master - 0 1385503419023 3 connected 11423-16383
	3e3a6cb0d9a9a87168e266b0a0b24026c0aae3f0 127.0.0.1:7001 master - 0 1385503417005 0 connected 5960-10921
	2938205e12de373867bf38f1ca29d31d0ddb3e46 127.0.0.1:7002 slave 3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e 0 1385503418016 3 connected


现在masters运行在 7000, 7001 和 7005端口上. 原来的master 7002现在变成了一个7005的一个从节点.

`CLUSTER NODES` 命令的输出看起来有点复杂,其实他非常的简单，含义如下:

* 节点ID
* IP:端口
* 标志: master, slave, myself, fail, ...
* 如果是个从节点, 这里是它的主节点的NODE ID
* 集群最近一次向节点发送 PING 命令之后， 过去了多长时间还没接到回复。.
* 节点最近一次返回 PONG 回复的时间。
* 节点的配置纪元（configuration epoch）：详细信息请参考 Redis 集群规范 。
* 本节点的网络连接情况：例如 connected 。
* 节点目前包含的槽：例如 127.0.0.1:7001 目前包含号码为 5960 至 10921 的哈希槽。

手动故障转移
---

有的时候在主节点没有任何问题的情况下强制手动故障转移也是很有必要的，比如想要升级主节点的Redis进程，我们可以通过故障转移将其转为slave再进行升级操作来避免对集群的可用性造成很大的影响。

Redis集群使用 CLUSTER FAILOVER命令来进行故障转移，不过要被转移的主节点的从节点上执行该命令
手动故障转移比主节点失败自动故障转移更加安全，因为手动故障转移时客户端的切换是在确保新的主节点完全复制了失败的旧的主节点数据的前提下下发生的，所以避免了数据的丢失。

执行手动故障转移时从节点日志如下:

    # Manual failover user request accepted.
    # Received replication offset for paused master manual failover: 347540
    # All master replication stream processed, manual failover can start.
    # Start of election delayed for 0 milliseconds (rank #0, offset 347540).
    # Starting a failover election for epoch 7545.
    # Failover election won: I'm the new master.

其基本过程如下：客户端不再链接我们淘汰的主节点，同时主节点向从节点发送复制偏移量,从节点得到复制偏移量后故障转移开始,接着通知主节点进行配置切换,当客户端在旧的master上解锁后重新连接到新的主节点上。

添加一个新节点
---

添加新的节点的基本过程就是添加一个空的节点然后移动一些数据给它，有两种情况，添加一个主节点和添加一个从节点（添加从节点时需要将这个新的节点设置为集群中某个节点的复制）

针对这两种情况，本节都会介绍，先从添加主节点开始.

两种情况第一步都是要添加 一个空的节点.

启动新的7006节点,使用的配置文件和以前的一样,只要把端口号改一下即可，过程如下:

* 在终端打开一个新的标签页.
* 进入cluster-test 目录.
* 创建并进入 7006文件夹.
* 和其他节点一样，创建redis.conf文件,需要将端口号改成7006.
* 最后启动节点 ../redis-server ./redis.conf
* 
如果正常的话，节点会正确的启动.

接下来使用redis-trib 来添加这个节点到现有的集群中去.

    ./redis-trib.rb add-node 127.0.0.1:7006 127.0.0.1:7000

可以看到.使用**addnode**命令来添加节点，第一个参数是新节点的地址，第二个参数是任意一个已经存在的节点的IP和端口.
我们可以看到新的节点已经添加到集群中:

	redis 127.0.0.1:7006> cluster nodes
	3e3a6cb0d9a9a87168e266b0a0b24026c0aae3f0 127.0.0.1:7001 master - 0 1385543178575 0 connected 5960-10921
	3fc783611028b1707fd65345e763befb36454d73 127.0.0.1:7004 slave 3e3a6cb0d9a9a87168e266b0a0b24026c0aae3f0 0 1385543179583 0 connected
	f093c80dde814da99c5cf72a7dd01590792b783b :0 myself,master - 0 0 0 connected
	2938205e12de373867bf38f1ca29d31d0ddb3e46 127.0.0.1:7002 slave 3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e 0 1385543178072 3 connected
	a211e242fc6b22a9427fed61285e85892fa04e08 127.0.0.1:7003 slave 97a3a64667477371c4479320d683e4c8db5858b1 0 1385543178575 0 connected
	97a3a64667477371c4479320d683e4c8db5858b1 127.0.0.1:7000 master - 0 1385543179080 0 connected 0-5959 10922-11422
	3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e 127.0.0.1:7005 master - 0 1385543177568 3 connected 11423-16383


新节点现在已经连接上了集群， 成为集群的一份子， 并且可以对客户端的命令请求进行转向了， 但是和其他主节点相比， 新节点还有两点区别：

* 新节点没有包含任何数据， 因为它没有包含任何哈希槽.
* 尽管新节点没有包含任何哈希槽， 但它仍然是一个主节点， 所以在集群需要将某个从节点升级为新的主节点时， 这个新节点不会被选中。

接下来， 只要使用 redis-trib 程序， 将集群中的某些哈希桶移动到新节点里面， 新节点就会成为真正的主节点了。

添加一个从节点
---

有两种方法添加从节点，可以像添加主节点一样使用redis-trib 命令，也可以像下面的例子一样使用 --slave选项:

    ./redis-trib.rb add-node --slave 127.0.0.1:7006 127.0.0.1:7000

此处的命令和添加一个主节点命令类似，此处并没有指定添加的这个从节点的主节点，这种情况下系统会在其他的复制集中的主节点中随机选取一个作为这个从节点的主节点。

你可以通过下面的命令指定主节点:

	./redis-trib.rb add-node --slave --master-id 3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e 127.0.0.1:7006 127.0.0.1:7000

也可以使用CLUSTER REPLICATE 命令添加.这个命令也可以改变一个从节点的主节点。

例如，要给主节点 127.0.0.1:7005添加一个从节点，该节点哈希槽的范围1423-16383, 节点 ID 3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e,我们需要链接新的节点（已经是空的主节点）并执行命令:

	redis 127.0.0.1:7006> cluster replicate 3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e

我们新的从节点有了一些哈希槽，其他的节点也知道（过几秒后会更新他们自己的配置），可以使用如下命令确认:

	$ redis-cli -p 7000 cluster nodes | grep slave | grep 3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e
	f093c80dde814da99c5cf72a7dd01590792b783b 127.0.0.1:7006 slave 3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e 0 1385543617702 3 connected
	2938205e12de373867bf38f1ca29d31d0ddb3e46 127.0.0.1:7002 slave 3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e 0 1385543617198 3 connected

节点 3c3a0c... 有两个从节点， 7002 (已经存在的) 和 7006 (新添加的).

移除一个节点
---

只要使用 `del-node` 命令即可:

    ./redis-trib del-node 127.0.0.1:7000 `<node-id>`

第一个参数是任意一个节点的地址,第二个节点是你想要移除的节点地址。

使用同样的方法移除主节点,不过在移除主节点前，需要**确保这个主节点是空的**. 如果不是空的,需要将这个节点的数据重新分片到其他主节点上.

替代移除主节点的方法是手动执行故障恢复，被移除的主节点会作为一个从节点存在，不过这种情况下不会减少集群节点的数量，也需要重新分片数据.

从节点的迁移
---

在Redis集群中会存在改变一个从节点的主节点的情况，需要执行如下命令 :

	CLUSTER REPLICATE <master-node-id>

在特定的场景下，不需要系统管理员的协助下，自动将一个从节点从当前的主节点切换到另一个主节 的自动重新配置的过程叫做复制迁移（从节点迁移），从节点的迁移能够提高整个Redis集群的可用性.

你可以阅读（Redis集群规范）[/topics/cluster-spec](/topics/cluster-spec.html)了解细节.

简短的概况一下从节点迁移

* 集群会在有从节点数量最多的主节点上进行从节点的迁移.
* 要在一个主节点上添加多个从节点.
* 参数来控制从节点迁移 replica-migration-barrier:你可以仔细阅读redis.conf 。
