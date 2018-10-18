---
layout: commands
title: restore 命令
permalink: commands/restore.html
disqusIdentifier: command_restore
disqusUrl: http://redis.cn/commands/restore.html
commandsType: keys
discuzTid: 1030
---

反序列化给定的序列化值，并将它和给定的 key 关联。

参数 ttl 以毫秒为单位为 key 设置生存时间；如果 ttl 为 0 ，那么不设置生存时间。

`RESTORE` 在执行反序列化之前会先对序列化值的 RDB 版本和数据校验和进行检查，如果 RDB 版本不相同或者数据不完整的话，那么 RESTORE 会拒绝进行反序列化，并返回一个错误。

## 返回值

如果反序列化成功那么返回 OK ，否则返回一个错误。

## 例子

	redis> DEL mykey
	0
	redis> RESTORE mykey 0 "\n\x17\x17\x00\x00\x00\x12\x00\x00\x00\x03\x00\
	                        x00\xc0\x01\x00\x04\xc0\x02\x00\x04\xc0\x03\x00\
	                        xff\x04\x00u#<\xc0;.\xe9\xdd"
	OK
	redis> TYPE mykey
	list
	redis> LRANGE mykey 0 -1
	1) "1"
	2) "2"
	3) "3"