---
layout: commands
title: script-load 命令
permalink: commands/script-load.html
disqusIdentifier: command_script-load
disqusUrl: http://redis.cn/commands/script-load.html
commandsType: scripting
discuzTid: 1043
---

Load a script into the scripts cache, without executing it.
After the specified command is loaded into the script cache it will be callable
using `EVALSHA` with the correct SHA1 digest of the script, exactly like after
the first successful invocation of `EVAL`.
将脚本 script 添加到脚本缓存中，但并不立即执行该脚本。在脚本被加入到缓存之后，通过 EVALSHA 命令，可以使用脚本的 SHA1 校验和来调用这个脚本。
EVAL 命令也会将脚本添加到脚本缓存中，但是它会立即对输入的脚本进行求值。

The script is guaranteed to stay in the script cache forever (unless `SCRIPT
FLUSH` is called).
脚本可以在缓存中保留无限长的时间(直到执行 SCRIPT FLUSH 为止)
The command works in the same way even if the script was already present in the
script cache.
如果给定的脚本已经在缓存里面了，那么不做动作。
Please refer to the `EVAL` documentation for detailed information about Redis
Lua scripting.

关于使用 Redis 对 Lua 脚本进行求值的更多信息，请参见 EVAL 命令
@return

@bulk-string-reply This command returns the SHA1 digest of the script added into the
script cache.
@bulk-string-reply 该命令返回给定 script 的 SHA1 校验和
