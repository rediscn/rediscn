---
layout: commands
title: save 命令
permalink: commands/save.html
disqusIdentifier: command_save
disqusUrl: http://redis.cn/commands/save.html
commandsType: server
discuzTid: 1037
---

SAVE 命令执行一个同步操作，以RDB文件的方式保存所有数据的快照
很少在生产环境直接使用SAVE 命令，因为它会阻塞所有的客户端的请求，可以使用[BGSAVE](/commands/bgsave.html) 命令代替. 如果在[BGSAVE](/commands/bgsave.html)命令的保存数据的子进程发生错误的时,用 SAVE命令保存最新的数据是最后的手段,详细的说明请参考持久化文档

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply): 命令成功返回OK.
