---
layout: commands
title: script-kill 命令 -- Redis中文资料站
permalink: commands/script-kill.html
disqusIdentifier: command_script-kill
disqusUrl: http://redis.cn/commands/script-kill.html
commandsType: scripting
---

杀死当前正在运行的 Lua 脚本，当且仅当这个脚本没有执行过任何写操作时，这个命令才生效。

这个命令主要用于终止运行时间过长的脚本，比如一个因为 BUG 而发生无限 loop 的脚本，诸如此类。

`SCRIPT KILL` 执行之后，当前正在运行的脚本会被杀死，执行这个脚本的客户端会从 [EVAL](/commands/eval.html) 命令的阻塞当中退出，并收到一个错误作为返回值。

另一方面，假如当前正在运行的脚本已经执行过写操作，那么即使执行 `SCRIPT KILL` ，也无法将它杀死，因为这是违反 Lua 脚本的原子性执行原则的。在这种情况下，唯一可行的办法是使用 `SHUTDOWN NOSAVE` 命令，通过停止整个 Redis 进程来停止脚本的运行，并防止不完整(half-written)的信息被写入数据库中。

关于使用 Redis 对 Lua 脚本进行求值的更多信息，请参见 [EVAL](/commands/eval.html) 命令。

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply)
