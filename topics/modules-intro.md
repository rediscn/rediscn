---
layout: topics
title: modules-intro
permalink: topics/modules-intro.html
disqusIdentifier: topics/modules-intro
disqusUrl: http://redis.cn/topics/topics/modules-intro.html
discuzTid: 2016
tranAuthor: menwengit
---

Redis Modules: an introduction to the API
===

## Redis 模块：API的介绍

模块功能的文档由以下文件组成：

* `INTO.md`（这个文件）。关于 Redis 模块系统和 API 的概述。最好从这个文件开始阅读。
* `API.md`是从 moudule.c 的 RedisModule 函数顶部的注释创建的。这是一个非常好的参考去了解每个函数如何工作。
* `TYPES.md`涵盖了涉及模块功能中的所有原生数据类型的实现。
* `BLOCK.md`展示了如何写一个不会立刻回复的阻塞命令，该命令会阻塞客户端但不会阻塞 Redis 服务器，并且在可能的情况下进行回复。

Redis 模块功能通过使用外部模块来扩展 Redis 功能，以一定速度实现一个新的 Redis 命令并且和内部的功能特点相类似。

Redis 模块系统是动态库，可以在 Redis 启动或者使用`MODULE LOAD`命令时加载到 Redis 中。Redis 以单个 叫`redismodule.h`的C 头文件开放 C API，模块系统使用 C 语言编写，但是可以使用 C++ 或者其他具有绑定 C 功能的语言。

模块系统被设计为可以载入不同版本的 Redis，因此给定模块不需要重新被设计或者重新编译，只要运行在特定版本的 Redis 中。基于这个原因，模块使用特定的 API 版本注册到 Redis 内核中。当前 API 版本为“1”。

这个文档是关于 Redis 模块系统的最初版本。API，更多功能和其他细节在将来可能会发生改变。

## 载入模块

为了测试你开发的模块，你可以通过以下`redis.conf`配置指令：

    loadmodule /path/to/mymodule.so

也可以在运行时使用以下命令加载一个模块：

    MODULE LOAD /path/to/mymodule.so

为了列出所有已载入的模块，可以使用：

    MODULE LIST

最终，你可以使用以下命令卸载（并且你希望之后重新载入）一个模块

    MODULE UNLOAD mymodule

请注意，以上的`mymodule`不是没有`.so`后缀的文件名，而是模块被注册到 Redis 内核中的名称。这些名称可以通过`MODULE LIST`命令获得。然而，一个好的做法是动态库的文件名和注册到 Redis 内核中的模块名称相同。

## 最简单的模块示例

为了能展示模块的不同部分，这里我们展示一个非常简单的模块，实现输出一个随机数的命令。

    #include "redismodule.h"
    #include <stdlib.h>
    
    int HelloworldRand_RedisCommand(RedisModuleCtx *ctx, RedisModuleString **argv, int argc) {
        RedisModule_ReplyWithLongLong(ctx,rand());
        return REDISMODULE_OK;
    }
    
    int RedisModule_OnLoad(RedisModuleCtx *ctx, RedisModuleString **argv, int argc) {
        if (RedisModule_Init(ctx,"helloworld",1,REDISMODULE_APIVER_1)
            == REDISMODULE_ERR) return REDISMODULE_ERR;
    
        if (RedisModule_CreateCommand(ctx,"helloworld.rand",
            HelloworldRand_RedisCommand) == REDISMODULE_ERR)
            return REDISMODULE_ERR;
    
        return REDISMODULE_OK;
    }

示例模块有两个函数。一个实现了一个叫 HELLOWORLD.RAND 的命令。这个函数就是该模块的特性。然而另一个函数叫`RedisModule_OnLoad()`，每个模块都必须使用该函数。因为它是模块初始化，注册模块命令以及模块可能使用的其他私有数据结构的入口点。


请注意，模块调用命令的命名方式使用模块名称后接一个点的形式是一个好的主意，最终就像上述模块中的命令名称`HELLOWORLD.RAND`。这种方式不可能会有冲突。

请注意，不同的模块有冲突的命令，他们不能同时在 Redis 中运行，因为`RedisModule_CreateCommand`函数将会在其中一个模块中执行失败，因此载入模块会终止，返回一个错误条件。

## 模块初始化

以上示例展示了函数`RedisModule_Init()` 用法，它应该在`OnLoad`函数中第一个被调用，以下是函数原型：

    int RedisModule_Init(RedisModuleCtx *ctx, const char *modulename,
                         int module_version, int api_version);

这个`Init`函数会告诉 Redis 内核，模块有一个给定的名字，模块的版本（`MODULE LIST`所报告的）和模块将会使用一个指定版本的 API。

如果这个 API 版本是错误的，名字已经被使用或者有其他类似的错误，函数将会返回`REDISMODULE_ERR`，并且该模块的`OnLoad`函数立即错误返回。

在`Init`函数被调用之前，不能调用其他 API 函数，否则模块将会段错误并且 Redis 实例将会崩溃。

第二个函数调用，`RedisModule_CreateCommand`被使用来注册命令到 Redis 内核。以下是函数原型：

    int RedisModule_CreateCommand(RedisModuleCtx *ctx, const char *cmdname,
                                  RedisModuleCmdFunc cmdfunc);

正如所见那样，大多数 Redis 模块系统的 API 调用都将模块的`context`作为第一个参数，以便他们对调用模块，对命令和执行给定命令的客户端等等有一个引用。

要创建一个新命令，上述函数需要一个上下文`ctx`，命令名称和实现该命令函数的函数指针。它必须具有以下原型：

命令函数的参数只有被传到其他所有 API 调用中的上下文`ctx`，和由用户传递的命令参数列表和参数个数。

如你所见，所提供的参数指向一个指定的数据类型`RedisModuleString`。这是一个不透明的数据类型，您具有 API 函数的访问和使用权利，从不需要直接访问它的字段。

再来看实例命令的实现，我们可以找到另一个调用：

函数返回一个整数给调用该命令的客户端，就跟其他 Redis 命令一样。例如`INCR`或`SCARD`。

## Redis 模块的设置和依赖关系

Redis 模块不依赖于 Redis 或一些其他的库，也不需要使用特定的`redismodule.h`文件进行编译。要创建一个新的模块，只要在你源码树中拷贝一个最近版本的`redismodule.h`，链接所有你想要的库，并且创建一个已经导出`RedisModule_OnLoad()`函数符号的动态库。

模块系统能够载入不同版本的 Redis。

## 给 Redis 模块传递配置参数

当模块使用`MODULE LOAD`命令或者使用`redis.conf`中`loadmodule`指令载入时，用户可以在模块文件名称后面添加参数来传递配置参数给该模块：

在上面的例子中，字符串`foo`，`bar`和`123`将被传递给模块`OnLoad()`函数的`argv`参数作为一个`RedisModuleString`类型的指针数组。参数个数传递到`argc`。

你能访问这些字符串的方式在这篇文档的其他地方进行了说明。通常，模块将会保存模块配置参数到一些`static`的，可以访问的全局变量中，以便配置可以更改不同命令的行为。

## 和 RedisModuleString 对象配合使用

命令参数列表`argv`传递给模块命令，并且返回其他模块APIs函数的`RedisModuleString`类型的值。

通常你能直接传递模块字符串给其他 API 调用，但是有时你可能需要直接访问字符串对象。

这有一些需要和字符串对象配合使用的函数：

上述函数访问一个字符串对象，返回其指针和设置它的长度`len`。正如从`const`指针修饰符所看到的那样，你不应该写一个字符串对象的指针。

但是，如果你需要，可以使用如下的 API 创建一个新的字符串对象：

通过以上命令返回的字符串必须要使用相应的`RedisModule_FreeString()`函数来使用字符串。

但是如果你想要避免释放字符串，这篇文档之后会介绍的自动化内存管理会是一个不错的选择。

请注意，通过参数列表`argv`提供的字符串不需要释放，你只要释放你创建的，或者通过其他 APIs 返回的新的字符串，这些指定返回的字符串必须被释放。

### 数字和字符串相互转换

将一个整数转换为一个新的字符串是非常常见的操作，因此有一个函数这样做：

    RedisModuleString *mystr = RedisModule_CreateStringFromLongLong(ctx,10);
	Similarly in order to parse a string as a number:

同样地将一个字符串解析成数字：

    long long myval;
    if (RedisModule_StringToLongLong(ctx,argv[1],&myval) == REDISMODULE_OK) {
        /* Do something with 'myval' */
    }

### 从模块中访问 Redis 键

大多数的 Redis 模块，为了有用，都要和 Redis 数据空间进行交互（不总是这样，例如一个 ID生成器通常不需要设计 Redis键）。Redis 模块有两个不同的访问 Redis数据空间的 APIs，一个是提供快速访问的 低级API 和一个操作 Redis 数据结构的函数集。另一个是更高级的 API，允许调用 Redis 命令并且获取结果，类似于 Lua 脚本访问 Redis。

更高级别的 API 也可以用来访问 Redis 不能作为 APIs 的功能。

通常，模块开发者应该更喜欢低级的 API，因为使用低级 API 实现的命令运行速度和原生 Redis 命令速度相当。然而肯定有使用高级 API 的情况，例如通常一个瓶颈可能是处理数据而不是访问数据。

同时要注意，有时使用低级的 API 比高级 API 要容易。

## 调用 Redis 命令
urned by `Call()`.

高级 API 访问 Redis 是`RedisModule_Call()`函数之和，以及访问由`Call()`函数返回的回复对象所需的函数。

`RedisModule_Call`使用一个特别调用规则，使用一个格式说明符来指定，要作为参数传递给函数的对象是什么类型。

被调用的 Redis 命令只使用命令名称和参数列表。但是当调用命令时，参数可能来源于不同类型的字符串：以 null 为结尾的 C 字符串，在命令实现中从`argv`参数中接受的RedisModuleString 对象，有一个指针和一个长度的二进制安全的 C 缓冲区，等等。

例如，如果我想调用`INCRBY`命令，用一个从参数列表`argv`接受到的第一个字符串参数（键），参数列表是 RedisModuleString 对象类型的指针数组，并且一个表示数字“10”的 C 字符串作为第二个参数（增量），我将使用以下函数调用：

    RedisModuleCallReply *reply;
    reply = RedisModule_Call(ctx,"INCR","sc",argv[1],"10");

第一个参数是上下文信息，并且第二个总是一个以 null 结尾的 C 字符串作为命令的名称。第三个参数是格式说明符，每个字符对应一个要遵循的参数类型。上述情况的`"sc"`是指一个 RedisModuleString 对象，和一个以 null 结尾的 C 字符串。其他参数是指定的两个参数。实际上，`argv[1]`对应一个 RedisModuleString 对象，并且 `"10"`对应的是一个以 null 结尾的 C 字符串。

这是格式说明符的完整列表：

* **c** -- 以 null 结尾的 C 字符串指针。
* **b** -- C 缓冲区，需要两个参数：C 字符串的指针和`size_t`类型的长度。
* **s** -- `argv`接受到的 RedisModuleString 对象或者其他 Redis 模块 APIs 返回的 RedisModuleString 对象。
* **l** -- long long int类型。
* **v** -- RedisModuleString 对象的数组。
* **!** -- 这个修饰符只是为了告诉函数去将命令复制到从节点和 AOF 文件中。从解析参数的角度看，它会被忽略。

函数成功执行返回一个 RedisModuleString 对象，错误返回 NULL。

当命令名称无效时，格式说明符使用一个无法识别的字符或者当命令传入的参数个数出错时，返回 NULL 。以上情况`errno`变量被设置为`EINVAL`。当一个实例开启了集群模式，目标键不是当前实例所负责的哈希槽，也会返回 NULL。这种情况`errno`被设置为`EPERM`。

### 和 RedisModuleCallReply 对象配合使用

`RedisModuleCall`返回一个可以被`RedisModule_CallReply*`函数簇访问的回复对象。

为了获取这个类型或回复（对应一个 Redis 协议支持的数据类型），使用`RedisModule_CallReplyType()`函数：

    reply = RedisModule_Call(ctx,"INCR","sc",argv[1],"10");
    if (RedisModule_CallReplyType(reply) == REDISMODULE_REPLY_INTEGER) {
        long long myval = RedisModule_CallReplyInteger(reply);
        /* Do something with myval. */
    }

有效的类型有：

* `REDISMODULE_REPLY_STRING`批量字符串或状态回复。
* `REDISMODULE_REPLY_ERROR`错误。
* `REDISMODULE_REPLY_INTEGER`有符号的64位整数。
* `REDISMODULE_REPLY_ARRAY`回复数组。
* `REDISMODULE_REPLY_NULL`空回复。

字符串，错误和数组关联着一个长度。对于字符串回复和错误回复的长度，和回复字符串的长度一致。对于数组的长度，是元素的个数。为了获得回复长度，使用以下函数：

为了获得一个整数回复值，使用以下函数，如下面的例子所示：

调用一个错误类型的回复对象，上述函数总会返回`LLONG_MIN`。

数组回复的子元素是这样访问的：

    RedisModuleCallReply *subreply;
    subreply = RedisModule_CallReplyArrayElement(reply,idx);

如果你尝试越界访问数组，上述函数返回 NULL。

使用以下方式访问字符串回复和错误回复（都类似字符串但是类型不同），确保不写入返回的指针（返回值为`const`指针以便明确以防误用）

    size_t len;
    char *ptr = RedisModule_CallReplyStringPtr(reply,&len);

如果回复类型不是一个字符串或一个错误，返回NULL。

RedisCallReply 对象和模块字符串对象不相同（RedisModuleString 类型）。但是有时你可能需要传递字符串或整数类型的回复，给接收一个模块字符串参数的 API 函数。

在这种情况下，你可能想要评估是否使用低级 API 作为最简单的方式实现你的命令，或者你可以使用以下函数，从一个字符串类型，错误类型或整型的调用回复中，去创建一个新的字符串对象。

如果回复不是正确的类型，返回 NULL 。返回的字符串对象通常应该被`RedisModule_FreeString()`函数释放，或者通过授权的自动化内存管理器（请参阅相应的部分）。

## 释放回复对象的调用

回复对象必须使用`RedisModule_FreeCallReply`来释放。对于数组，你只需要释放最高级别的回复，不需要释放内嵌的回复。如果你释放内嵌回复对象发生错误，当前模块系统的实现提供了一个保护去避免崩溃，但是无法保证未来仍然提供保护，因此这不应该被视为 API 的一部分。

如果你使用自动化内存管理（本文后面有介绍），你不需要释放回复（但是如果你希望立即释放内存，也是可以的）。

### Redis 命令的返回值

和一般的 Redis 命令一样，通过模块实现的新命令必须将返回值返回给调用者。API 为此提供了一组函数，以返回常规的 Redis 协议类型，以及作为元素类型的数组。也可以用任何错误字符串和错误码返回错误（错误码是错误消息的初始大写字母，如“BUSY the sever is busy”错误信息中的“BUSY”字符串）

所有的函数将回复发送给客户端调用`RedisModule_ReplyWith<something>`。

返回一个错误，使用：

    RedisModule_ReplyWithError(RedisModuleCtx *ctx, const char *err);
There is a predefined error string for key of wrong type errors:

对于错误类型的键，有一个预定义的错误字符串。

    REDISMODULE_ERRORMSG_WRONGTYPE

使用示例如下：

    RedisModule_ReplyWithError(ctx,"ERR invalid arguments");

在上面的例子中，我们已经看到如何回复一个 long long 类型的回复。

    RedisModule_ReplyWithLongLong(ctx,12345);

要回复一个简单的字符串，不能包含二进制值或换行符（所以它适合发送短单词，例如“OK”），可以使用：

    RedisModule_ReplyWithSimpleString(ctx,"OK");

使用下面两种函数，可以回复一个二进制安全的批量字符串：

    int RedisModule_ReplyWithStringBuffer(RedisModuleCtx *ctx, const char *buf, size_t len);

    int RedisModule_ReplyWithString(RedisModuleCtx *ctx, RedisModuleString *str);

第一个函数接收一个 C 指针和长度。第二个是一个 RedisMoudleString 对象。使用哪一个取决于你目前所持有的类型。

为了回复一个数组，你只需使用一个函数去指定数组长度，然后调用上述的函数，数组元素的个数如下：

    RedisModule_ReplyWithArray(ctx,2);
    RedisModule_ReplyWithStringBuffer(ctx,"age",3);
    RedisModule_ReplyWithLongLong(ctx,22);

要返回一个内嵌的数组很简单，你的内嵌数组元素只需要后面跟着使用另一个

`RedisModule_ReplyWithArray()`函数，来指定子数组元素。

### 返回动态长度的数组

有时无法事先知道一个数组的元素个数。例如，想想一个事先实现 FACTOR 命令的 Redis 模块，输出一个给定数的因子。要将主要因子保存到一个数组中，然后生成命令的回复，而不是将该数进行序列化，一个较好的解决办法是开创一个长度未知的数组回复，之后在进行补充元素。这被实现为`RedisModule_ReplyWithArray()`，并且有一个特别的参数。

    RedisModule_ReplyWithArray(ctx, REDISMODULE_POSTPONED_ARRAY_LEN);
上述调用开创一个数组回复以便我们使用其他`ReplyWith`调用来生成数组项。最终使用下面的调用来设置数组长度。

    RedisModule_ReplySetArrayLength(ctx, number_of_items);

在 FACTOR 命令的情况下，类似的代码如下：

    RedisModule_ReplyWithArray(ctx, REDISMODULE_POSTPONED_ARRAY_LEN);
    number_of_factors = 0;
    while(still_factors) {
        RedisModule_ReplyWithLongLong(ctx, some_factor);
        number_of_factors++;
    }
    RedisModule_ReplySetArrayLength(ctx, number_of_factors);

另一个常见的用例是遍历一些数组集合，并且只返回通过一些过滤的数组。

有可能有多个延迟回复的嵌套数组。每个`SetArray()`调用都会设置最近对应调用`ReplyWithArray()`的长度。

    RedisModule_ReplyWithArray(ctx, REDISMODULE_POSTPONED_ARRAY_LEN);
    ... generate 100 elements ...
    RedisModule_ReplyWithArray(ctx, REDISMODULE_POSTPONED_ARRAY_LEN);
    ... generate 10 elements ...
    RedisModule_ReplySetArrayLength(ctx, 10);
    RedisModule_ReplySetArrayLength(ctx, 100);


这将创建一个100项的数组，最后10项的数组作为一个元素。

## 数量和类型检查

通常命令需要检查参数个数和键的类型是否正确。为了报告错误的参数个数，有一个叫`RedisModule_WrongArity()`特定的函数。用法非常简单：

    if (argc != 2) return RedisModule_WrongArity(ctx);

检查错误类型包括打开键和类型检查：

    RedisModuleKey *key = RedisModule_OpenKey(ctx,argv[1],
        REDISMODULE_READ|REDISMODULE_WRITE);
    
    int keytype = RedisModule_KeyType(key);
    if (keytype != REDISMODULE_KEYTYPE_STRING &&
        keytype != REDISMODULE_KEYTYPE_EMPTY)
    {
        RedisModule_CloseKey(key);
        return RedisModule_ReplyWithError(ctx,REDISMODULE_ERRORMSG_WRONGTYPE);
    }


请注意，如果一个键是预期的类型或者为空，通常要继续执行命令。

### 键的低级访问

键的低级访问允许对直接关联键的值对象执行操作，速度类似于 Redis 在内部使用的内置命令。

一旦键被打开，将返回键的指针，该指针将被所有低级的 API 调用使用来对键或键的值对象执行操作。

因为 API 执行是非常快的，它不能做太多运行检查，所以用户必须注意遵循以下规则：

* 多次打开相同的键，至少一个被打开用于写操作，这是未定义的行为，可能会导致崩溃。
* 当一个键被打开，它应该只能通过低级的 API 访问。例如打开一个键，然后使用`RedisModule_Call()` API 对相同的键执行 DEL ，这将导致奔溃。但是用低级的 API 执行一些操作，然后关闭它，接着在使用其他 APIs 管理相同的键，并且随后再次打开它做更多操作，这是安全的打开键操作。

为了用`RedisModule_OpenKey`函数打开一个键。它返回一个键的指针，我们能用它在下次的调用中访问和修改键的值对象。

    RedisModuleKey *key;
    key = RedisModule_OpenKey(ctx,argv[1],REDISMODULE_READ);

第二个参数是键的名称，必须是`RedisModuleString`类型的对象。第三个参数是一个模式：`REDISMODULE_READ`或者`REDISMODULE_WRITE`。可以使用`|`来位或两个模式将打开的键处于两种模式。此时，被打开的用于写的键也能用于读操作，但是这是一个要考虑的实现细节。正确的模式应当被使用在正确的模块中。

你可以以写模式打开不存在的键，因为当尝试对该键进行写操作时，将创建该键。但是当以读模式打开该键时，如果该键不存在，`RedisModule_OpenKey`将会返回 NULL 。

一旦该键使用完成，你可以关闭它：

    RedisModule_CloseKey(key);

请注意，如果自动化内存管理被开启，你不用强制关闭键。但模块函数返回时， Redis 将把仍被打开的键小心地关闭掉。

### 获取键的类型

要获取键的值，使用`RedisModule_KeyType()`函数：

    int keytype = RedisModule_KeyType(key);

它返回以下值的其中一个：

    REDISMODULE_KEYTYPE_EMPTY
    REDISMODULE_KEYTYPE_STRING
    REDISMODULE_KEYTYPE_LIST
    REDISMODULE_KEYTYPE_HASH
    REDISMODULE_KEYTYPE_SET
    REDISMODULE_KEYTYPE_ZSET

上述是一般的 Redis 键类型，该添加了一个空类型，表示键指针关联了一个不存在空键。

### 创建新键

要创建一个新键，以写模式打开并且使用键的其中一个写入函数写入它。例如：

    RedisModuleKey *key;
    key = RedisModule_OpenKey(ctx,argv[1],REDISMODULE_READ);
    if (RedisModule_KeyType(key) == REDISMODULE_KEYTYPE_EMPTY) {
        RedisModule_StringSet(key,argv[2]);
    }

### 删除键

只需要用：

    RedisModule_DeleteKey(key);

如果键没以写模式打开，函数返回`REDISMODULE_ERR`。注意，当一个键被删除之后，该键就被设置为一个新的键命令的目标。例如，`RedisModule_KeyType`将返回它是空键类型，写入该键将创建一个新键，有可能是另一个类型（取决于使用的 API）。

### 管理键的到期时间（TTLs）

提供了两个函数来控制键的到期时间，能设置、修改、获取和取消键的生存时间。

一个函数用来查询当前打开键的到期时间。

函数返回键的毫秒单位的生存时间，或返回特殊值`REDISMODULE_NO_EXPIRE`，表示键没有关联到期时间或不存在过期（你可以区分两种情况检查是否键的类型是`REDISMODULE_KEYTYPE_EMPTY`）。

要改变键的到期时间，使用下面的函数：

当接收到一个不存在的键，返回`REDISMODULE_ERR`，因为函数只能将到期时间关联到一个存在且打开的键上（不存在但打开的键仅用于创建新的，具有特定写操作数据类型的值对象）。

再次以毫秒单位指定`expire`时间。如果键当前没有到期时间，将设置一个新的到期时间。如果键已经有一个到期时间，则被一个新值替代。

如果键已经有一个到期时间，并且使用特殊值`REDISMODULE_NO_EXPIRE`作为新的到期时间，那么到期时间被删除，类似 Redis 的`PERSIST`命令。如果键本来就没有过期时间，则什么也不做。

### 获取值的长度

有一个函数，被用来检索打开的键锁关联值对象的长度。返回的是一个指定的值，如果是字符串，则是字符串的长度，如果是聚合数据类型，则是元素的个数（列表、集合、有序集合、哈希表中元素的个数）。

    size_t len = RedisModule_ValueLength(key);

如果键不存在，函数返回 0 。

### 字符串类型的 API

设置一个新的字符串值，就像 Redis 的`SET`命令，使用：

    int RedisModule_StringSet(RedisModuleKey *key, RedisModuleString *str);

该函数完全和 Redis 的`SET`命令本身一样，也就是说，如果有先前存在的值（任何类型），它将被删除。

使用 DMA（direct memory access）快速访问一个存在的字符串值。API 将返回一个指针和一个长度，因此可以这样访问，如果需要，直接修改字符串。

    size_t len, j;
    char *myptr = RedisModule_StringDMA(key,&len,REDISMODULE_WRITE);
    for (j = 0; j < len; j++) myptr[j] = 'A';

上面的例子，我们直接写入字符串。请注意，如果你想写，你必须确定是否打开`WRITE`模式。

如果在DMA 调用之后，DMA 指针仅仅在使用指针前不使用其他操作才有效。

有时，当我们想直接操作字符串，我们还要改变他们的大小。对于这种情况，可以使用`RedisModule_StringTruncate`函数，例如：

    RedisModule_StringTruncate(mykey,1024);
函数会按照需要截断或扩大字符串，如果之前的长度小于我们要求新的长度，会用0字节填充。如果字符串不存在，而`key`关联了一个打开的空键，那么会创建一个字符串值并且关联到该键。

请注意，每次`StringTruncate()`被调用时，我们需要重新获取 DMA 指针，因为旧的可能已经无效。

### 列表类型 API

可以从列表中 push 和 pop 一个值：

    int RedisModule_ListPush(RedisModuleKey *key, int where, RedisModuleString *ele);
    RedisModuleString *RedisModule_ListPop(RedisModuleKey *key, int where);

如果从尾部或头部 push 或 pop，可以使用以下宏在`where`参数中指定：

    REDISMODULE_LIST_HEAD
    REDISMODULE_LIST_TAIL

被`RedisModule_ListPop()`返回的元素像被`RedisModule_CreateString()`创建的字符串一样，他们必须被`RedisModule_FreeString()`函数释放，或则开启了自动化内存管理。

### 集合类型 API

文档正在编写过程中。

### 有序集合 API

文档缺失，关于以下函数请参阅`module.c`的顶部注释：

* `RedisModule_ZsetAdd`
* `RedisModule_ZsetIncrby`
* `RedisModule_ZsetScore`
* `RedisModule_ZsetRem`
* 
对于有序集合迭代器：

* `RedisModule_ZsetRangeStop`
* `RedisModule_ZsetFirstInScoreRange`
* `RedisModule_ZsetLastInScoreRange`
* `RedisModule_ZsetFirstInLexRange`
* `RedisModule_ZsetLastInLexRange`
* `RedisModule_ZsetRangeCurrentElement`
* `RedisModule_ZsetRangeNext`
* `RedisModule_ZsetRangePrev`
* `RedisModule_ZsetRangeEndReached`

### 哈希类型 API

文档缺失，关于以下函数请参阅`module.c`的顶部注释：

* `RedisModule_HashSet`
* `RedisModule_HashGet`

### 迭代聚合值

文档正在编写过程中。

## 复制命令

如果你想要像正常 Redis 命令那样使用模块命令，在复制的 Redis 实例的上下文中或者使用 AOF 持久化机制，这对于模块命令处理他们复制的一致性很重要。

当使用更高级别的 APIs 来调用命令时，如果你使用字符串格式中的“!”修饰符，则自动会进行复制操作，`RedisModule_Call()`使用示例如下：

    reply = RedisModule_Call(ctx,"INCR","!sc",argv[1],"10");

正如你能看到的格式修饰符是`"!sc"`。这个感叹号不会作为一个格式修饰符被解析，而是解释为一个内部命令“必须复制”。

如果你使用上述的编程风格，这是没有问题的。但是有时事情会比这更加复杂，比如你说用着低级的 API 。在这种情况中，如果命令的执行没有副作用，并且总是执行着相同的动作，那么可以做的是在用户执行命令时，一字不差的复制命令。要做到这一点，你需要调用以下函数：

    RedisModule_ReplicateVerbatim(ctx);

当你使用上述 API 时，你不应该使用任何其他复制函数，因为他们无法保证能够合成的很好。

但是这不是唯一的选项。还可以正确的告诉 Redis 将要复制的命令作为命令执行的效果。使用一个类似于`RedisModule_Call()`的 API 但不是调用该命令将其发送给 AOF /从节点流。例如：

    RedisModule_Replicate(ctx,"INCRBY","cl","foo",my_increment);

可以多次调用`RedisModule_Replicate`，每次都会发出一个命令。所有被发出的序列被封装到一个`MULTI/EXEC`事务之中，以便 AOF 和复制的效果和执行单个命令是相同的。

请注意，`Call()`复制和`Replicate()`复制有一个规则，以防你想要混合两种复制的格式（如果有简单的处理方案，这种必定不是好办法）。调用`Call()`的复制的命令总是在最终的`MULTI/EXEC`块中第一个被发出，而所有调用`Replicate()`复制的命令则跟随在其后。

## 自动化内存管理

通常在用 C 语言编写程序时，程序员需要手动管理内存。这是为什么 Redis 模块 API 有函数要去释放字符串，关闭打开的键，释放回复等等。

但是，这些命令在一个独立的环境中和一套严格的 APIs 中执行，Redis 能够为模块系统提供自动化内存管理，而这些都是以性能为代价的（大多数时候是非常低的成本）。

当自动化内存管理开启时：

1. 你不需要关闭打开的键。

2. 你不需要释放replies。

3. 你不需要释放 RedisModuleString 对象。

然而，如果你想要，你仍要可以这么做。例如，自动化内存管理可能是动态的，在一个分配许多字符串的循环中，你可能仍想要释放不在使用的字符串。

要开启自动化内存管理，只要在命令实现开始时，调用下面的函数：

    RedisModule_AutoMemory(ctx);

自动化内存管理通常是一个方法，有经验的 Ｃ程序员可能不使用它，而获取一些速度和内存使用效益。

## 分配内存到模块中

普通 C 程序员使用`malloc()`和`free()`来分配和释放动态内存。虽然在 Redis 模块中这种分配内存的方式在技术上不被禁止，但是更好的方式是使用 Redis 模块指定的函数，这能确切的替代`malloc`、`free`、`realloc`、`strdup`。这些函数是：

    void *RedisModule_Alloc(size_t bytes);
    void* RedisModule_Realloc(void *ptr, size_t bytes);
    void RedisModule_Free(void *ptr);
    void RedisModule_Calloc(size_t nmemb, size_t size);
    char *RedisModule_Strdup(const char *str);

这些函数和`libc`库中的调用工作是等价的，但是他们和 Redis 使用相同的内存分配器，并且使用这些函数分配的内存，能够通过`INFO`命令的内存信息部分报告出来，当实施了`maxmemory`策略时，这些函数会被考虑到，并且通常是 Redis 可执行的第一项。相反，在模块中使用 libc 的`malloc()`分配方法则对 Redis 是透明的。

另一个使用模块函数分配内存的原因是，当在模块中创建了原生数据类型，RDB 加载函数能直接返回反序列化的字符串（从 RDB 文件中）作为`RedisModule_Alloc()`的分配项，因此他们在加载之后能直接被使用来填充数据结构，而不是将其复制到数据结构中。

### 池分配器

有时在命令实现中，需要执行许多小的分配项，这些分配项在命令执行结束时不被保留，但是只能执行命令本身。

使用 Redis 的池分配器可以轻松的完成此工作：

他和`malloc()`工作类似，返回大于或等于`bytes`（最大对齐8字节）的下一个二的幂次方大小的对齐的内存。但是它会分配一个内存块，所以分配的开销很小，最重要的是，分配的内存当命令返回时自动被释放。

所以一般来说，短期分配项使用池分配器是一个好的选择。

## 编写与 Redis Cluster 兼容的命令

文档缺失，请在`module.c`中查看以下函数：

    RedisModule_IsKeysPositionRequest(ctx);
    RedisModule_KeyAtPos(ctx,pos);
