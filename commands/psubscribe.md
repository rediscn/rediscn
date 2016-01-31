---
layout: commands
title: psubscribe 命令 -- Redis中文资料站
permalink: commands/psubscribe.html
disqusIdentifier: command_psubscribe
disqusUrl: http://redis.cn/commands/psubscribe.html
commandsType: pubsub
---

订阅给定的模式(patterns)。

支持的模式(patterns)有:

* `h?llo` subscribes to `hello`, `hallo` and `hxllo`
* `h*llo` subscribes to `hllo` and `heeeello`
* `h[ae]llo` subscribes to `hello` and `hallo,` but not `hillo`

如果想输入普通的字符，可以在前面添加`\`

