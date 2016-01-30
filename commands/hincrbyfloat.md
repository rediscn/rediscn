---
layout: commands
title: hincrbyfloat 命令 -- Redis中文资料站
permalink: commands/hincrbyfloat.html
disqusIdentifier: command_hincrbyfloat
disqusUrl: http://redis.cn/commands/hincrbyfloat.html
commandsType: hashes
---

Increment the specified `field` of an hash stored at `key`, and representing a
floating point number, by the specified `increment`.
If the field does not exist, it is set to `0` before performing the operation.
An error is returned if one of the following conditions occur:

* The field contains a value of the wrong type (not a string).
* The current field content or the specified increment are not parsable as a
  double precision floating point number.

The exact behavior of this command is identical to the one of the `INCRBYFLOAT`
command, please refer to the documentation of `INCRBYFLOAT` for further
information.

## 返回值

[bulk-string-reply](/topics/protocol.html#bulk-string-reply)：
the value of `field` after the increment.

## 例子

	redis> HSET mykey field 10.50
	(integer) 1
	redis> HINCRBYFLOAT mykey field 0.1
	"10.6"
	redis> HSET mykey field 5.0e3
	(integer) 0
	redis> HINCRBYFLOAT mykey field 2.0e2
	"5200"
	redis> 

## Implementation details

The command is always propagated in the replication link and the Append Only
File as a `HSET` operation, so that differences in the underlying floating point
math implementation will not be sources of inconsistency.
