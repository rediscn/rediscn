---
layout: commands
title: config resetstat 命令 -- Redis中文资料站
permalink: commands/config resetstat.html
disqusIdentifier: command_config_resetstat
disqusUrl: http://redis.cn/commands/config resetstat.html
commandsType: server
---

Resets the statistics reported by Redis using the `INFO` command.

These are the counters that are reset:

* Keyspace hits
* Keyspace misses
* Number of commands processed
* Number of connections received
* Number of expired keys
* Number of rejected connections
* Latest fork(2) time
* The `aof_delayed_fsync` counter

## ����ֵ

@simple-string-reply: always `OK`.
