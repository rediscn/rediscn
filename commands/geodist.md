---
layout: commands
title: geodist 命令 -- Redis中文资料站
permalink: commands/geodist.html
disqusIdentifier: command_geodist
disqusUrl: http://redis.cn/commands/geodist.html
commandsType: geo
---

返回两个给定位置之间的距离。

如果两个位置之间的其中一个不存在， 那么命令返回空值。

指定单位的参数 unit 必须是以下单位的其中一个：

* **m** 表示单位为米。
* **km** 表示单位为千米。
* **mi** 表示单位为英里。
* **ft** 表示单位为英尺。

如果用户没有显式地指定单位参数， 那么 `GEODIST` 默认使用米作为单位。

`GEODIST` 命令在计算距离时会假设地球为完美的球形， 在极限情况下， 这一假设最大会造成 0.5% 的误差。

## 返回值 ##

[bulk-string-reply](/topics/protocol.html#bulk-string-reply), 具体的:

计算出的距离会以双精度浮点数的形式被返回。 如果给定的位置元素不存在， 那么命令返回空值。

## 例子

	redis> GEOADD Sicily 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"
	(integer) 2
	redis> GEODIST Sicily Palermo Catania
	"166274.15156960039"
	redis> GEODIST Sicily Palermo Catania km
	"166.27415156960038"
	redis> GEODIST Sicily Palermo Catania mi
	"103.31822459492736"
	redis> GEODIST Sicily Foo Bar
	(nil)
	redis> 