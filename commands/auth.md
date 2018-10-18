---
layout: commands
title: auth 命令
permalink: commands/auth.html
disqusIdentifier: command_auth
disqusUrl: http://redis.cn/commands/auth.html
commandsType: connection
discuzTid: 903
---

为redis服务请求设置一个密码。redis可以设置在客户端执行commands请求前需要通过密码验证。通过修改配置文件的requirepass就可以设置密码。 如果密码与配置文件里面设置的密码一致，服务端就会发会一个OK的状态码，接受客户端发送其他的请求命令，否则服务端会返回一个错误码，客户端需要尝试使用新的密码来进行连接。

**注意:** 因为redis的高性能能在短时间接受非常多的尝试性密码，所以请务必设置一个足够复杂的密码以防止可能的攻击。

## 返回值

[simple-string-reply](/topics/protocol.html#simple-string-reply)
