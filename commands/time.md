---
layout: commands
title: time 命令 -- Redis中文资料站
permalink: commands/time.html
disqusIdentifier: command_time
disqusUrl: http://redis.cn/commands/time.html
commandsType: keys
---

The `TIME` command returns the current server time as a two items lists: a Unix
timestamp and the amount of microseconds already elapsed in the current second.
Basically the interface is very similar to the one of the `gettimeofday` system
call.

@return

@array-reply, specifically:

A multi bulk reply containing two elements:

* unix time in seconds.
* microseconds.

@examples

```cli
TIME
TIME
```
