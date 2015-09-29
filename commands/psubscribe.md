---
layout: commands
title: psubscribe 命令 -- Redis中文资料站
permalink: commands/psubscribe.html
disqusIdentifier: command_psubscribe
disqusUrl: http://redis.cn/commands/psubscribe.html
commandsType: pubsub
---

Subscribes the client to the given patterns.

Supported glob-style patterns:

* `h?llo` subscribes to `hello`, `hallo` and `hxllo`
* `h*llo` subscribes to `hllo` and `heeeello`
* `h[ae]llo` subscribes to `hello` and `hallo,` but not `hillo`

Use `\` to escape special characters if you want to match them verbatim.
