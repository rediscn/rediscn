---
layout: commands
title: geohash 命令
permalink: commands/geohash.html
disqusIdentifier: command_geohash
disqusUrl: http://redis.cn/commands/geohash.html
commandsType: geo
---

返回一个或多个位置元素的 [Geohash](https://en.wikipedia.org/wiki/Geohash) 表示。

通常使用表示位置的元素使用不同的技术，使用Geohash位置52点整数编码。由于编码和解码过程中所使用的初始最小和最大坐标不同，编码的编码也不同于标准。此命令返回一个**标准的Geohash**，在[维基百科](https://en.wikipedia.org/wiki/Geohash)和[geohash.org](http://geohash.org)网站都有相关描述


Geohash字符串属性
---

该命令将返回11个字符的Geohash字符串，所以没有精度Geohash，损失相比，使用内部52位表示。返回的geohashes具有以下特性：

1. 他们可以缩短从右边的字符。它将失去精度，但仍将指向同一地区。
2. 它可以在 `geohash.org` 网站使用，网址 `http://geohash.org/<geohash-string>`。查询例子：[http://geohash.org/sqdtr74hyu0](http://geohash.org/sqdtr74hyu0).
3. 与类似的前缀字符串是附近，但相反的是不正确的，这是可能的，用不同的前缀字符串附近。

## 返回值 ##

[integer-reply](/topics/protocol.html#integer-reply), 具体的:

一个数组， 数组的每个项都是一个 geohash 。 命令返回的 geohash 的位置与用户给定的位置元素的位置一一对应。

## 例子

	redis> GEOADD Sicily 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"
	(integer) 2
	redis> GEOHASH Sicily Palermo Catania
	1) "sqc8b49rny0"
	2) "sqdtr74hyu0"
	redis> 
