---
layout: commands
title: command-getkeys 命令
permalink: commands/command-getkeys.html
disqusIdentifier: command_command-getkeys
disqusUrl: http://redis.cn/commands/command-getkeys.html
commandsType: server
discuzTid: 937
tranAuthor: wangqiang
---

以[array-reply](/topics/protocol.html#array-reply)的形式从完整的Redis命令返回key。

`COMMAND GETKEYS`是一个辅助命令，让你可以从完整的Redis命令中找到key。

`COMMAND`显示了某些命令拥有可变位置的key，这意味着必须分析完整的命令才能找到要存储或者检索的key。
你可以使用`COMMAND GETKEYS`直接从Redis解析命令的方式来发现key的位置。


## 返回值

[array-reply](/topics/protocol.html#array-reply)：给定命令中的key列表。

## 例子

```cli
COMMAND GETKEYS MSET a b c d e f
COMMAND GETKEYS EVAL "not consulted" 3 key1 key2 key3 arg1 arg2 arg3 argN
COMMAND GETKEYS SORT mylist ALPHA STORE outlist
```
