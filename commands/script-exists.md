---
layout: commands
title: script-exists 命令 -- Redis中文资料站
permalink: commands/script-exists.html
disqusIdentifier: command_script-exists
disqusUrl: http://redis.cn/commands/script-exists.html
commandsType: scripting
---

检查脚本是否存在脚本缓存里面。

这个命令可以接受一个或者多个脚本SHA1信息，返回一个1或者0的列表，如果脚本存在或不存在。

还可以使用管道技术（pipelining operation）确保脚本加载（也可以使用`SCRIPT LOAD`），
管道技术可以单独使用`EVALSHA`来代替`EVAL`，从而节省带宽（bandwidth）。

更多细节信息请参考[EVAL](/commands/eval.html)命令。


## 返回值

[array-reply](/topics/protocol.html#array-reply)：命令返回对应于每一个SHA1的数组，脚本存在返回1，不存在的返回0。

