---
layout: commands
title: migrate 命令
permalink: commands/migrate.html
disqusIdentifier: command_migrate
disqusUrl: http://redis.cn/commands/migrate.html
commandsType: keys
discuzTid: 1004
---

将 key 原子性地从当前实例传送到目标实例的指定数据库上，一旦传送成功， key 保证会出现在目标实例上，而当前实例上的 key 会被删除。

这个命令是一个原子操作，它在执行的时候会阻塞进行迁移的两个实例，直到以下任意结果发生：迁移成功，迁移失败，等到超时。

命令的内部实现是这样的：它在当前实例对给定 key 执行 [DUMP](/commands/dump.html) 命令 ，将它序列化，然后传送到目标实例，目标实例再使用 [RESTORE](/commands/restore.html) 对数据进行反序列化，并将反序列化所得的数据添加到数据库中；当前实例就像目标实例的客户端那样，只要看到 [RESTORE](/commands/restore.html) 命令返回 OK ，它就会调用 [DEL](/commands/del.html) 删除自己数据库上的 `key` 。

timeout 参数以毫秒为格式，指定当前实例和目标实例进行沟通的最大间隔时间。这说明操作并不一定要在 timeout 毫秒内完成，只是说数据传送的时间不能超过这个 timeout 数。

[MIGRATE](/commands/migrate.html) 命令需要在给定的时间规定内完成 IO 操作。如果在传送数据时发生 IO 错误，或者达到了超时时间，那么命令会停止执行，并返回一个特殊的错误： `IOERR` 。

当 `IOERR` 出现时，有以下两种可能：

- `key` 可能存在于两个实例。
- `key` 可能只存在于当前实例。

唯一不可能发生的情况就是丢失 `key` ，因此，如果一个客户端执行 [MIGRATE](/commands/migrate.html), 命令，并且不幸遇上 `IOERR` 错误，那么这个客户端唯一要做的就是检查自己数据库上的 key 是否已经被正确地删除。

如果有其他错误发生，那么 [MIGRATE](/commands/migrate.html) 保证 `key` 只会出现在当前实例中。（当然，目标实例的给定数据库上可能有和 `key` 同名的键，不过这和 [MIGRATE](/commands/migrate.html) 命令没有关系）。

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply): 迁移成功时返回 OK ，否则返回相应的错误。

