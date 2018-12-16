---
layout: commands
title: role 命令
permalink: commands/role.html
disqusIdentifier: command_role
disqusUrl: http://redis.cn/commands/role.html
commandsType: server
discuzTid: 1031
tranAuthor: wangqiang
---

通过返回实例当前是`master`，`slave`还是`sentinel`来提供有关Redis实例在复制环境中的角色的信息。此命令还返回有关复制状态（如果角色是master或者slave）或者监听的master名称列表（如果角色是sentinel）的额外信息。

## 输出格式

此命令返回一个元素数组。第一个元素是实例的角色，即以下字符串之一：

* "master"
* "slave"
* "sentinel"

数组的其他额外元素取决于实例的角色。

## 主节点输出

在主节点中调用`ROLE`命令时的输出示例：

```
1) "master"
2) (integer) 3129659
3) 1) 1) "127.0.0.1"
      2) "9001"
      3) "3129242"
   2) 1) "127.0.0.1"
      2) "9002"
      3) "3129543"
```

主节点输出由以下部分组成：

1. 字符串`master`。
2. 当前主节点的复制偏移量，它是主节点和从节点共享的偏移量，用于理解在部分重新同步中，从节点需要提取以继续的复制流部分。
3. 由三个元素组成的代表已连接的从节点的数组。每一个子数组包含了从节点的IP，端口和最后确认的复制偏移量。

## 从节点输出

在从节点中调用`ROLE`命令时的输出示例：

```
1) "slave"
2) "127.0.0.1"
3) (integer) 9000
4) "connected"
5) (integer) 3167038
```

从节点输出由以下部分组成：

1. 字符串`slave`。
2. 主节点的IP。
3. 主节点的端口号。
4. 从主节点的视角来看的复制状态，可以是`connect`（实例需要连接它的主节点），`connecting`（主从正在建立连接），`sync`（主从节点正在尝试执行同步），`connected`（从节点在线）。
5. 到目前为止从主从复制偏移量接收的数据量。

## 哨兵输出

哨兵输出的一个示例：

```
1) "sentinel"
2) 1) "resque-master"
   2) "html-fragments-master"
   3) "stats-master"
   4) "metadata-master"
```

哨兵输出由以下部分组成：

1. 字符串`sentinel`。
2. 当前哨兵实例监听的主节点名称数组。

## 返回值

[array-reply](/topics/protocol.html#array-reply)：第一个元素是`master`、`slave`、`sentinel`之一，其余元素根据角色而定，如上所示。

## 历史

* 此命令是在Redis稳定版本中引入的，特别是Redis 2.8.12。

## 例子

```cli
ROLE
```
