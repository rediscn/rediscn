---
layout: commands
title: zlexcount 命令
permalink: commands/zlexcount.html
disqusIdentifier: command_zlexcount
disqusUrl: http://redis.cn/commands/zlexcount.html
commandsType: sortedsets
discuzTid: 1082
---

## 简介
```ZLEXCOUNT``` 命令用于计算有序集合中指定成员之间的成员数量。  

## 起始版本
>2.8.9

## 语法

### 完整示例
```
zlexcount zset [member1 [member5
```
### 说明 
| 指令       | 是否必须 |说明            |
|:--------- |:-------:|:----------------------------------- |
| zlexcount |   是    | 指令                                 |
| key       |   是    | 有序集合键名称                         |
| min       |   是    | 在有序集合中分数排名较小的成员            |
| max       |   是    | 在有序集合中分数排名较大的成员            |

> ####提示:
> 1. 成员名称前需要加 ```[``` 符号作为开头, ```[``` 符号与成员之间不能有空格
> 2. 可以使用 ```-``` 和 ```+``` 表示得分最小值和最大值
> 3. ```min``` 和 ```max``` 参数的含义与 ```zrangebylex``` 命令中所描述的相同
> 4. ```min``` 和 ```max``` 不能反,  ```max```  放前面 ```min```放后面会导致返回结果为0
> 5. 计算成员之间的成员数量时,参数 ```min``` 和 ```max``` 的位置也计算在内。

## 返回值
有序集合中成员名称 min 和 max 之间的成员数量。

## 示例
### 1. 计算成员之间成员数量
```
redis> ZADD myzset 0 a 0 b 0 c 0 d 0 e
(integer) 5
redis> ZADD myzset 0 f 0 g
(integer) 2
redis> ZLEXCOUNT myzset - +
(integer) 7
redis> ZLEXCOUNT myzset [b [f
(integer) 5
redis> 
```

### 2. 计算某个成员之前或者之后的成员数量
```-``` 表示得分最小值的成员  
```+``` 表示得分最大值的成员
```
redis> ZADD myzset 1 a 2 b 3 c 4 d 5 e 6 f 7 g
(integer) 7
redis> zrange myzset 0 -1
1) "a"
2) "b"
3) "c"
4) "d"
5) "e"
6) "f"
7) "g"
redis> ZLEXCOUNT myzset - +
(integer) 7
redis> ZLEXCOUNT myzset [c +
(integer) 5
redis> ZLEXCOUNT myzset - [c
(integer) 3
redis> 
```

### 3. 分数值位置的重要性
```
redis> del myzset
(integer) 1
redis> ZADD myzset 1 a 2 b 3 c 4 d 5 e 6 f 7 g
(integer) 7
redis> zrange myzset 0 -1
1) "a"
2) "b"
3) "c"
4) "d"
5) "e"
6) "f"
7) "g"
redis> ZLEXCOUNT myzset [c [f
(integer) 4
redis> ZLEXCOUNT myzset [f [c
(integer) 0
redis> 
```