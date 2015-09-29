---
layout: commands
title: get 命令 -- Redis中文资料站
permalink: commands/get.html
disqusIdentifier: command_get
disqusUrl: http://redis.cn/commands/get.html
commandsType: strings
---

Get the value of `key`.
If the key does not exist the special value `nil` is returned.
An error is returned if the value stored at `key` is not a string, because `GET`
only handles string values.

@return

@bulk-string-reply: the value of `key`, or `nil` when `key` does not exist.

@examples

```cli
GET nonexisting
SET mykey "Hello"
GET mykey
```
