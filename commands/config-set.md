---
layout: commands
title: config-set 命令
permalink: commands/config-set.html
disqusIdentifier: command_config-set
disqusUrl: http://redis.cn/commands/config-set.html
commandsType: server
discuzTid: 942
tranAuthor: wangqiang
---

`CONFIG SET`命令用于在服务器运行期间重写某些配置，而不用重启Redis。你可以使用此命令更改不重要的参数或从一个参数切换到另一个持久性选项。

可以通过`CONFIG GET *`获得`CONFIG SET`命令支持的配置参数列表，该命令是用于获取有关正在运行的Redis实例的配置信息的对称命令。

所有使用`CONFIG SET`设置的配置参数将会立即被Redis加载，并从下一个执行的命令开始生效。

所有支持的参数与[redis.conf][hgcarr22rc]文件中使用的等效配置参数具有相同含义，但有以下重要区别：

[hgcarr22rc]: http://github.com/antirez/redis/raw/2.8/redis.conf

* 在指定字节或其他数量的选项中，不能使用在`redis.conf`中使用的简写形式（如`10k`，`2gb`等），所有内容都应该指定为格式良好的64位整数，以配置指令的基本单位表示。但从Redis3.0以及更高版本开始，可以将`CONFIG SET`与内存单元一起用于`maxmemory`、客户端输出缓冲以及复制积压大小（repl-backlog-size）指定内存单位。
* save参数是一个以空格分隔的整数字符串。每对整数代表一个秒/修改阈值。

例如在`redis.conf`中看起来像这样：

```
save 900 1
save 300 10
```

这意味着，如果数据集有1个以上变更，则在900秒后保存；如果有10个以上变更，则在300秒后就保存，应使用`CONFIG SET SAVE "900 1 300 10"来设置。

可以使用`CONFIG SET`命令将持久化从RDB快照切换到AOF文件（或其他相似的方式）。
有关如何执行此操作的详细信息，请查看[persistencepage][tp]。

[tp]: /topics/persistence

一般来说，你应该知道将`appendonly`参数设置为`yes`将启动后台进程以保存初始AOF文件（从内存数据集中获取），并将所有后续命令追加到AOF文件，从而达到了与一个Redis服务器从一开始就开启了AOF选项相同的效果。

如果你愿意，可以同时开启AOF和RDB快照，这两个选项不是互斥的。

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply)：当配置被正确设置时返回`OK`，否则将返回错误。
