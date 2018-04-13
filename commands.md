---
layout: index
title: Redis命令中心（Redis commands）
permalink: commands.html
disqusIdentifier: commands
disqusUrl: http://redis.cn/commands.html
excerpt : Redis命令大全，显示全部已知的redis命令，redis集群相关命令，近期也会翻译过来,Redis命令参考，也可以直接输入命令进行命令检索。
discuzTid: 850
---
<section id='commands'>
<div class='container'>
	<div class='text' style='text-align:left;'>
		 &nbsp; &nbsp;Redis命令十分丰富，包括的命令组有Cluster、Connection、Geo、Hashes、HyperLogLog、Keys、Lists、Pub/Sub、Scripting、Server、Sets、Sorted Sets、Strings、Transactions一共14个redis命令组两百多个redis命令，Redis中文命令大全。您可以通过下面的检索功能快速查找命令，已下是全部已知的redis命令列表。如果您有兴趣的话也可以查看我们的<a href="/map.html">网站结构图</a>,它以节点图的形式展示了所有redis命令。
	</div>
</div>
<nav>
          <div class='container'>
            <label>
              <span>过滤命令组:</span>
              <select class='command-reference-filter'>
                <option value=''>全部命令</option>
                <option value='cluster'>Cluster</option>
                <option value='connection'>Connection</option>
                <option value='geo'>Geo</option>
                <option value='hash'>Hashes</option>
                <option value='hyperloglog'>HyperLogLog</option>
                <option value='generic'>Keys</option>
                <option value='list'>Lists</option>
                <option value='pubsub'>Pub/Sub</option>
                <option value='scripting'>Scripting</option>
                <option value='server'>Server</option>
                <option value='set'>Sets</option>
                <option value='sorted_set'>Sorted Sets</option>
                <option value='string'>Strings</option>
                <option value='transactions'>Transactions</option>
              </select>
            </label>
            或者
            <label>
              <span>直接搜索:</span>
              <input autofocus='autofocus' class='js-command-reference-search' placeholder='例如 PING' />
            </label>
          </div>
        </nav>
<div class='container'>
          <ul>
            <li data-group='string' data-name='append'>
              <a href='/commands/append.html'>
                <span class='command'>
                  APPEND
                  <span class='args'>
                    key
                    value
                  </span>
                </span>
                <span class='summary'>追加一个值到key上</span>
              </a>
            </li>
            <li data-group='connection' data-name='auth'>
              <a href='/commands/auth.html'>
                <span class='command'>
                  AUTH
                  <span class='args'>
                    password
                  </span>
                </span>
                <span class='summary'>验证服务器命令</span>
              </a>
            </li>
            <li data-group='server' data-name='bgrewriteaof'>
              <a href='/commands/bgrewriteaof.html'>
                <span class='command'>
                  BGREWRITEAOF
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>异步重写追加文件命令</span>
              </a>
            </li>
            <li data-group='server' data-name='bgsave'>
              <a href='/commands/bgsave.html'>
                <span class='command'>
                  BGSAVE
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>异步保存数据集到磁盘上</span>
              </a>
            </li>
            <li data-group='string' data-name='bitcount'>
              <a href='/commands/bitcount.html'>
                <span class='command'>
                  BITCOUNT
                  <span class='args'>
                    key
                    [start end]
                  </span>
                </span>
                <span class='summary'>统计字符串指定起始位置的字节数</span>
              </a>
            </li>
             <li data-group='string' data-name='bitfield'>
              <a href='/commands/bitfield.html'>
                <span class='command'>
                  BITFIELD
                  <span class='args'>
                    key
                    [GET type offset]
                    [SET type offset value]
                    [INCRBY type offset increment]
                    [OVERFLOW WRAP|SAT|FAIL]
                  </span>
                </span>
                <span class='summary'>Perform arbitrary bitfield integer operations on strings</span>
              </a>
            </li>
            <li data-group='string' data-name='bitop'>
              <a href='/commands/bitop.html'>
                <span class='command'>
                  BITOP
                  <span class='args'>
                    operation
                    destkey
                    key [key ...]
                  </span>
                </span>
                <span class='summary'>Perform bitwise operations between strings</span>
              </a>
            </li>
            <li data-group='string' data-name='bitpos'>
              <a href='/commands/bitpos.html'>
                <span class='command'>
                  BITPOS
                  <span class='args'>
                    key
                    bit
                    [start]
                    [end]
                  </span>
                </span>
                <span class='summary'>Find first bit set or clear in a string</span>
              </a>
            </li>
            <li data-group='list' data-name='blpop'>
              <a href='/commands/blpop.html'>
                <span class='command'>
                  BLPOP
                  <span class='args'>
                    key [key ...]
                    timeout
                  </span>
                </span>
                <span class='summary'>删除，并获得该列表中的第一元素，或阻塞，直到有一个可用</span>
              </a>
            </li>
            <li data-group='list' data-name='brpop'>
              <a href='/commands/brpop.html'>
                <span class='command'>
                  BRPOP
                  <span class='args'>
                    key [key ...]
                    timeout
                  </span>
                </span>
                <span class='summary'>删除，并获得该列表中的最后一个元素，或阻塞，直到有一个可用</span>
              </a>
            </li>
            <li data-group='list' data-name='brpoplpush'>
              <a href='/commands/brpoplpush.html'>
                <span class='command'>
                  BRPOPLPUSH
                  <span class='args'>
                    source
                    destination
                    timeout
                  </span>
                </span>
                <span class='summary'>弹出一个列表的值，将它推到另一个列表，并返回它;或阻塞，直到有一个可用</span>
              </a>
            </li>
            <li data-group='server' data-name='client kill'>
              <a href='/commands/client-kill.html'>
                <span class='command'>
                  CLIENT KILL
                  <span class='args'>
                    [ip:port]
                    [ID client-id]
                    [TYPE normal|slave|pubsub]
                    [ADDR ip:port]
                    [SKIPME yes/no]
                  </span>
                </span>
                <span class='summary'>关闭客户端连接</span>
              </a>
            </li>
            <li data-group='server' data-name='client list'>
              <a href='/commands/client-list.html'>
                <span class='command'>
                  CLIENT LIST
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>获得客户端连接列表</span>
              </a>
            </li>
            <li data-group='server' data-name='client getname'>
              <a href='/commands/client-getname.html'>
                <span class='command'>
                  CLIENT GETNAME
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>获得当前连接名称</span>
              </a>
            </li>
            <li data-group='server' data-name='client pause'>
              <a href='/commands/client-pause.html'>
                <span class='command'>
                  CLIENT PAUSE
                  <span class='args'>
                    timeout
                  </span>
                </span>
                <span class='summary'>暂停处理客户端命令</span>
              </a>
            </li>
            <li data-group='server' data-name='client setname'>
              <a href='/commands/client-setname.html'>
                <span class='command'>
                  CLIENT SETNAME
                  <span class='args'>
                    connection-name
                  </span>
                </span>
                <span class='summary'>设置当前连接的名字</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster addslots'>
              <a href='/commands/cluster-addslots.html'>
                <span class='command'>
                  CLUSTER ADDSLOTS
                  <span class='args'>
                    slot [slot ...]
                  </span>
                </span>
                <span class='summary'>Assign new hash slots to receiving node</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster count-failure-reports'>
              <a href='/commands/cluster-count-failure-reports.html'>
                <span class='command'>
                  CLUSTER COUNT-FAILURE-REPORTS
                  <span class='args'>
                    node-id
                  </span>
                </span>
                <span class='summary'>Return the number of failure reports active for a given node</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster countkeysinslot'>
              <a href='/commands/cluster-countkeysinslot.html'>
                <span class='command'>
                  CLUSTER COUNTKEYSINSLOT
                  <span class='args'>
                    slot
                  </span>
                </span>
                <span class='summary'>Return the number of local keys in the specified hash slot</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster delslots'>
              <a href='/commands/cluster-delslots.html'>
                <span class='command'>
                  CLUSTER DELSLOTS
                  <span class='args'>
                    slot [slot ...]
                  </span>
                </span>
                <span class='summary'>Set hash slots as unbound in receiving node</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster failover'>
              <a href='/commands/cluster-failover.html'>
                <span class='command'>
                  CLUSTER FAILOVER
                  <span class='args'>
                    [FORCE|TAKEOVER]
                  </span>
                </span>
                <span class='summary'>Forces a slave to perform a manual failover of its master.</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster forget'>
              <a href='/commands/cluster-forget.html'>
                <span class='command'>
                  CLUSTER FORGET
                  <span class='args'>
                    node-id
                  </span>
                </span>
                <span class='summary'>Remove a node from the nodes table</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster getkeysinslot'>
              <a href='/commands/cluster-getkeysinslot.html'>
                <span class='command'>
                  CLUSTER GETKEYSINSLOT
                  <span class='args'>
                    slot
                    count
                  </span>
                </span>
                <span class='summary'>Return local key names in the specified hash slot</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster info'>
              <a href='/commands/cluster-info.html'>
                <span class='command'>
                  CLUSTER INFO
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>Provides info about Redis Cluster node state</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster keyslot'>
              <a href='/commands/cluster-keyslot.html'>
                <span class='command'>
                  CLUSTER KEYSLOT
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>Returns the hash slot of the specified key</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster meet'>
              <a href='/commands/cluster-meet.html'>
                <span class='command'>
                  CLUSTER MEET
                  <span class='args'>
                    ip
                    port
                  </span>
                </span>
                <span class='summary'>Force a node cluster to handshake with another node</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster nodes'>
              <a href='/commands/cluster-nodes.html'>
                <span class='command'>
                  CLUSTER NODES
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>Get Cluster config for the node</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster replicate'>
              <a href='/commands/cluster-replicate.html'>
                <span class='command'>
                  CLUSTER REPLICATE
                  <span class='args'>
                    node-id
                  </span>
                </span>
                <span class='summary'>Reconfigure a node as a slave of the specified master node</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster reset'>
              <a href='/commands/cluster-reset.html'>
                <span class='command'>
                  CLUSTER RESET
                  <span class='args'>
                    [HARD|SOFT]
                  </span>
                </span>
                <span class='summary'>Reset a Redis Cluster node</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster saveconfig'>
              <a href='/commands/cluster-saveconfig.html'>
                <span class='command'>
                  CLUSTER SAVECONFIG
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>Forces the node to save cluster state on disk</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster set-config-epoch'>
              <a href='/commands/cluster-set-config-epoch.html'>
                <span class='command'>
                  CLUSTER SET-CONFIG-EPOCH
                  <span class='args'>
                    config-epoch
                  </span>
                </span>
                <span class='summary'>Set the configuration epoch in a new node</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster setslot'>
              <a href='/commands/cluster-setslot.html'>
                <span class='command'>
                  CLUSTER SETSLOT
                  <span class='args'>
                    slot
                    IMPORTING|MIGRATING|STABLE|NODE
                    [node-id]
                  </span>
                </span>
                <span class='summary'>Bind an hash slot to a specific node</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster slaves'>
              <a href='/commands/cluster-slaves.html'>
                <span class='command'>
                  CLUSTER SLAVES
                  <span class='args'>
                    node-id
                  </span>
                </span>
                <span class='summary'>List slave nodes of the specified master node</span>
              </a>
            </li>
            <li data-group='cluster' data-name='cluster slots'>
              <a href='/commands/cluster-slots.html'>
                <span class='command'>
                  CLUSTER SLOTS
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>Get array of Cluster slot to node mappings</span>
              </a>
            </li>
            <li data-group='server' data-name='command'>
              <a href='/commands/command.html'>
                <span class='command'>
                  COMMAND
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>Get array of Redis command details</span>
              </a>
            </li>
            <li data-group='server' data-name='command count'>
              <a href='/commands/command-count.html'>
                <span class='command'>
                  COMMAND COUNT
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>Get total number of Redis commands</span>
              </a>
            </li>
            <li data-group='server' data-name='command getkeys'>
              <a href='/commands/command-getkeys.html'>
                <span class='command'>
                  COMMAND GETKEYS
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>Extract keys given a full Redis command</span>
              </a>
            </li>
            <li data-group='server' data-name='command info'>
              <a href='/commands/command-info.html'>
                <span class='command'>
                  COMMAND INFO
                  <span class='args'>
                    command-name [command-name ...]
                  </span>
                </span>
                <span class='summary'>Get array of specific Redis command details</span>
              </a>
            </li>
            <li data-group='server' data-name='config get'>
              <a href='/commands/config-get.html'>
                <span class='command'>
                  CONFIG GET
                  <span class='args'>
                    parameter
                  </span>
                </span>
                <span class='summary'>获取配置参数的值</span>
              </a>
            </li>
            <li data-group='server' data-name='config rewrite'>
              <a href='/commands/config-rewrite.html'>
                <span class='command'>
                  CONFIG REWRITE
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>从写内存中的配置文件</span>
              </a>
            </li>
            <li data-group='server' data-name='config set'>
              <a href='/commands/config-set.html'>
                <span class='command'>
                  CONFIG SET
                  <span class='args'>
                    parameter
                    value
                  </span>
                </span>
                <span class='summary'>设置配置文件</span>
              </a>
            </li>
            <li data-group='server' data-name='config resetstat'>
              <a href='/commands/config-resetstat.html'>
                <span class='command'>
                  CONFIG RESETSTAT
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>复位再分配使用info命令报告的统计</span>
              </a>
            </li>
            <li data-group='server' data-name='dbsize'>
              <a href='/commands/dbsize.html'>
                <span class='command'>
                  DBSIZE
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>返回当前数据库里面的keys数量</span>
              </a>
            </li>
            <li data-group='server' data-name='debug object'>
              <a href='/commands/debug-object.html'>
                <span class='command'>
                  DEBUG OBJECT
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>获取一个key的debug信息</span>
              </a>
            </li>
            <li data-group='server' data-name='debug segfault'>
              <a href='/commands/debug-segfault.html'>
                <span class='command'>
                  DEBUG SEGFAULT
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>使服务器崩溃命令</span>
              </a>
            </li>
            <li data-group='string' data-name='decr'>
              <a href='/commands/decr.html'>
                <span class='command'>
                  DECR
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>整数原子减1</span>
              </a>
            </li>
            <li data-group='string' data-name='decrby'>
              <a href='/commands/decrby.html'>
                <span class='command'>
                  DECRBY
                  <span class='args'>
                    key
                    decrement
                  </span>
                </span>
                <span class='summary'>原子减指定的整数</span>
              </a>
            </li>
            <li data-group='generic' data-name='del'>
              <a href='/commands/del.html'>
                <span class='command'>
                  DEL
                  <span class='args'>
                    key [key ...]
                  </span>
                </span>
                <span class='summary'>删除指定的key（一个或多个）</span>
              </a>
            </li>
            <li data-group='transactions' data-name='discard'>
              <a href='/commands/discard.html'>
                <span class='command'>
                  DISCARD
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>丢弃所有 MULTI 之后发的命令</span>
              </a>
            </li>
            <li data-group='generic' data-name='dump'>
              <a href='/commands/dump.html'>
                <span class='command'>
                  DUMP
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>导出key的值</span>
              </a>
            </li>
            <li data-group='connection' data-name='echo'>
              <a href='/commands/echo.html'>
                <span class='command'>
                  ECHO
                  <span class='args'>
                    message
                  </span>
                </span>
                <span class='summary'>回显输入的字符串</span>
              </a>
            </li>
            <li data-group='scripting' data-name='eval'>
              <a href='/commands/eval.html'>
                <span class='command'>
                  EVAL
                  <span class='args'>
                    script
                    numkeys
                    key [key ...]
                    arg [arg ...]
                  </span>
                </span>
                <span class='summary'>在服务器端执行 LUA 脚本</span>
              </a>
            </li>
            <li data-group='scripting' data-name='evalsha'>
              <a href='/commands/evalsha.html'>
                <span class='command'>
                  EVALSHA
                  <span class='args'>
                    sha1
                    numkeys
                    key [key ...]
                    arg [arg ...]
                  </span>
                </span>
                <span class='summary'>在服务器端执行 LUA 脚本</span>
              </a>
            </li>
            <li data-group='transactions' data-name='exec'>
              <a href='/commands/exec.html'>
                <span class='command'>
                  EXEC
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>执行所有 MULTI 之后发的命令</span>
              </a>
            </li>
            <li data-group='generic' data-name='exists'>
              <a href='/commands/exists.html'>
                <span class='command'>
                  EXISTS
                  <span class='args'>
                    key [key ...]
                  </span>
                </span>
                <span class='summary'>查询一个key是否存在</span>
              </a>
            </li>
            <li data-group='generic' data-name='expire'>
              <a href='/commands/expire.html'>
                <span class='command'>
                  EXPIRE
                  <span class='args'>
                    key
                    seconds
                  </span>
                </span>
                <span class='summary'>设置一个key的过期的秒数</span>
              </a>
            </li>
            <li data-group='generic' data-name='expireat'>
              <a href='/commands/expireat.html'>
                <span class='command'>
                  EXPIREAT
                  <span class='args'>
                    key
                    timestamp
                  </span>
                </span>
                <span class='summary'>设置一个UNIX时间戳的过期时间</span>
              </a>
            </li>
            <li data-group='server' data-name='flushall'>
              <a href='/commands/flushall.html'>
                <span class='command'>
                  FLUSHALL
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>清空所有数据库命令</span>
              </a>
            </li>
            <li data-group='server' data-name='flushdb'>
              <a href='/commands/flushdb.html'>
                <span class='command'>
                  FLUSHDB
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>清空当前的数据库命令</span>
              </a>
            </li>
            <li data-group='geo' data-name='geoadd'>
              <a href='/commands/geoadd.html'>
                <span class='command'>
                  GEOADD
                  <span class='args'>
                    key
                    longitude latitude member [longitude latitude member ...]
                  </span>
                </span>
                <span class='summary'>添加一个或多个地理空间位置到sorted set</span>
              </a>
            </li>
            <li data-group='geo' data-name='geohash'>
              <a href='/commands/geohash.html'>
                <span class='command'>
                  GEOHASH
                  <span class='args'>
                    key
                    member [member ...]
                  </span>
                </span>
                <span class='summary'>返回一个标准的地理空间的Geohash字符串</span>
              </a>
            </li>
            <li data-group='geo' data-name='geopos'>
              <a href='/commands/geopos.html'>
                <span class='command'>
                  GEOPOS
                  <span class='args'>
                    key
                    member [member ...]
                  </span>
                </span>
                <span class='summary'>返回地理空间的经纬度</span>
              </a>
            </li>
            <li data-group='geo' data-name='geodist'>
              <a href='/commands/geodist.html'>
                <span class='command'>
                  GEODIST
                  <span class='args'>
                    key
                    member1
                    member2
                    [unit]
                  </span>
                </span>
                <span class='summary'>返回两个地理空间之间的距离</span>
              </a>
            </li>
            <li data-group='geo' data-name='georadius'>
              <a href='/commands/georadius.html'>
                <span class='command'>
                  GEORADIUS
                  <span class='args'>
                    key
                    longitude
                    latitude
                    radius
                    m|km|ft|mi
                    [WITHCOORD]
                    [WITHDIST]
                    [WITHHASH]
                    [COUNT count]
                  </span>
                </span>
                <span class='summary'>查询指定半径内所有的地理空间元素的集合。</span>
              </a>
            </li>
            <li data-group='geo' data-name='georadiusbymember'>
              <a href='/commands/georadiusbymember.html'>
                <span class='command'>
                  GEORADIUSBYMEMBER
                  <span class='args'>
                    key
                    member
                    radius
                    m|km|ft|mi
                    [WITHCOORD]
                    [WITHDIST]
                    [WITHHASH]
                    [COUNT count]
                  </span>
                </span>
                <span class='summary'>查询指定半径内匹配到的最大距离的一个地理空间元素。</span>
              </a>
            </li>
            <li data-group='string' data-name='get'>
              <a href='/commands/get.html'>
                <span class='command'>
                  GET
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>返回key的value</span>
              </a>
            </li>
            <li data-group='string' data-name='getbit'>
              <a href='/commands/getbit.html'>
                <span class='command'>
                  GETBIT
                  <span class='args'>
                    key
                    offset
                  </span>
                </span>
                <span class='summary'>返回位的值存储在关键的字符串值的偏移量。</span>
              </a>
            </li>
            <li data-group='string' data-name='getrange'>
              <a href='/commands/getrange.html'>
                <span class='command'>
                  GETRANGE
                  <span class='args'>
                    key
                    start
                    end
                  </span>
                </span>
                <span class='summary'>获取存储在key上的值的一个子字符串</span>
              </a>
            </li>
            <li data-group='string' data-name='getset'>
              <a href='/commands/getset.html'>
                <span class='command'>
                  GETSET
                  <span class='args'>
                    key
                    value
                  </span>
                </span>
                <span class='summary'>设置一个key的value，并获取设置前的值</span>
              </a>
            </li>
            <li data-group='hash' data-name='hdel'>
              <a href='/commands/hdel.html'>
                <span class='command'>
                  HDEL
                  <span class='args'>
                    key
                    field [field ...]
                  </span>
                </span>
                <span class='summary'>删除一个或多个Hash的field</span>
              </a>
            </li>
            <li data-group='hash' data-name='hexists'>
              <a href='/commands/hexists.html'>
                <span class='command'>
                  HEXISTS
                  <span class='args'>
                    key
                    field
                  </span>
                </span>
                <span class='summary'>判断field是否存在于hash中</span>
              </a>
            </li>
            <li data-group='hash' data-name='hget'>
              <a href='/commands/hget.html'>
                <span class='command'>
                  HGET
                  <span class='args'>
                    key
                    field
                  </span>
                </span>
                <span class='summary'>获取hash中field的值</span>
              </a>
            </li>
            <li data-group='hash' data-name='hgetall'>
              <a href='/commands/hgetall.html'>
                <span class='command'>
                  HGETALL
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>从hash中读取全部的域和值</span>
              </a>
            </li>
            <li data-group='hash' data-name='hincrby'>
              <a href='/commands/hincrby.html'>
                <span class='command'>
                  HINCRBY
                  <span class='args'>
                    key
                    field
                    increment
                  </span>
                </span>
                <span class='summary'>将hash中指定域的值增加给定的数字</span>
              </a>
            </li>
            <li data-group='hash' data-name='hincrbyfloat'>
              <a href='/commands/hincrbyfloat.html'>
                <span class='command'>
                  HINCRBYFLOAT
                  <span class='args'>
                    key
                    field
                    increment
                  </span>
                </span>
                <span class='summary'>将hash中指定域的值增加给定的浮点数</span>
              </a>
            </li>
            <li data-group='hash' data-name='hkeys'>
              <a href='/commands/hkeys.html'>
                <span class='command'>
                  HKEYS
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>获取hash的所有字段</span>
              </a>
            </li>
            <li data-group='hash' data-name='hlen'>
              <a href='/commands/hlen.html'>
                <span class='command'>
                  HLEN
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>获取hash里所有字段的数量</span>
              </a>
            </li>
            <li data-group='hash' data-name='hmget'>
              <a href='/commands/hmget.html'>
                <span class='command'>
                  HMGET
                  <span class='args'>
                    key
                    field [field ...]
                  </span>
                </span>
                <span class='summary'>获取hash里面指定字段的值</span>
              </a>
            </li>
            <li data-group='hash' data-name='hmset'>
              <a href='/commands/hmset.html'>
                <span class='command'>
                  HMSET
                  <span class='args'>
                    key
                    field value [field value ...]
                  </span>
                </span>
                <span class='summary'>设置hash字段值</span>
              </a>
            </li>
            <li data-group='hash' data-name='hset'>
              <a href='/commands/hset.html'>
                <span class='command'>
                  HSET
                  <span class='args'>
                    key
                    field
                    value
                  </span>
                </span>
                <span class='summary'>设置hash里面一个字段的值</span>
              </a>
            </li>
            <li data-group='hash' data-name='hsetnx'>
              <a href='/commands/hsetnx.html'>
                <span class='command'>
                  HSETNX
                  <span class='args'>
                    key
                    field
                    value
                  </span>
                </span>
                <span class='summary'>设置hash的一个字段，只有当这个字段不存在时有效</span>
              </a>
            </li>
            <li data-group='hash' data-name='hstrlen'>
              <a href='/commands/hstrlen.html'>
                <span class='command'>
                  HSTRLEN
                  <span class='args'>
                    key
                    field
                  </span>
                </span>
                <span class='summary'>获取hash里面指定field的长度</span>
              </a>
            </li>
            <li data-group='hash' data-name='hvals'>
              <a href='/commands/hvals.html'>
                <span class='command'>
                  HVALS
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>获得hash的所有值</span>
              </a>
            </li>
            <li data-group='string' data-name='incr'>
              <a href='/commands/incr.html'>
                <span class='command'>
                  INCR
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>执行原子加1操作</span>
              </a>
            </li>
            <li data-group='string' data-name='incrby'>
              <a href='/commands/incrby.html'>
                <span class='command'>
                  INCRBY
                  <span class='args'>
                    key
                    increment
                  </span>
                </span>
                <span class='summary'>执行原子增加一个整数</span>
              </a>
            </li>
            <li data-group='string' data-name='incrbyfloat'>
              <a href='/commands/incrbyfloat.html'>
                <span class='command'>
                  INCRBYFLOAT
                  <span class='args'>
                    key
                    increment
                  </span>
                </span>
                <span class='summary'>执行原子增加一个浮点数</span>
              </a>
            </li>
            <li data-group='server' data-name='info'>
              <a href='/commands/info.html'>
                <span class='command'>
                  INFO
                  <span class='args'>
                    [section]
                  </span>
                </span>
                <span class='summary'>获得服务器的详细信息</span>
              </a>
            </li>
            <li data-group='generic' data-name='keys'>
              <a href='/commands/keys.html'>
                <span class='command'>
                  KEYS
                  <span class='args'>
                    pattern
                  </span>
                </span>
                <span class='summary'>查找所有匹配给定的模式的键</span>
              </a>
            </li>
            <li data-group='server' data-name='lastsave'>
              <a href='/commands/lastsave.html'>
                <span class='command'>
                  LASTSAVE
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>获得最后一次同步磁盘的时间</span>
              </a>
            </li>
            <li data-group='list' data-name='lindex'>
              <a href='/commands/lindex.html'>
                <span class='command'>
                  LINDEX
                  <span class='args'>
                    key
                    index
                  </span>
                </span>
                <span class='summary'>获取一个元素，通过其索引列表</span>
              </a>
            </li>
            <li data-group='list' data-name='linsert'>
              <a href='/commands/linsert.html'>
                <span class='command'>
                  LINSERT
                  <span class='args'>
                    key
                    BEFORE|AFTER
                    pivot
                    value
                  </span>
                </span>
                <span class='summary'>在列表中的另一个元素之前或之后插入一个元素</span>
              </a>
            </li>
            <li data-group='list' data-name='llen'>
              <a href='/commands/llen.html'>
                <span class='command'>
                  LLEN
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>获得队列(List)的长度</span>
              </a>
            </li>
            <li data-group='list' data-name='lpop'>
              <a href='/commands/lpop.html'>
                <span class='command'>
                  LPOP
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>从队列的左边出队一个元素</span>
              </a>
            </li>
            <li data-group='list' data-name='lpush'>
              <a href='/commands/lpush.html'>
                <span class='command'>
                  LPUSH
                  <span class='args'>
                    key
                    value [value ...]
                  </span>
                </span>
                <span class='summary'>从队列的左边入队一个或多个元素</span>
              </a>
            </li>
            <li data-group='list' data-name='lpushx'>
              <a href='/commands/lpushx.html'>
                <span class='command'>
                  LPUSHX
                  <span class='args'>
                    key
                    value
                  </span>
                </span>
                <span class='summary'>当队列存在时，从队到左边入队一个元素</span>
              </a>
            </li>
            <li data-group='list' data-name='lrange'>
              <a href='/commands/lrange.html'>
                <span class='command'>
                  LRANGE
                  <span class='args'>
                    key
                    start
                    stop
                  </span>
                </span>
                <span class='summary'>从列表中获取指定返回的元素</span>
              </a>
            </li>
            <li data-group='list' data-name='lrem'>
              <a href='/commands/lrem.html'>
                <span class='command'>
                  LREM
                  <span class='args'>
                    key
                    count
                    value
                  </span>
                </span>
                <span class='summary'>从列表中删除元素</span>
              </a>
            </li>
            <li data-group='list' data-name='lset'>
              <a href='/commands/lset.html'>
                <span class='command'>
                  LSET
                  <span class='args'>
                    key
                    index
                    value
                  </span>
                </span>
                <span class='summary'>设置队列里面一个元素的值</span>
              </a>
            </li>
            <li data-group='list' data-name='ltrim'>
              <a href='/commands/ltrim.html'>
                <span class='command'>
                  LTRIM
                  <span class='args'>
                    key
                    start
                    stop
                  </span>
                </span>
                <span class='summary'>修剪到指定范围内的清单</span>
              </a>
            </li>
            <li data-group='string' data-name='mget'>
              <a href='/commands/mget.html'>
                <span class='command'>
                  MGET
                  <span class='args'>
                    key [key ...]
                  </span>
                </span>
                <span class='summary'>获得所有key的值</span>
              </a>
            </li>
            <li data-group='generic' data-name='migrate'>
              <a href='/commands/migrate.html'>
                <span class='command'>
                  MIGRATE
                  <span class='args'>
                    host
                    port
                    key
                    destination-db
                    timeout
                    [COPY]
                    [REPLACE]
                  </span>
                </span>
                <span class='summary'>原子性的将key从redis的一个实例移到另一个实例</span>
              </a>
            </li>
            <li data-group='server' data-name='monitor'>
              <a href='/commands/monitor.html'>
                <span class='command'>
                  MONITOR
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>实时监控服务器</span>
              </a>
            </li>
            <li data-group='generic' data-name='move'>
              <a href='/commands/move.html'>
                <span class='command'>
                  MOVE
                  <span class='args'>
                    key
                    db
                  </span>
                </span>
                <span class='summary'>移动一个key到另一个数据库</span>
              </a>
            </li>
            <li data-group='string' data-name='mset'>
              <a href='/commands/mset.html'>
                <span class='command'>
                  MSET
                  <span class='args'>
                    key value [key value ...]
                  </span>
                </span>
                <span class='summary'>设置多个key value</span>
              </a>
            </li>
            <li data-group='string' data-name='msetnx'>
              <a href='/commands/msetnx.html'>
                <span class='command'>
                  MSETNX
                  <span class='args'>
                    key value [key value ...]
                  </span>
                </span>
                <span class='summary'>设置多个key value,仅当key存在时</span>
              </a>
            </li>
            <li data-group='transactions' data-name='multi'>
              <a href='/commands/multi.html'>
                <span class='command'>
                  MULTI
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>标记一个事务块开始</span>
              </a>
            </li>
            <li data-group='generic' data-name='object'>
              <a href='/commands/object.html'>
                <span class='command'>
                  OBJECT
                  <span class='args'>
                    subcommand
                    [arguments [arguments ...]]
                  </span>
                </span>
                <span class='summary'>检查内部的再分配对象</span>
              </a>
            </li>
            <li data-group='generic' data-name='persist'>
              <a href='/commands/persist.html'>
                <span class='command'>
                  PERSIST
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>移除key的过期时间</span>
              </a>
            </li>
            <li data-group='generic' data-name='pexpire'>
              <a href='/commands/pexpire.html'>
                <span class='command'>
                  PEXPIRE
                  <span class='args'>
                    key
                    milliseconds
                  </span>
                </span>
                <span class='summary'>设置key的有效时间以毫秒为单位</span>
              </a>
            </li>
            <li data-group='generic' data-name='pexpireat'>
              <a href='/commands/pexpireat.html'>
                <span class='command'>
                  PEXPIREAT
                  <span class='args'>
                    key
                    milliseconds-timestamp
                  </span>
                </span>
                <span class='summary'>设置key的到期UNIX时间戳以毫秒为单位</span>
              </a>
            </li>
            <li data-group='hyperloglog' data-name='pfadd'>
              <a href='/commands/pfadd.html'>
                <span class='command'>
                  PFADD
                  <span class='args'>
                    key
                    element [element ...]
                  </span>
                </span>
                <span class='summary'>将指定元素添加到HyperLogLog</span>
              </a>
            </li>
            <li data-group='hyperloglog' data-name='pfcount'>
              <a href='/commands/pfcount.html'>
                <span class='command'>
                  PFCOUNT
                  <span class='args'>
                    key [key ...]
                  </span>
                </span>
                <span class='summary'>Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).</span>
              </a>
            </li>
            <li data-group='hyperloglog' data-name='pfmerge'>
              <a href='/commands/pfmerge.html'>
                <span class='command'>
                  PFMERGE
                  <span class='args'>
                    destkey
                    sourcekey [sourcekey ...]
                  </span>
                </span>
                <span class='summary'>Merge N different HyperLogLogs into a single one.</span>
              </a>
            </li>
            <li data-group='connection' data-name='ping'>
              <a href='/commands/ping.html'>
                <span class='command'>
                  PING
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>Ping 服务器</span>
              </a>
            </li>
            <li data-group='string' data-name='psetex'>
              <a href='/commands/psetex.html'>
                <span class='command'>
                  PSETEX
                  <span class='args'>
                    key
                    milliseconds
                    value
                  </span>
                </span>
                <span class='summary'>Set the value and expiration in milliseconds of a key</span>
              </a>
            </li>
            <li data-group='pubsub' data-name='psubscribe'>
              <a href='/commands/psubscribe.html'>
                <span class='command'>
                  PSUBSCRIBE
                  <span class='args'>
                    pattern [pattern ...]
                  </span>
                </span>
                <span class='summary'>Listen for messages published to channels matching the given patterns</span>
              </a>
            </li>
            <li data-group='pubsub' data-name='pubsub'>
              <a href='/commands/pubsub.html'>
                <span class='command'>
                  PUBSUB
                  <span class='args'>
                    subcommand
                    [argument [argument ...]]
                  </span>
                </span>
                <span class='summary'>Inspect the state of the Pub/Sub subsystem</span>
              </a>
            </li>
            <li data-group='generic' data-name='pttl'>
              <a href='/commands/pttl.html'>
                <span class='command'>
                  PTTL
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>获取key的有效毫秒数</span>
              </a>
            </li>
            <li data-group='pubsub' data-name='publish'>
              <a href='/commands/publish.html'>
                <span class='command'>
                  PUBLISH
                  <span class='args'>
                    channel
                    message
                  </span>
                </span>
                <span class='summary'>发布一条消息到频道</span>
              </a>
            </li>
            <li data-group='pubsub' data-name='punsubscribe'>
              <a href='/commands/punsubscribe.html'>
                <span class='command'>
                  PUNSUBSCRIBE
                  <span class='args'>
                    [pattern [pattern ...]]
                  </span>
                </span>
                <span class='summary'>停止发布到匹配给定模式的渠道的消息听</span>
              </a>
            </li>
            <li data-group='connection' data-name='quit'>
              <a href='/commands/quit.html'>
                <span class='command'>
                  QUIT
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>关闭连接，退出</span>
              </a>
            </li>
            <li data-group='generic' data-name='randomkey'>
              <a href='/commands/randomkey.html'>
                <span class='command'>
                  RANDOMKEY
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>返回一个随机的key</span>
              </a>
            </li>
            <li data-group='cluster' data-name='readonly'>
              <a href='/commands/readonly.html'>
                <span class='command'>
                  READONLY
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>Enables read queries for a connection to a cluster slave node</span>
              </a>
            </li>
            <li data-group='cluster' data-name='readwrite'>
              <a href='/commands/readwrite.html'>
                <span class='command'>
                  READWRITE
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>Disables read queries for a connection to a cluster slave node</span>
              </a>
            </li>
            <li data-group='generic' data-name='rename'>
              <a href='/commands/rename.html'>
                <span class='command'>
                  RENAME
                  <span class='args'>
                    key
                    newkey
                  </span>
                </span>
                <span class='summary'>将一个key重命名</span>
              </a>
            </li>
            <li data-group='generic' data-name='renamenx'>
              <a href='/commands/renamenx.html'>
                <span class='command'>
                  RENAMENX
                  <span class='args'>
                    key
                    newkey
                  </span>
                </span>
                <span class='summary'>重命名一个key,新的key必须是不存在的key</span>
              </a>
            </li>
            <li data-group='generic' data-name='restore'>
              <a href='/commands/restore.html'>
                <span class='command'>
                  RESTORE
                  <span class='args'>
                    key
                    ttl
                    serialized-value
                    [REPLACE]
                  </span>
                </span>
                <span class='summary'>Create a key using the provided serialized value, previously obtained using DUMP.</span>
              </a>
            </li>
            <li data-group='server' data-name='role'>
              <a href='/commands/role.html'>
                <span class='command'>
                  ROLE
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>Return the role of the instance in the context of replication</span>
              </a>
            </li>
            <li data-group='list' data-name='rpop'>
              <a href='/commands/rpop.html'>
                <span class='command'>
                  RPOP
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>从队列的右边出队一个元</span>
              </a>
            </li>
            <li data-group='list' data-name='rpoplpush'>
              <a href='/commands/rpoplpush.html'>
                <span class='command'>
                  RPOPLPUSH
                  <span class='args'>
                    source
                    destination
                  </span>
                </span>
                <span class='summary'>删除列表中的最后一个元素，将其追加到另一个列表</span>
              </a>
            </li>
            <li data-group='list' data-name='rpush'>
              <a href='/commands/rpush.html'>
                <span class='command'>
                  RPUSH
                  <span class='args'>
                    key
                    value [value ...]
                  </span>
                </span>
                <span class='summary'>从队列的右边入队一个元素</span>
              </a>
            </li>
            <li data-group='list' data-name='rpushx'>
              <a href='/commands/rpushx.html'>
                <span class='command'>
                  RPUSHX
                  <span class='args'>
                    key
                    value
                  </span>
                </span>
                <span class='summary'>从队列的右边入队一个元素，仅队列存在时有效</span>
              </a>
            </li>
            <li data-group='set' data-name='sadd'>
              <a href='/commands/sadd.html'>
                <span class='command'>
                  SADD
                  <span class='args'>
                    key
                    member [member ...]
                  </span>
                </span>
                <span class='summary'>添加一个或者多个元素到集合(set)里</span>
              </a>
            </li>
            <li data-group='server' data-name='save'>
              <a href='/commands/save.html'>
                <span class='command'>
                  SAVE
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>同步数据到磁盘上</span>
              </a>
            </li>
            <li data-group='set' data-name='scard'>
              <a href='/commands/scard.html'>
                <span class='command'>
                  SCARD
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>获取集合里面的元素数量</span>
              </a>
            </li>
            <li data-group='scripting' data-name='script exists'>
              <a href='/commands/script-exists.html'>
                <span class='command'>
                  SCRIPT EXISTS
                  <span class='args'>
                    script [script ...]
                  </span>
                </span>
                <span class='summary'>Check existence of scripts in the script cache.</span>
              </a>
            </li>
            <li data-group='scripting' data-name='script flush'>
              <a href='/commands/script-flush.html'>
                <span class='command'>
                  SCRIPT FLUSH
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>删除服务器缓存中所有Lua脚本。</span>
              </a>
            </li>
            <li data-group='scripting' data-name='script kill'>
              <a href='/commands/script-kill.html'>
                <span class='command'>
                  SCRIPT KILL
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>杀死当前正在运行的 Lua 脚本。</span>
              </a>
            </li>
            <li data-group='scripting' data-name='script load'>
              <a href='/commands/script-load.html'>
                <span class='command'>
                  SCRIPT LOAD
                  <span class='args'>
                    script
                  </span>
                </span>
                <span class='summary'>从服务器缓存中装载一个Lua脚本。</span>
              </a>
            </li>
            <li data-group='set' data-name='sdiff'>
              <a href='/commands/sdiff.html'>
                <span class='command'>
                  SDIFF
                  <span class='args'>
                    key [key ...]
                  </span>
                </span>
                <span class='summary'>获得队列不存在的元素</span>
              </a>
            </li>
            <li data-group='set' data-name='sdiffstore'>
              <a href='/commands/sdiffstore.html'>
                <span class='command'>
                  SDIFFSTORE
                  <span class='args'>
                    destination
                    key [key ...]
                  </span>
                </span>
                <span class='summary'>获得队列不存在的元素，并存储在一个关键的结果集</span>
              </a>
            </li>
            <li data-group='connection' data-name='select'>
              <a href='/commands/select.html'>
                <span class='command'>
                  SELECT
                  <span class='args'>
                    index
                  </span>
                </span>
                <span class='summary'>选择新数据库</span>
              </a>
            </li>
            <li data-group='string' data-name='set'>
              <a href='/commands/set.html'>
                <span class='command'>
                  SET
                  <span class='args'>
                    key
                    value
                    [EX seconds]
                    [PX milliseconds]
                    [NX|XX]
                  </span>
                </span>
                <span class='summary'>设置一个key的value值</span>
              </a>
            </li>
            <li data-group='string' data-name='setbit'>
              <a href='/commands/setbit.html'>
                <span class='command'>
                  SETBIT
                  <span class='args'>
                    key
                    offset
                    value
                  </span>
                </span>
                <span class='summary'>Sets or clears the bit at offset in the string value stored at key</span>
              </a>
            </li>
            <li data-group='string' data-name='setex'>
              <a href='/commands/setex.html'>
                <span class='command'>
                  SETEX
                  <span class='args'>
                    key
                    seconds
                    value
                  </span>
                </span>
                <span class='summary'>设置key-value并设置过期时间（单位：秒）</span>
              </a>
            </li>
            <li data-group='string' data-name='setnx'>
              <a href='/commands/setnx.html'>
                <span class='command'>
                  SETNX
                  <span class='args'>
                    key
                    value
                  </span>
                </span>
                <span class='summary'>设置的一个关键的价值，只有当该键不存在</span>
              </a>
            </li>
            <li data-group='string' data-name='setrange'>
              <a href='/commands/setrange.html'>
                <span class='command'>
                  SETRANGE
                  <span class='args'>
                    key
                    offset
                    value
                  </span>
                </span>
                <span class='summary'>Overwrite part of a string at key starting at the specified offset</span>
              </a>
            </li>
            <li data-group='server' data-name='shutdown'>
              <a href='/commands/shutdown.html'>
                <span class='command'>
                  SHUTDOWN
                  <span class='args'>
                    [NOSAVE]
                    [SAVE]
                  </span>
                </span>
                <span class='summary'>关闭服务</span>
              </a>
            </li>
            <li data-group='set' data-name='sinter'>
              <a href='/commands/sinter.html'>
                <span class='command'>
                  SINTER
                  <span class='args'>
                    key [key ...]
                  </span>
                </span>
                <span class='summary'>获得两个集合的交集</span>
              </a>
            </li>
            <li data-group='set' data-name='sinterstore'>
              <a href='/commands/sinterstore.html'>
                <span class='command'>
                  SINTERSTORE
                  <span class='args'>
                    destination
                    key [key ...]
                  </span>
                </span>
                <span class='summary'>获得两个集合的交集，并存储在一个关键的结果集</span>
              </a>
            </li>
            <li data-group='set' data-name='sismember'>
              <a href='/commands/sismember.html'>
                <span class='command'>
                  SISMEMBER
                  <span class='args'>
                    key
                    member
                  </span>
                </span>
                <span class='summary'>确定一个给定的值是一个集合的成员</span>
              </a>
            </li>
            <li data-group='server' data-name='slaveof'>
              <a href='/commands/slaveof.html'>
                <span class='command'>
                  SLAVEOF
                  <span class='args'>
                    host
                    port
                  </span>
                </span>
                <span class='summary'>指定当前服务器的主服务器</span>
              </a>
            </li>
            <li data-group='server' data-name='slowlog'>
              <a href='/commands/slowlog.html'>
                <span class='command'>
                  SLOWLOG
                  <span class='args'>
                    subcommand
                    [argument]
                  </span>
                </span>
                <span class='summary'>管理再分配的慢查询日志</span>
              </a>
            </li>
            <li data-group='set' data-name='smembers'>
              <a href='/commands/smembers.html'>
                <span class='command'>
                  SMEMBERS
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>获取集合里面的所有元素</span>
              </a>
            </li>
            <li data-group='set' data-name='smove'>
              <a href='/commands/smove.html'>
                <span class='command'>
                  SMOVE
                  <span class='args'>
                    source
                    destination
                    member
                  </span>
                </span>
                <span class='summary'>移动集合里面的一个元素到另一个集合</span>
              </a>
            </li>
            <li data-group='generic' data-name='sort'>
              <a href='/commands/sort.html'>
                <span class='command'>
                  SORT
                  <span class='args'>
                    key
                    [BY pattern]
                    [LIMIT offset count]
                    [GET pattern [GET pattern ...]]
                    [ASC|DESC]
                    [ALPHA]
                    [STORE destination]
                  </span>
                </span>
                <span class='summary'>对队列、集合、有序集合排序</span>
              </a>
            </li>
            <li data-group='set' data-name='spop'>
              <a href='/commands/spop.html'>
                <span class='command'>
                  SPOP
                  <span class='args'>
                    key
                    [count]
                  </span>
                </span>
                <span class='summary'>删除并获取一个集合里面的元素</span>
              </a>
            </li>
            <li data-group='set' data-name='srandmember'>
              <a href='/commands/srandmember.html'>
                <span class='command'>
                  SRANDMEMBER
                  <span class='args'>
                    key
                    [count]
                  </span>
                </span>
                <span class='summary'>从集合里面随机获取一个元素</span>
              </a>
            </li>
            <li data-group='set' data-name='srem'>
              <a href='/commands/srem.html'>
                <span class='command'>
                  SREM
                  <span class='args'>
                    key
                    member [member ...]
                  </span>
                </span>
                <span class='summary'>从集合里删除一个或多个元素</span>
              </a>
            </li>
            <li data-group='string' data-name='strlen'>
              <a href='/commands/strlen.html'>
                <span class='command'>
                  STRLEN
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>获取指定key值的长度</span>
              </a>
            </li>
            <li data-group='pubsub' data-name='subscribe'>
              <a href='/commands/subscribe.html'>
                <span class='command'>
                  SUBSCRIBE
                  <span class='args'>
                    channel [channel ...]
                  </span>
                </span>
                <span class='summary'>监听频道发布的消息</span>
              </a>
            </li>
            <li data-group='set' data-name='sunion'>
              <a href='/commands/sunion.html'>
                <span class='command'>
                  SUNION
                  <span class='args'>
                    key [key ...]
                  </span>
                </span>
                <span class='summary'>添加多个set元素</span>
              </a>
            </li>
            <li data-group='set' data-name='sunionstore'>
              <a href='/commands/sunionstore.html'>
                <span class='command'>
                  SUNIONSTORE
                  <span class='args'>
                    destination
                    key [key ...]
                  </span>
                </span>
                <span class='summary'>合并set元素，并将结果存入新的set里面</span>
              </a>
            </li>
            <li data-group='server' data-name='sync'>
              <a href='/commands/sync.html'>
                <span class='command'>
                  SYNC
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>用于复制的内部命令</span>
              </a>
            </li>
            <li data-group='server' data-name='time'>
              <a href='/commands/time.html'>
                <span class='command'>
                  TIME
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>返回当前服务器时间</span>
              </a>
            </li>
            <li data-group='generic' data-name='ttl'>
              <a href='/commands/ttl.html'>
                <span class='command'>
                  TTL
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>获取key的有效时间（单位：秒）</span>
              </a>
            </li>
            <li data-group='generic' data-name='type'>
              <a href='/commands/type.html'>
                <span class='command'>
                  TYPE
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>获取key的存储类型</span>
              </a>
            </li>
            <li data-group='pubsub' data-name='unsubscribe'>
              <a href='/commands/unsubscribe.html'>
                <span class='command'>
                  UNSUBSCRIBE
                  <span class='args'>
                    [channel [channel ...]]
                  </span>
                </span>
                <span class='summary'>停止频道监听</span>
              </a>
            </li>
            <li data-group='transactions' data-name='unwatch'>
              <a href='/commands/unwatch.html'>
                <span class='command'>
                  UNWATCH
                  <span class='args'>
                  </span>
                </span>
                <span class='summary'>取消事务命令</span>
              </a>
            </li>
            <li data-group='generic' data-name='wait'>
              <a href='/commands/wait.html'>
                <span class='command'>
                  WAIT
                  <span class='args'>
                    numslaves
                    timeout
                  </span>
                </span>
                <span class='summary'>Wait for the synchronous replication of all the write commands sent in the context of the current connection</span>
              </a>
            </li>
            <li data-group='transactions' data-name='watch'>
              <a href='/commands/watch.html'>
                <span class='command'>
                  WATCH
                  <span class='args'>
                    key [key ...]
                  </span>
                </span>
                <span class='summary'>锁定key直到执行了 MULTI/EXEC 命令</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zadd'>
              <a href='/commands/zadd.html'>
                <span class='command'>
                  ZADD
                  <span class='args'>
                    key
                    [NX|XX]
                    [CH]
                    [INCR]
                    score member [score member ...]
                  </span>
                </span>
                <span class='summary'>添加到有序set的一个或多个成员，或更新的分数，如果它已经存在</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zcard'>
              <a href='/commands/zcard.html'>
                <span class='command'>
                  ZCARD
                  <span class='args'>
                    key
                  </span>
                </span>
                <span class='summary'>获取一个排序的集合中的成员数量</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zcount'>
              <a href='/commands/zcount.html'>
                <span class='command'>
                  ZCOUNT
                  <span class='args'>
                    key
                    min
                    max
                  </span>
                </span>
                <span class='summary'>返回分数范围内的成员数量</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zincrby'>
              <a href='/commands/zincrby.html'>
                <span class='command'>
                  ZINCRBY
                  <span class='args'>
                    key
                    increment
                    member
                  </span>
                </span>
                <span class='summary'>增量的一名成员在排序设置的评分</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zinterstore'>
              <a href='/commands/zinterstore.html'>
                <span class='command'>
                  ZINTERSTORE
                  <span class='args'>
                    destination
                    numkeys
                    key [key ...]
                    [WEIGHTS weight [weight ...]]
                    [AGGREGATE SUM|MIN|MAX]
                  </span>
                </span>
                <span class='summary'>相交多个排序集，导致排序的设置存储在一个新的关键</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zlexcount'>
              <a href='/commands/zlexcount.html'>
                <span class='command'>
                  ZLEXCOUNT
                  <span class='args'>
                    key
                    min
                    max
                  </span>
                </span>
                <span class='summary'>返回成员之间的成员数量</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zrange'>
              <a href='/commands/zrange.html'>
                <span class='command'>
                  ZRANGE
                  <span class='args'>
                    key
                    start
                    stop
                    [WITHSCORES]
                  </span>
                </span>
                <span class='summary'>根据指定的index返回，返回sorted set的成员列表</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zrangebylex'>
              <a href='/commands/zrangebylex.html'>
                <span class='command'>
                  ZRANGEBYLEX
                  <span class='args'>
                    key
                    min
                    max
                    [LIMIT offset count]
                  </span>
                </span>
                <span class='summary'>返回指定成员区间内的成员，按字典正序排列, 分数必须相同。</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zrevrangebylex'>
              <a href='/commands/zrevrangebylex.html'>
                <span class='command'>
                  ZREVRANGEBYLEX
                  <span class='args'>
                    key
                    max
                    min
                    [LIMIT offset count]
                  </span>
                </span>
                <span class='summary'>返回指定成员区间内的成员，按字典倒序排列, 分数必须相同</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zrangebyscore'>
              <a href='/commands/zrangebyscore.html'>
                <span class='command'>
                  ZRANGEBYSCORE
                  <span class='args'>
                    key
                    min
                    max
                    [WITHSCORES]
                    [LIMIT offset count]
                  </span>
                </span>
                <span class='summary'>返回有序集合中指定分数区间内的成员，分数由低到高排序。</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zrank'>
              <a href='/commands/zrank.html'>
                <span class='command'>
                  ZRANK
                  <span class='args'>
                    key
                    member
                  </span>
                </span>
                <span class='summary'>确定在排序集合成员的索引</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zrem'>
              <a href='/commands/zrem.html'>
                <span class='command'>
                  ZREM
                  <span class='args'>
                    key
                    member [member ...]
                  </span>
                </span>
                <span class='summary'>从排序的集合中删除一个或多个成员</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zremrangebylex'>
              <a href='/commands/zremrangebylex.html'>
                <span class='command'>
                  ZREMRANGEBYLEX
                  <span class='args'>
                    key
                    min
                    max
                  </span>
                </span>
                <span class='summary'>删除名称按字典由低到高排序成员之间所有成员。</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zremrangebyrank'>
              <a href='/commands/zremrangebyrank.html'>
                <span class='command'>
                  ZREMRANGEBYRANK
                  <span class='args'>
                    key
                    start
                    stop
                  </span>
                </span>
                <span class='summary'>在排序设置的所有成员在给定的索引中删除</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zremrangebyscore'>
              <a href='/commands/zremrangebyscore.html'>
                <span class='command'>
                  ZREMRANGEBYSCORE
                  <span class='args'>
                    key
                    min
                    max
                  </span>
                </span>
                <span class='summary'>删除一个排序的设置在给定的分数所有成员</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zrevrange'>
              <a href='/commands/zrevrange.html'>
                <span class='command'>
                  ZREVRANGE
                  <span class='args'>
                    key
                    start
                    stop
                    [WITHSCORES]
                  </span>
                </span>
                <span class='summary'>在排序的设置返回的成员范围，通过索引，下令从分数高到低</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zrevrangebyscore'>
              <a href='/commands/zrevrangebyscore.html'>
                <span class='command'>
                  ZREVRANGEBYSCORE
                  <span class='args'>
                    key
                    max
                    min
                    [WITHSCORES]
                    [LIMIT offset count]
                  </span>
                </span>
                <span class='summary'>返回有序集合中指定分数区间内的成员，分数由高到低排序。</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zrevrank'>
              <a href='/commands/zrevrank.html'>
                <span class='command'>
                  ZREVRANK
                  <span class='args'>
                    key
                    member
                  </span>
                </span>
                <span class='summary'>确定指数在排序集的成员，下令从分数高到低</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zscore'>
              <a href='/commands/zscore.html'>
                <span class='command'>
                  ZSCORE
                  <span class='args'>
                    key
                    member
                  </span>
                </span>
                <span class='summary'>获取成员在排序设置相关的比分</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zunionstore'>
              <a href='/commands/zunionstore.html'>
                <span class='command'>
                  ZUNIONSTORE
                  <span class='args'>
                    destination
                    numkeys
                    key [key ...]
                    [WEIGHTS weight [weight ...]]
                    [AGGREGATE SUM|MIN|MAX]
                  </span>
                </span>
                <span class='summary'>添加多个排序集和导致排序的设置存储在一个新的关键</span>
              </a>
            </li>
            <li data-group='generic' data-name='scan'>
              <a href='/commands/scan.html'>
                <span class='command'>
                  SCAN
                  <span class='args'>
                    cursor
                    [MATCH pattern]
                    [COUNT count]
                  </span>
                </span>
                <span class='summary'>增量迭代key</span>
              </a>
            </li>
            <li data-group='set' data-name='sscan'>
              <a href='/commands/sscan.html'>
                <span class='command'>
                  SSCAN
                  <span class='args'>
                    key
                    cursor
                    [MATCH pattern]
                    [COUNT count]
                  </span>
                </span>
                <span class='summary'>迭代set里面的元素</span>
              </a>
            </li>
            <li data-group='hash' data-name='hscan'>
              <a href='/commands/hscan.html'>
                <span class='command'>
                  HSCAN
                  <span class='args'>
                    key
                    cursor
                    [MATCH pattern]
                    [COUNT count]
                  </span>
                </span>
                <span class='summary'>迭代hash里面的元素</span>
              </a>
            </li>
            <li data-group='sorted_set' data-name='zscan'>
              <a href='/commands/zscan.html'>
                <span class='command'>
                  ZSCAN
                  <span class='args'>
                    key
                    cursor
                    [MATCH pattern]
                    [COUNT count]
                  </span>
                </span>
                <span class='summary'>迭代sorted sets里面的元素</span>
              </a>
            </li>
          </ul>
        </div>
<div class='container'>
	如果你对Redis命令使用有任何问题，欢迎到<a href="http://bbs.redis.cn/" target="_blank">Redis论坛</a>进行讨论,这里云集国内Redis使用者，一定有你想要的答案。
</div>
</section>