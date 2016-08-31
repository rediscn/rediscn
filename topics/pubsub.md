---
layout: topics
title: REDIS pubsub
permalink: topics/pubsub.html
disqusIdentifier: topics_pubsub
disqusUrl: http://redis.cn/topics/pubsub.html
discuzTid: 857
---

Pub/Sub
=======

订阅，取消订阅和发布实现了发布/订阅消息范式(引自wikipedia)，发送者（发布者）不是计划发送消息给特定的接收者（订阅者）。而是发布的消息分到不同的频道，不需要知道什么样的订阅者订阅。订阅者对一个或多个频道感兴趣，只需接收感兴趣的消息，不需要知道什么样的发布者发布的。这种发布者和订阅者的解耦合可以带来更大的扩展性和更加动态的网络拓扑。

为了订阅foo和bar，客户端发出一个订阅的频道名称:

	SUBSCRIBE foo bar

其他客户端发到这些频道的消息将会被推送到所有订阅的客户端。

客户端订阅到一个或多个频道不必发出命令，尽管他能订阅和取消订阅其他频道。订阅和取消订阅的响应被封装在发送的消息中，以便客户端只需要读一个连续的消息流，其中第一个元素表示消息类型。

## 推送消息的格式 ##

消息是一个有三个元素的多块响应 。

第一个元素是消息类型:

* subscribe: 表示我们成功订阅到响应的第二个元素提供的频道。第三个参数代表我们现在订阅的频道的数量。
* unsubscribe:表示我们成功取消订阅到响应的第二个元素提供的频道。第三个参数代表我们目前订阅的频道的数量。当最后一个参数是0的时候，我们不再订阅到任何频道。当我们在Pub/Sub以外状态，客户端可以发出任何redis命令。
* message: 这是另外一个客户端发出的发布命令的结果。第二个元素是来源频道的名称，第三个参数是实际消息的内容。

## 数据库与作用域

发布/订阅与key所在空间没有关系，它不会受任何级别的干扰，包括不同数据库编码。
发布在db 10,订阅可以在db 1。
如果你需要区分某些频道，可以通过在频道名称前面加上所在环境的名称（例如：测试环境，演示环境，线上环境等）。

## 协议示例

	SUBSCRIBE first second
	*3
	$9
	subscribe
	$5
	first
	:1
	*3
	$9
	subscribe
	$6
	second
	:2

此时，从另一个客户端我们发出关于频道名称为second的发布操作:

	> PUBLISH second Hello

这是第一个客户端收到的：

	*3
	$7
	message
	$6
	second
	$5
	Hello

现在客户端用没有任何参数的 [UNSUBSCRIBE](/commands/unsubscribe.html)命令取消订阅所有频道:

	UNSUBSCRIBE
	*3
	$11
	unsubscribe
	$6
	second
	:1
	*3
	$11
	unsubscribe
	$5
	first
	:0

## 模式匹配订阅 ##

Redis 的Pub/Sub实现支持模式匹配。客户端可以订阅全风格的模式以便接收所有来自能匹配到给定模式的频道的消息。

比如:

	PSUBSCRIBE news.*

将接收所有发到news.art.figurative, news.music.jazz等等的消息，所有模式都是有效的，所以支持多通配符。

	PUNSUBSCRIBE news.*

将取消订阅匹配该模式的客户端，这个调用不影响其他订阅。

当作模式匹配结果的消息会以不同的格式发送:

* 消息类型是pmessage:这是另一客户端发出的PUBLISH命令的结果,匹配一个模式匹配订阅。第一个元素是原匹配的模式，第三个元素是原频道名称，最后一个元素是实际消息内容。

同样的，系统默认 SUBSCRIBE 和 UNSUBSCRIBE, PSUBSCRIBE 和 PUNSUBSCRIBE 命令在发送 psubscribe 和punsubscribe类型的消息时使用像subscribe 和 unsubscribe一样的消息格式。

## 同时匹配模式和频道订阅的消息 ##

客户端可能多次接收一个消息，如果它订阅的多个模式匹配了同一个发布的消息，或者它订阅的模式和频道同时匹配到一个消息。就像下面的例子：

	SUBSCRIBE foo
	PSUBSCRIBE f*

上面的例子中，如果一个消息被发送到foo,客户端会接收到两条消息：一条message类型，一条pmessage类型。

## 模式匹配统计的意义 ##

在 subscribe, unsubscribe, psubscribe 和 punsubscribe 消息类型中，最后一个参数是依然活跃的订阅数。 这个数字是客户端依然订阅的频道和模式的总数。只有当退订频道和模式的数量下降到0时客户端才会退出Pub/Sub状态。

## 程序示例： ##

Peter Noordhuis 提供了一个使用EventMachine 和Redis创建多用户高性能网路聊天的很棒的例子。

## 客户端库实现提示 ##

因为所有接收到的消息包含原订阅导致消息传递（message类型时是频道，pmessage类型时是原模式）客户端库可能绑定原订阅到回调方法（可能是匿名函数，块，函数指针），使用hash table。当消息被接收的时候可以做到时间复杂度为O(1)的查找以便传递消息到已注册的回调。
