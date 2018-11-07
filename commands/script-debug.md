---
layout: commands
title: script-debug 命令
permalink: commands/script-debug.html
disqusIdentifier: command_script-debug
disqusUrl: http://redis.cn/commands/script-debug.html
commandsType: scripting
discuzTid: 13912
tranAuhtor: gqhao
---

使用`EVAL`可以开启对脚本的调试。Redis包含完整Lua Debugger和codename LDB，这大大降低了复杂脚本编写的难度。
在调试模式下，Redis 既做调试服务器又做客户端，像`redis-cli` 可以单步执行，设置断点，观察变量等等，更多
LDB信息参见[Redis Lua debugger](/topics/ldb.html)

**注意**：使用开发环境Redis服务器调试Lua脚本，避免在生产环境Redis服务器调试。

LDB可以设置成两种模式：同步和异步。异步模式下，服务器会创建新的调试连接，不阻塞其他连接，同时在调试连接结束后会回滚所有的数据修改，
这可以保证再次调试时初始状态不变。同步模式下，调试过程中，服务器其他连接会被阻塞，当调试结束后，所有的数据修改会被保存。

* `YES`. 打开非阻塞异步调试模式，调试Lua脚本(回退数据修改)
* `SYNC`. 打开阻塞同步调试模式，调试Lua脚本(保留数据修改稿)
* `NO`.  关闭脚本调试模式
## 返回值


[simple-string-reply](/topics/protocol.html#simple-string-reply): `OK`.

