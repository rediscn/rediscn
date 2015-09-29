---
layout: commands
title: cluster countkeysinslot 命令 -- Redis中文资料站
permalink: commands/cluster countkeysinslot.html
disqusIdentifier: command_cluster_countkeysinslot
disqusUrl: http://redis.cn/commands/cluster countkeysinslot.html
commandsType: cluster
---

Returns the number of keys in the specified Redis Cluster hash slot. The
command only queries the local data set, so contacting a node
that is not serving the specified hash slot will always result in a count of
zero being returned.

```
> CLUSTER COUNTKEYSINSLOT 7000
(integer) 50341
```

@return

@integer-reply: The number of keys in the specified hash slot, or an error if the hash slot is invalid.
