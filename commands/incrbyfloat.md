---
layout: commands
title: incrbyfloat 命令
permalink: commands/incrbyfloat.html
disqusIdentifier: command_incrbyfloat
disqusUrl: http://redis.cn/commands/incrbyfloat.html
commandsType: strings
discuzTid: 989
---


通过指定浮点数`key`来增长浮点数(存放于string中)的值.
当键不存在时,先将其值设为0再操作.下面任一情况都会返回错误:

* key 包含非法值(不是一个string).
* 当前的key或者相加后的值不能解析为一个双精度的浮点值.(超出精度范围了)

如果操作命令成功, 相加后的值将替换原值存储在对应的键值上, 并以string的类型返回.
string中已存的值或者相加参数可以任意选用指数符号,但相加计算的结果会以科学计数法的格式存储.
无论各计算的内部精度如何, 输出精度都固定为小数点后17位.

## 返回值

[Bulk-string-reply](/topics/protocol.html#bulk-string-reply): 当前`key`增加increment后的值。

## 例子

	redis> SET mykey 10.50
	OK
	redis> INCRBYFLOAT mykey 0.1
	"10.6"
	redis> SET mykey 5.0e3
	OK
	redis> INCRBYFLOAT mykey 2.0e2
	"5200"
	redis> 

## 执行细节
该命令总是衍生为一个链接复制以及追加文件的set操作 , 所以底层浮点数的实现的差异并不是造成不一致的源头???
