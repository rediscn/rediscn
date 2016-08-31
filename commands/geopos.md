---
layout: commands
title: geopos 命令
permalink: commands/geopos.html
disqusIdentifier: command_geopos
disqusUrl: http://redis.cn/commands/geopos.html
commandsType: geo
discuzTid: 965
---

从`key`里返回所有给定位置元素的位置（经度和纬度）。

给定一个sorted set表示的空间索引，密集使用 [geoadd](/commands/geoadd.html) 命令，它以获得指定成员的坐标往往是有益的。当空间索引填充通过 [geoadd](/commands/geoadd.html) 的坐标转换成一个52位Geohash，所以返回的坐标可能不完全以添加元素的，但小的错误可能会出台。

因为 `GEOPOS` 命令接受可变数量的位置元素作为输入， 所以即使用户只给定了一个位置元素， 命令也会返回数组回复。

## 返回值 ##

[array-reply](/topics/protocol.html#array-reply), 具体的:

GEOPOS 命令返回一个数组， 数组中的每个项都由两个元素组成： 第一个元素为给定位置元素的经度， 而第二个元素则为给定位置元素的纬度。

当给定的位置元素不存在时， 对应的数组项为空值。

## 例子

	redis> GEOADD Sicily 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"
	(integer) 2
	redis> GEOPOS Sicily Palermo Catania NonExisting
	1) 1) "13.361389338970184"
	   2) "38.115556395496299"
	2) 1) "15.087267458438873"
	   2) "37.50266842333162"
	3) (nil)
	redis> 
