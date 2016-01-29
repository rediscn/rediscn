---
layout: commands
title: command info å‘½ä»¤ -- Redisä¸­æ–‡èµ„æ–™ç«™
permalink: commands/command info.html
disqusIdentifier: command_command_info
disqusUrl: http://redis.cn/commands/command info.html
commandsType: server
---

Returns @array-reply of details about multiple Redis commands.

Same result format as `COMMAND` except you can specify which commands
get returned.

If you request details about non-existing commands, their return
position will be nil.


## ·µ»ØÖµ

@array-reply: nested list of command details.

##Àý×Ó

```cli
COMMAND INFO get set eval
COMMAND INFO foo evalsha config bar
```
