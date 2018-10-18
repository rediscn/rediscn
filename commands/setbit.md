---
layout: commands
title: setbit 命令
permalink: commands/setbit.html
disqusIdentifier: command_setbit
disqusUrl: http://redis.cn/commands/setbit.html
commandsType: strings
discuzTid: 1048
---

设置或者清空key的value(字符串)在offset处的bit值。

那个位置的bit要么被设置，要么被清空，这个由value（只能是0或者1）来决定。当key不存在的时候，就创建一个新的字符串value。要确保这个字符串大到在offset处有bit值。参数offset需要大于等于0，并且小于232(限制bitmap大小为512)。当key对应的字符串增大的时候，新增的部分bit值都是设置为0。

警告：当set最后一个bit(offset等于2<sup>32</sup>-1)并且key还没有一个字符串value或者其value是个比较小的字符串时，Redis需要立即分配所有内存，这有可能会导致服务阻塞一会。在一台2010MacBook Pro上，offset为2<sup>32</sup>-1（分配512MB）需要～300ms，offset为2<sup>30</sup>-1(分配128MB)需要～80ms，offset为2<sup>28</sup>-1（分配32MB）需要～30ms，offset为2<sup>26</sup>-1（分配8MB）需要8ms。注意，一旦第一次内存分配完，后面对同一个key调用[SETBIT](/commands/setbit.html)就不会预先得到内存分配。

## 返回值

[integer-reply](/topics/protocol.html#integer-reply)：在offset处原来的bit值

## 例子

	redis> SETBIT mykey 7 1
	(integer) 0
	redis> SETBIT mykey 7 0
	(integer) 1
	redis> GET mykey
	"\x00"
	redis> 