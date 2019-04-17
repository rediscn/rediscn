---
layout: commands
title: script-load 命令
permalink: commands/script-load.html
disqusIdentifier: command_script-load
disqusUrl: http://redis.cn/commands/script-load.html
commandsType: scripting
discuzTid: 1043
---

将脚本 script 添加到脚本缓存中，但并不立即执行该脚本。在脚本被加入到缓存之后，通过 EVALSHA 命令，可以使用脚本的 SHA1 校验和来调用这个脚本。
EVAL 命令也会将脚本添加到脚本缓存中，但是它会立即对输入的脚本进行求值。

脚本可以在缓存中保留无限长的时间(直到执行 SCRIPT FLUSH 为止)
如果给定的脚本已经在缓存里面了，那么不做动作。

关于使用 Redis 对 Lua 脚本进行求值的更多信息，请参见 EVAL 命令

## 返回值


[bulk-string-reply](/topics/protocol.html#bulk-string-reply) 该命令返回给定 script 的 SHA1 校验和
