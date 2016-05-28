---
layout: commands
title: keys 命令
permalink: commands/keys.html
disqusIdentifier: command_keys
disqusUrl: http://redis.cn/commands/keys.html
commandsType: keys
---

查找所有符合给定模式pattern（正则表达式）的 key 。

时间复杂度为O(N)，N为数据库里面key的数量。

例如，Redis在一个有1百万个key的数据库里面执行一次查询需要的时间是40毫秒
。

**警告**: `KEYS` 的速度非常快，但在一个大的数据库中使用它仍然可能造成性能问题，如果你需要从一个数据集中查找特定的 `KEYS`， 你最好还是用 Redis 的集合结构 [SETS](/commands/sets.html) 来代替。


支持的正则表达模式：

* `h?llo` 匹配 `hello`, `hallo` 和 `hxllo`
* `h*llo` 匹配 `hllo` 和 `heeeello`
* `h[ae]llo` 匹配 `hello` 和 `hallo,` 但是不匹配 `hillo`
* `h[^e]llo` 匹配 `hallo`, `hbllo`, ... 但是不匹配 `hello`
* `h[a-b]llo` 匹配 `hallo` 和 `hbllo`

如果你想取消字符的特殊匹配（正则表达式，可以在它的前面加`\`。

## 返回值

[array-reply](/topics/protocol#array-reply): 所有符合条件的key

## 例子

	redis> MSET one 1 two 2 three 3 four 4
	OK
	redis> KEYS *o*
	1) "four"
	2) "one"
	3) "two"
	redis> KEYS t??
	1) "two"
	redis> KEYS *
	1) "four"
	2) "three"
	3) "one"
	4) "two"
	redis>
