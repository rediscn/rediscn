---
layout: commands
title: getrange 命令
permalink: commands/getrange.html
disqusIdentifier: command_getrange
disqusUrl: http://redis.cn/commands/getrange.html
commandsType: strings
---

**警告**：这个命令是被改成GETRANGE的，在小于2.0的Redis版本中叫SUBSTR。 返回key对应的字符串value的子串，这个子串是由start和end位移决定的（两者都在string内）。可以用负的位移来表示从string尾部开始数的下标。所以-1就是最后一个字符，-2就是倒数第二个，以此类推。

这个函数处理超出范围的请求时，都把结果限制在string内。

**返回值**

[bulk-reply](/topics/protocol.html#bulk-reply)

**例子**

	redis> SET mykey "This is a string"
	OK
	redis> GETRANGE mykey 0 3
	"This"
	redis> GETRANGE mykey -3 -1
	"ing"
	redis> GETRANGE mykey 0 -1
	"This is a string"
	redis> GETRANGE mykey 10 100
	"string"
	redis> 