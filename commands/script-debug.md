---
layout: commands
title: script-debug 命令
permalink: commands/script-debug.html
disqusIdentifier: command_script-debug
disqusUrl: http://redis.cn/commands/script-debug.html
commandsType: scripting
discuzTid: 13912
---

Set the debug mode for subsequent scripts executed with `EVAL`. Redis includes a
complete Lua debugger, codename LDB, that can be used to make the task of
writing complex scripts much simpler. In debug mode Redis acts as a remote
debugging server and a client, such as `redis-cli`, can execute scripts step by
step, set breakpoints, inspect variables and more - for additional information
about LDB refer to the [Redis Lua debugger](/topics/ldb) page.
`EVAL`可以开启对后续脚本的调试。Redis包含完整Lua Debugger和codename LDB，这大大降低了复杂脚本编写的难度。
在调试模式下，Redis 即做调试服务器又做客户端，像`redis-cli` 可以单步执行，设置断点，观察变量等等，更多
LDB信息参见[Redis Lua debugger](/topics/ldb)

**Important note:** avoid debugging Lua scripts using your Redis production
server. Use a development server instead.
**注意**：可使用开发环境Redis服务器调试Lua脚本，避免在生产环境Redis服务器调试。

LDB can be enabled in one of two modes: asynchronous or synchronous. In
asynchronous mode the server creates a forked debugging session that does not
block and all changes to the data are **rolled back** after the session
finishes, so debugging can be restarted using the same initial state. The
alternative synchronous debug mode blocks the server while the debugging session
is active and retains all changes to the data set once it ends.

* `YES`. Enable non-blocking asynchronous debugging of Lua scripts (changes are discarded).
* `SYNC`. Enable blocking synchronous debugging of Lua scripts (saves changes to data).
* `NO`. Disables scripts debug mode.

LDB可以设置成两种模式：同步和异步。异步模式下，服务器会创建新的调试连接，不阻塞其他连接，同时在调试连接结束后会回滚所有的数据修改，
这可以保证再次调试时初始状态不变。同步模式下，调试过程中，服务器其他连接会被阻塞，当调试结束后，所有的数据修改会被保存。

* `YES`. 打开非阻塞异步调试模式，调试Lua脚本(回退数据修改)
* `SYNC`. 打开阻塞同步调试模式，调试Lua脚本(保留数据修改稿)
* `NO`.  关闭脚本调试模式
## 返回值


[simple-string-reply](/topics/protocol.html#simple-string-reply): `OK`.

