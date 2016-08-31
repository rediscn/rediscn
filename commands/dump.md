---
layout: commands
title: dump 命令
permalink: commands/dump.html
disqusIdentifier: command_dump
disqusUrl: http://redis.cn/commands/dump.html
commandsType: keys
discuzTid: 950
---

序列化给定 key ，并返回被序列化的值，使用 [RESTORE](/commands/restore) 命令可以将这个值反序列化为 Redis 键。

序列化生成的值有以下几个特点：

- 它带有 64 位的校验和，用于检测错误，[RESTORE](/commands/restore) 在进行反序列化之前会先检查校验和。
- 值的编码格式和 RDB 文件保持一致。
- RDB 版本会被编码在序列化值当中，如果因为 Redis 的版本不同造成 RDB 格式不兼容，那么 Redis 会拒绝对这个值进行反序列化操作。

序列化的值不包括任何生存时间信息。

## 返回值

如果 key 不存在，那么返回 nil。</br>
否则，返回序列化之后的值。

## 例子

	redis> SET mykey 10
	OK
	redis> DUMP mykey
	"\u0000\xC0\n\u0006\u0000\xF8r?\xC5\xFB\xFB_("
	redis> 