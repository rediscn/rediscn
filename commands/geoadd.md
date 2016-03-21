---
layout: commands
title: geoadd 命令 -- Redis中文资料站
permalink: commands/geoadd.html
disqusIdentifier: command_geoadd
disqusUrl: http://redis.cn/commands/geoadd.html
commandsType: geo
---

将指定的地理空间位置（纬度、经度、名称）添加到指定的`key`中。这些数据将会存储到`sorted set`这样的目的是为了方便使用[GEORADIUS](/commands/georadius.html)或者[GEORADIUSBYMEMBER](/commands/georadiusbymember.html)命令对数据进行半径查询等操作。

该命令以采用标准格式的参数x,y,所以经度必须在纬度之前。这些坐标的限制是可以被编入索引的，区域面积可以很接近极点但是不能索引。具体的限制，由EPSG:900913 / EPSG:3785 / OSGEO:41001 规定如下：

* 有效的经度从-180度到180度。
* 有效的纬度从-85.05112878度到85.05112878度。

当坐标位置超出上述指定范围时，该命令将会返回一个错误。

它是如何工作的？
---

sorted set使用一种称为[Geohash](https://en.wikipedia.org/wiki/Geohash)的技术进行填充。经度和纬度的位是交错的，以形成一个独特的52位整数. 我们知道，一个sorted set 的double score可以代表一个52位的整数，而不会失去精度。

这种格式允许半径查询检查的1 + 8个领域需要覆盖整个半径，并丢弃元素以外的半径。通过计算该区域的范围，通过计算所涵盖的范围，从不太重要的部分的排序集的得分，并计算得分范围为每个区域的sorted set中的查询。

使用什么样的地球模型（Earth model）？
---

这只是假设地球是一个球体，因为使用的距离公式是Haversine公式。这个公式仅适用于地球，而不是一个完美的球体。当在社交网站和其他大多数需要查询半径的应用中使用时，这些偏差都不算问题。但是，在最坏的情况下的偏差可能是0.5%，所以一些地理位置很关键的应用还是需要谨慎考虑。

## 返回值 ##

[integer-reply](/topics/protocol.html#integer-reply), 具体的:

* 添加到sorted set元素的数目，但不包括已更新score的元素。

## 例子


	redis> GEOADD Sicily 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"
	(integer) 2
	redis> GEODIST Sicily Palermo Catania
	"166274.15156960039"
	redis> GEORADIUS Sicily 15 37 100 km
	1) "Catania"
	redis> GEORADIUS Sicily 15 37 200 km
	1) "Palermo"
	2) "Catania"
	redis> 
