---
layout: topics
title: REDIS index
permalink: topics/modules-blocking-ops.html
disqusIdentifier: topics/modules-blocking-ops
disqusUrl: http://redis.cn/topics/topics/modules-blocking-ops.html
discuzTid: 2015
---

Redis 模块中的阻塞命令
===

Redis 有很多内嵌的阻塞命令。最常被使用的是`BLPOP`(或者`BRPOP`),它能阻塞对list中元素访问。

阻塞命令比较有意思的一点是它不阻塞整个服务器，仅阻塞调用客户端。通常我们希望某些事件发生，
所以触发阻塞比如:像在`BLPOP`中，Redis 数据发生改变，线程进行了长时间计算，接收到了大量的网络数据等等。

Redis 模块也可以实现阻塞功能，本文档会介绍模块的API，并给出阻塞命令可以使用的模式。

注意: 模块API 目前还是*实验性*的，仅在宏*REDISMODULE_EXPERIMENTAL_API*被定义是使用。
模块API的一些命令还未最终上线，后续还会有改动，因此现在不是最终版本。

如果要使用模块API，请在编译时添加头文件，如下：

    #define REDISMODULE_EXPERIMENTAL_API
    #include "redismodule.h"

如何阻塞和恢复运行
---
注意：`src/modules`目录下的`helloblock.c`是阻塞的一个简单例子，可以用来了解阻塞API如何生效的。

在Redis的模块中，命令都是通过Redis核心的回调函数实现的，正常情况下，回调函数执行结束后就将结果返回给客户端，如果使用如下实现模块命令的函数，
客户端需要被置为阻塞状态

    RedisModuleBlockedClient *RedisModule_BlockClient(RedisModuleCtx *ctx, RedisModuleCmdFunc reply_callback, RedisModuleCmdFunc timeout_callback, void (*free_privdata)(void*), long long timeout_ms);

函数返回`RedisModuleBlockedClient`对象，用于解除客户端的锁定。参数的意义如下:

* `ctx` API中表示命令执行的上下文
* `reply_callback` 回调函数，同一般命令函数有相同原型，当解锁客户端时会调用该命令以便返回客户端信息
* `timeout_callback` 回调函数，同一般命令函数有相同原型，当客户端到达超时时间（ms）调用
* `free_privdata` 回调函数，用以释放私有数据。私有数据指API用来解锁客户端并传输给回调函数用以回复客户端的数据。处理机制本文后续会详细介绍。
* `ms` 超时设置的毫秒数。当超过超时时间，超时回调函数会被调用，客户端自动退出。

当客户端被阻塞时，如下API可对其进行解除阻塞：
    int RedisModule_UnblockClient(RedisModuleBlockedClient *bc, void *privdata);

该函数的参数是之前调用`RedisModule_BlockClient()`返回的阻塞客户端对象，它会解除客户端的阻塞。
当客户端被解除阻塞之前，指定的`reply_callback`函数会被调用：该函数拥有`privdata`的访问权限 

注意：上述函数都是线程安全的，可在运行线程中被调用，来实现阻塞客户端的命令

当客户端被解除阻塞时，`free_privdata`会被调用，`privdata`会被自动释放。这样操作有很大好处，当客户端超时或者断开的时候，`reply callback` 永远都不会被调用，
所以如果数据需要被释放，可以让一个外部函数负责操作。

为了更好的理解API如何工作，我们可以想象这个例子，执行一个阻塞客户端1秒的命令，然后回复“Hello！”

注意: 为了使例子简单，例子命令中没有实现参数验证和其他一些非重要的项目。

    int Example_RedisCommand(RedisModuleCtx *ctx, RedisModuleString **argv,
                             int argc)
    {
        RedisModuleBlockedClient *bc =
            RedisModule_BlockClient(ctx,reply_func,timeout_func,NULL,0);

        pthread_t tid;
        pthread_create(&tid,NULL,threadmain,bc);

        return REDISMODULE_OK;
    }

    void *threadmain(void *arg) {
        RedisModuleBlockedClient *bc = arg;

        sleep(1); /* Wait one second and unblock. */
        RedisModule_UnblockClient(bc,NULL);
    }

上述命令会马上阻塞客户端，导致一个线程被阻塞1秒然后解除客户端阻塞。我们可以检测消息回复和超时回调函数回复，因为在本例中他们仅仅回复的类型不同，因此近乎是同一函数。


    int reply_func(RedisModuleCtx *ctx, RedisModuleString **argv,
                   int argc)
    {
        return RedisModule_ReplyWithSimpleString(ctx,"Hello!");
    }

    int timeout_func(RedisModuleCtx *ctx, RedisModuleString **argv,
                   int argc)
    {
        return RedisModule_ReplyWithNull(ctx);
    }

回调函数仅回复客户端“Hello！”，比较重要的一点是回调函数在线程解锁客户端的时候被调用。

超时命令回复`NULL`，因为它经常在Redis 确实出现超时时发生

解除阻塞时传递回复数据
---

上述例子简单易懂，但缺少实际实现角度：回复函数需要知道返回什么给客户端，该信息是在客户端被解除阻塞后提供的。


对如上面例子做修改，线程在等待一秒后生成一个随机数。可认为这个是一个耗费资源的操作。随机数会传递给回复函数以便返回给命令调用者。

我们修改如下函数让上述描述能够运行

    void *threadmain(void *arg) {
        RedisModuleBlockedClient *bc = arg;

        sleep(1); /* Wait one second and unblock. */

        long *mynumber = RedisModule_Alloc(sizeof(long));
        *mynumber = rand();
        RedisModule_UnblockClient(bc,mynumber);
    }

如你所见，解除阻塞函数调用，传递了私有数据--`mynumber` 指针--给回复调用函数。回复调用函数使用如下函数获取私有数据：


    void *RedisModule_GetBlockedClientPrivateData(RedisModuleCtx *ctx);

回复函数调用修改如下：
    int reply_func(RedisModuleCtx *ctx, RedisModuleString **argv,
                   int argc)
    {
        long *mynumber = RedisModule_GetBlockedClientPrivateData(ctx);
        /* IMPORTANT: don't free mynumber here, but in the
         * free privdata callback. */
        return RedisModule_ReplyWithLongLong(ctx,mynumber);
    }

因为分配给大值的资源必须被释放，当使用`RedisModule_BlockClient()` 阻塞客户端时，我们还需要传递`free_privdata`函数。
    
	void free_privdata(void *privdata) {
        RedisModule_Free(privdata);
    }

注意：特别强调，最好在`free_privdata`回调中释放私有数据，因为回复函数有时会因为客户端断连或超时而没被调用。

另外还要注意一点：超时回调在使用`GetBlockedClientPrivateData()`API时可以访问私有数据。

从一个客户端阻塞中退出
---

还有一个问题有时会出现，为了实现非阻塞命令，需要分配资源。比如，我们阻塞客户端，然后，创建一个线程，但是线程创建失败，在这种场景下，如何恢复？
我们既不想让客户端一直阻塞，也不想调用`UnblockClient`,因为`UnblockClient`会触发一次回复函数调用。


在这种情况下，最好的方法是使用下面的函数：
    int RedisModule_AbortBlock(RedisModuleBlockedClient *bc);

使用方法如下：
    int Example_RedisCommand(RedisModuleCtx *ctx, RedisModuleString **argv,
                             int argc)
    {
        RedisModuleBlockedClient *bc =
            RedisModule_BlockClient(ctx,reply_func,timeout_func,NULL,0);

        pthread_t tid;
        if (pthread_create(&tid,NULL,threadmain,bc) != 0) {
            RedisModule_AbortBlock(bc);
            RedisModule_ReplyWithError(ctx,"Sorry can't create a thread");
        }

        return REDISMODULE_OK;
    }

客户端会被解除阻塞，但是不会触发恢复函数的调用。

回复和超时回调可以使用一个函数
---

使用如下函数来实现回复和超时回调使用同一个函数的功能：

    int RedisModule_IsBlockedReplyRequest(RedisModuleCtx *ctx);
    int RedisModule_IsBlockedTimeoutRequest(RedisModuleCtx *ctx);

因此，我可以在回复和超时回调函数使用同一个函数的条件下，重写上面的例子：

    int Example_RedisCommand(RedisModuleCtx *ctx, RedisModuleString **argv,
                             int argc)
    {
        if (RedisModule_IsBlockedReplyRequest(ctx)) {
            long *mynumber = RedisModule_GetBlockedClientPrivateData(ctx);
            return RedisModule_ReplyWithLongLong(ctx,mynumber);
        } else if (RedisModule_IsBlockedTimeoutRequest) {
            return RedisModule_ReplyWithNull(ctx);
        }

        RedisModuleBlockedClient *bc =
            RedisModule_BlockClient(ctx,reply_func,timeout_func,NULL,0);

        pthread_t tid;
        if (pthread_create(&tid,NULL,threadmain,bc) != 0) {
            RedisModule_AbortBlock(bc);
            RedisModule_ReplyWithError(ctx,"Sorry can't create a thread");
        }

        return REDISMODULE_OK;
    }

功能上相同的。但是大家更倾向清晰简洁的实现以及更多关注命令逻辑的一个单独函数。

单线程内使用数据副本
---


如何和处理较慢命令的线程协同工作？有个有意思的解决方法是让这些线程使用数据的副本，因此，关于一个key的操作正在执行时，用户还是能看到
旧值。但是，当处理线程结束执行，新的值将被展示和使用。

该方法的例子如下
[Neural Redis module](https://github.com/antirez/neural-redis)
当神经网络在其他线程训练的时候，用户仍然使用旧版本的模型

未来工作
---

新的API在开发中，它可以让线程已更安全的方式来调用模块APIs，线程级命令也可以访问数据空间并做增量操作。

新特性目前没有ETA，但是它可能会在Redis 4.0中出现。
