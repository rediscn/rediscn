---
layout: commands
title: zrangebylex 命令
permalink: commands/zrangebylex.html
disqusIdentifier: command_zrangebylex
disqusUrl: http://redis.cn/commands/zrangebylex.html
commandsType: sortedsets
discuzTid: 1084
---

## __1 简介__

ZRANGEBYLEX 返回指定成员区间内的成员，按成员字典正序排序, 分数必须相同。
在某些业务场景中,需要对一个字符串数组按名称的字典顺序进行排序时,可以使用Redis中SortSet这种数据结构来处理。

## __2 语法__

### __2.1 完整示例__

    ZRANGEBYLEX key min max [LIMIT offset count]

### __2.2 说明__

<table>
    <tr>
        <td>指令</td>
        <td>是否必须</td>
        <td>说明</td>
    </tr>
    <tr>
        <td>ZRANGEBYLEX</td>
        <td>是</td>
        <td>指令</td>
    </tr>
    <tr>
        <td>key</td>
        <td>是</td>
        <td>有序集合键名称</td>
    </tr>
    <tr>
        <td>min</td>
        <td>是</td>
        <td>字典中排序位置较小的成员,必须以"["开头,或者以"("开头,可使用"-"代替</td>
    </tr>
    <tr>
        <td>max</td>
        <td>是</td>
        <td>字典中排序位置较大的成员,必须以"["开头,或者以"("开头,可使用"+"代替</td>
    </tr>
    <tr>
        <td>LIMIT</td>
        <td>否</td>
        <td>返回结果是否分页,指令中包含LIMIT后offset、count必须输入</td>
    </tr>
    <tr>
        <td>offset</td>
        <td>否</td>
        <td>返回结果起始位置</td>
    </tr>
    <tr>
        <td>count</td>
        <td>否</td>
        <td>返回结果数量</td>
    </tr>
</table>

__提示:__

*     分数必须相同! 如果有序集合中的成员分数有不一致的,返回的结果就不准。
*     成员字符串作为二进制数组的字节数进行比较。
*     默认是以ASCII字符集的顺序进行排列。如果成员字符串包含utf-8这类字符集的内容,就会影响返回结果,所以建议不要使用。
*     默认情况下, "max" 和 "min" 参数前必须加 "[" 符号作为开头。"[" 符号与成员之间不能有空格, 返回成员结果集会包含参数 "min" 和 "max" 。
*     "max" 和 "min" 参数前可以加 "(" 符号作为开头表示小于, "(" 符号与成员之间不能有空格。返回成员结果集不会包含 "max" 和 "min" 成员。
*     可以使用 "-" 和 "+" 表示得分最小值和最大值
*     "min" 和 "max"  不能反,  "max"  放前面 "min"放后面会导致返回结果为空
*     与ZRANGEBYLEX获取顺序相反的指令是[ZREVRANGEBYLEX](/commands/zrevrangebylex.html)。
*     源码中采用C语言中` memcmp() ` 函数, 从字符的第0位到最后一位进行排序,如果前面部分相同,那么较长的字符串比较短的字符串排序靠后。

## __3 返回值__

指定成员范围的元素列表。

## __4 示例__  

不要在分数不一致的SortSet集合中去使用 ZRANGEBYLEX 指令,因为获取的结果并不准确。

### __4.1 获取所有值__

可以使用 "-" 和 "+" 表示得分最小值和最大值

    redis> zadd zset 0 a 0 aa 0 abc 0 apple 0 b 0 c 0 d 0 d1 0 dd 0 dobble 0 z 0 z1
    (integer) 12
    redis> ZRANGEBYLEX zset - +
     1) "a"
     2) "aa"
     3) "abc"
     4) "apple"
     5) "b"
     6) "c"
     7) "d"
     8) "d1"
     9) "dd"
    10) "dobble"
    11) "z"
    12) "z1"

### __4.2 获取分页数据__

    redis> ZRANGEBYLEX zset - + LIMIT 0 3
    1) "a"
    2) "aa"
    3) "abc"
    redis> ZRANGEBYLEX zset - + LIMIT 3 3
    1) "apple"
    2) "b"
    3) "c"

### __4.3 获取成员之间的元素__

默认情况下, "max" 和 "min" 参数前必须加 "[" 符号作为开头。  
"[" 符号与成员之间不能有空格, 返回成员结果集会包含参数 "min" 和 "max" 。

    redis> ZRANGEBYLEX zset [aa [c
    1) "aa"
    2) "abc"
    3) "apple"
    4) "b"
    5) "c"

"min" 和 "max"  不能反,  "max"  放前面 "min"放后面会导致返回结果为空

    redis> ZRANGEBYLEX zset [c [aa
    (empty list or set)

### __4.4 使用 "(" 小于号获取成员之间的元素__

"max" 和 "min" 参数前可以加 "(" 符号作为开头表示小于, "(" 符号与成员之间不能有空格。  
返回成员结果集不会包含 "max" 和 "min" 成员。
     
    redis> ZRANGEBYLEX zset [aa (c
    1) "aa"
    2) "abc"
    3) "apple"
    4) "b"

### __4.5 ASCII码的影响__

成员字符串作为二进制数组的字节数进行比较。  
默认是以ASCII字符集的顺序进行排列。  
如果成员字符串包含utf-8这类字符集的内容,就会影响返回结果,所以建议不要使用。

    redis> zadd zset 0 aBc
    (integer) 1
    redis> ZRANGEBYLEX zset - +
     1) "a"
     2) "aBc"
     3) "aa"
     4) "abc"
     5) "apple"
     6) "b"
     7) "c"
     8) "d"
     9) "d1"
    10) "dd"
    11) "dobble"
    12) "z"
    13) "z1"
    redis> ZRANGEBYLEX zset - + LIMIT 0 3
    1) "a"
    2) "aBc"
    3) "aa"


## 5 使用场景示例

### __5.1 电话号码排序__

我们可以将电话号码存储到SortSet中,然后根据需要来获取号段:

    redis> zadd phone 0 13100111100 0 13110114300 0 13132110901 
    (integer) 3
    redis> zadd phone 0 13200111100 0 13210414300 0 13252110901 
    (integer) 3
    redis> zadd phone 0 13300111100 0 13310414300 0 13352110901 
    (integer) 3

获取所有号码:

    redis> ZRANGEBYLEX phone - +
    1) "13100111100"
    2) "13110114300"
    3) "13132110901"
    4) "13200111100"
    5) "13210414300"
    6) "13252110901"
    7) "13300111100"
    8) "13310414300"
    9) "13352110901"
    
获取132号段:
    
    redis> ZRANGEBYLEX phone [132 (133
    1) "13200111100"
    2) "13210414300"
    3) "13252110901"

获取132、133号段:

    redis> ZRANGEBYLEX phone [132 (134
    1) "13200111100"
    2) "13210414300"
    3) "13252110901"
    4) "13300111100"
    5) "13310414300"
    6) "13352110901"

### __5.2 姓名排序__

将名称存储到SortSet中:

    redis> zadd names 0 Toumas 0 Jake 0 Bluetuo 0 Gaodeng 0 Aimini 0 Aidehua 
    (integer) 6

获取所有人的名字:

    redis> ZRANGEBYLEX names - +
    1) "Aidehua"
    2) "Aimini"
    3) "Bluetuo"
    4) "Gaodeng"
    5) "Jake"
    6) "Toumas"

获取名字中大写字母A开头的所有人:

    redis> ZRANGEBYLEX names [A (B
    1) "Aidehua"
    2) "Aimini"

获取名字中大写字母C到Z的所有人:

    redis> ZRANGEBYLEX names [C [Z
    1) "Gaodeng"
    2) "Jake"
    3) "Toumas"



