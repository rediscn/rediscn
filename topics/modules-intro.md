---
layout: topics
title: modules-intro
permalink: topics/modules-intro.html
disqusIdentifier: topics/modules-intro
disqusUrl: http://redis.cn/topics/topics/modules-intro.html
discuzTid: 2016
---

Redis Modules: an introduction to the API
===

## Redis 模块：API的介绍

The modules documentation is composed of the following files:

模块功能的文档由以下文件组成：

* `INTRO.md` (this file). An overview about Redis Modules system and API. It's a good idea to start your reading here.
* `INTO.md`（这个文件）。关于 Redis 模块系统和 API 的概述。最好从这个文件开始阅读。
* `API.md` is generated from module.c top comments of RedisMoule functions. It is a good reference in order to understand how each function works.
* `API.md`是从 moudule.c 的 RedisModule 函数顶部的注释创建的。这是一个非常好的参考去了解每个函数如何工作。
* `TYPES.md` covers the implementation of native data types into modules.
* `TYPES.md`涵盖了涉及模块功能中的所有原生数据类型的实现。
* `BLOCK.md` shows how to write blocking commands that will not reply immediately, but will block the client, without blocking the Redis server, and will provide a reply whenever will be possible.
* `BLOCK.md`展示了如何写一个不会立刻回复的阻塞命令，该命令会阻塞客户端但不会阻塞 Redis 服务器，并且在可能的情况下进行回复。

Redis modules make possible to extend Redis functionality using external
modules, implementing new Redis commands at a speed and with features
similar to what can be done inside the core itself.

Redis 模块功能通过使用外部模块来扩展 Redis 功能，以一定速度实现一个新的 Redis 命令并且和内部的功能特点相类似。

Redis modules are dynamic libraries, that can be loaded into Redis at
startup or using the `MODULE LOAD` command. Redis exports a C API, in the
form of a single C header file called `redismodule.h`. Modules are meant
to be written in C, however it will be possible to use C++ or other languages
that have C binding functionalities.

Redis 模块系统是动态库，可以在 Redis 启动或者使用`MODULE LOAD`命令时加载到 Redis 中。Redis 以单个 叫`redismodule.h`的C 头文件开放 C API，模块系统使用 C 语言编写，但是可以使用 C++ 或者其他具有绑定 C 功能的语言。

Modules are designed in order to be loaded into different versions of Redis,
so a given module does not need to be designed, or recompiled, in order to
run with a specific version of Redis. For this reason, the module will
register to the Redis core using a specific API version. The current API
version is "1".

模块系统被设计为可以载入不同版本的 Redis，因此给定模块不需要重新被设计或者重新编译，只要运行在特定版本的 Redis 中。基于这个原因，模块使用特定的 API 版本注册到 Redis 内核中。当前 API 版本为“1”。

This document is about an alpha version of Redis modules. API, functionalities
and other details may change in the future.

这个文档是关于 Redis 模块系统的最初版本。API，更多功能和其他细节在将来可能会发生改变。

# Loading modules

## 载入模块

In order to test the module you are developing, you can load the module
using the following `redis.conf` configuration directive:

为了测试你开发的模块，你可以通过以下`redis.conf`配置指令：

    loadmodule /path/to/mymodule.so
It is also possible to load a module at runtime using the following command:

也可以在运行时使用以下命令加载一个模块：

    MODULE LOAD /path/to/mymodule.so
In order to list all loaded modules, use:

为了列出所有已载入的模块，可以使用：

    MODULE LIST
Finally, you can unload (and later reload if you wish) a module using the
following command:

最终，你可以使用以下命令卸载（并且你希望之后重新载入）一个模块

    MODULE UNLOAD mymodule
Note that `mymodule` above is not the filename without the `.so` suffix, but
instead, the name the module used to register itself into the Redis core.
The name can be obtained using `MODULE LIST`. However it is good practice
that the filename of the dynamic library is the same as the name the module
uses to register itself into the Redis core.

请注意，以上的`mymodule`不是没有`.so`后缀的文件名，而是模块被注册到 Redis 内核中的名称。这些名称可以通过`MODULE LIST`命令获得。然而，一个好的做法是动态库的文件名和注册到 Redis 内核中的模块名称相同。

# The simplest module you can write

## 最简单的模块示例

In order to show the different parts of a module, here we'll show a very
simple module that implements a command that outputs a random number.

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

The example module has two functions. One implements a command called
HELLOWORLD.RAND. This function is specific of that module. However the
other function called `RedisModule_OnLoad()` must be present in each
Redis module. It is the entry point for the module to be initialized,
register its commands, and potentially other private data structures
it uses.

示例模块有两个函数。一个实现了一个叫 HELLOWORLD.RAND 的命令。这个函数就是该模块的特性。然而另一个函数叫`RedisModule_OnLoad()`，每个模块都必须使用该函数。因为它是模块初始化，注册模块命令以及模块可能使用的其他私有数据结构的入口点。

Note that it is a good idea for modules to call commands with the
name of the module followed by a dot, and finally the command name,
like in the case of `HELLOWORLD.RAND`. This way it is less likely to
have collisions.

请注意，模块调用命令的命名方式使用模块名称后接一个点的形式是一个好的主意，最终就像上述模块中的命令名称`HELLOWORLD.RAND`。这种方式不可能会有冲突。

Note that if different modules have colliding commands, they'll not be
able to work in Redis at the same time, since the function
`RedisModule_CreateCommand` will fail in one of the modules, so the module
loading will abort returning an error condition.

请注意，不同的模块有冲突的命令，他们不能同时在 Redis 中运行，因为`RedisModule_CreateCommand`函数将会在其中一个模块中执行失败，因此载入模块会终止，返回一个错误条件。

# Module initialization

## 模块初始化

The above example shows the usage of the function `RedisModule_Init()`.
It should be the first function called by the module `OnLoad` function.
The following is the function prototype:

以上示例展示了函数`RedisModule_Init()` 用法，它应该在`OnLoad`函数中第一个被调用，以下是函数原型：

    int RedisModule_Init(RedisModuleCtx *ctx, const char *modulename,
                         int module_version, int api_version);

The `Init` function announces the Redis core that the module has a given
name, its version (that is reported by `MODULE LIST`), and that is willing
to use a specific version of the API.

这个`Init`函数会告诉 Redis 内核，模块有一个给定的名字，模块的版本（`MODULE LIST`所报告的）和模块将会使用一个指定版本的 API。

If the API version is wrong, the name is already taken, or there are other
similar errors, the function will return `REDISMODULE_ERR`, and the module
`OnLoad` function should return ASAP with an error.

如果这个 API 版本是错误的，名字已经被使用或者有其他类似的错误，函数将会返回`REDISMODULE_ERR`，并且该模块的`OnLoad`函数立即错误返回。

Before the `Init` function is called, no other API function can be called,
otherwise the module will segfault and the Redis instance will crash.

在`Init`函数被调用之前，不能调用其他 API 函数，否则模块将会段错误并且 Redis 实例将会崩溃。

The second function called, `RedisModule_CreateCommand`, is used in order
to register commands into the Redis core. The following is the prototype:

第二个函数调用，`RedisModule_CreateCommand`被使用来注册命令到 Redis 内核。以下是函数原型：

    int RedisModule_CreateCommand(RedisModuleCtx *ctx, const char *cmdname,
                                  RedisModuleCmdFunc cmdfunc);

As you can see, most Redis modules API calls all take as first argument
the `context` of the module, so that they have a reference to the module
calling it, to the command and client executing a given command, and so forth.

正如所见那样，大多数 Redis 模块系统的 API 调用都将模块的`context`作为第一个参数，以便他们对调用模块，对命令和执行给定命令的客户端等等有一个引用。

To create a new command, the above function needs the context, the command
name, and the function pointer of the function implementing the command,
which must have the following prototype:

要创建一个新命令，上述函数需要一个上下文`ctx`，命令名称和实现该命令函数的函数指针。它必须具有以下原型：


    int mycommand(RedisModuleCtx *ctx, RedisModuleString **argv, int argc);
The command function arguments are just the context, that will be passed
to all the other API calls, the command argument vector, and total number
of arguments, as passed by the user.

命令函数的参数只有被传到其他所有 API 调用中的上下文`ctx`，和由用户传递的命令参数列表和参数个数。

As you can see, the arguments are provided as pointers to a specific data
type, the `RedisModuleString`. This is an opaque data type you have API
functions to access and use, direct access to its fields is never needed.

如你所见，所提供的参数指向一个指定的数据类型`RedisModuleString`。这是一个不透明的数据类型，您具有 API 函数的访问和使用权利，从不需要直接访问它的字段。

Zooming into the example command implementation, we can find another call:

再来看实例命令的实现，我们可以找到另一个调用：

    int RedisModule_ReplyWithLongLong(RedisModuleCtx *ctx, long long integer);
This function returns an integer to the client that invoked the command,
exactly like other Redis commands do, like for example `INCR` or `SCARD`.

函数返回一个整数给调用该命令的客户端，就跟其他 Redis 命令一样。例如`INCR`或`SCARD`。

# Setup and dependencies of a Redis module

## Redis 模块的设置和依赖关系

Redis modules don't depend on Redis or some other library, nor they
need to be compiled with a specific `redismodule.h` file. In order
to create a new module, just copy a recent version of `redismodule.h`
in your source tree, link all the libraries you want, and create
a dynamic library having the `RedisModule_OnLoad()` function symbol
exported.

Redis 模块不依赖于 Redis 或一些其他的库，也不需要使用特定的`redismodule.h`文件进行编译。要创建一个新的模块，只要在你源码树中拷贝一个最近版本的`redismodule.h`，链接所有你想要的库，并且创建一个已经导出`RedisModule_OnLoad()`函数符号的动态库。

The module will be able to load into different versions of Redis.

模块系统能够载入不同版本的 Redis。

# Passing configuration parameters to Redis modules

## 给 Redis 模块传递配置参数

When the module is loaded with the `MODULE LOAD` command, or using the
`loadmodule` directive in the `redis.conf` file, the user is able to pass
configuration parameters to the module by adding arguments after the module
file name:

当模块使用`MODULE LOAD`命令或者使用`redis.conf`中`loadmodule`指令载入时，用户可以在模块文件名称后面添加参数来传递配置参数给该模块：

    loadmodule mymodule.so foo bar 1234
In the above example the strings `foo`, `bar` and `123` will be passed
to the module `OnLoad()` function in the `argv` argument as an array
of RedisModuleString pointers. The number of arguments passed is into `argc`.

在上面的例子中，字符串`foo`，`bar`和`123`将被传递给模块`OnLoad()`函数的`argv`参数作为一个`RedisModuleString`类型的指针数组。参数个数传递到`argc`。

The way you can access those strings will be explained in the rest of this
document. Normally the module will store the module configuration parameters
in some `static` global variable that can be accessed module wide, so that
the configuration can change the behavior of different commands.

你能访问这些字符串的方式在这篇文档的其他地方进行了说明。通常，模块将会保存模块配置参数到一些`static`的，可以访问的全局变量中，以便配置可以更改不同命令的行为。

# Working with RedisModuleString objects

## 和 RedisModuleString 对象配合使用

The command argument vector `argv` passed to module commands, and the
return value of other module APIs functions, are of type `RedisModuleString`.

命令参数列表`argv`传递给模块命令，并且返回其他模块APIs函数的`RedisModuleString`类型的值。

Usually you directly pass module strings to other API calls, however sometimes
you may need to directly access the string object.

通常你能直接传递模块字符串给其他 API 调用，但是有时你可能需要直接访问字符串对象。

There are a few functions in order to work with string objects:

这有一些需要和字符串对象配合使用的函数：

    const char *RedisModule_StringPtrLen(RedisModuleString *string, size_t *len);
The above function accesses a string by returning its pointer and setting its
length in `len`. You should never write to a string object pointer, as you can see from the `const` pointer qualifier.

上述函数访问一个字符串对象，返回其指针和设置它的长度`len`。正如从`const`指针修饰符所看到的那样，你不应该写一个字符串对象的指针。

However, if you want, you can create new string objects using the following
API:

但是，如果你需要，可以使用如下的 API 创建一个新的字符串对象：

    RedisModuleString *RedisModule_CreateString(RedisModuleCtx *ctx, const char *ptr, size_t len);
The string returned by the above command must be freed using a corresponding
call to `RedisModule_FreeString()`:

通过以上命令返回的字符串必须要使用相应的`RedisModule_FreeString()`函数来使用字符串。

    void RedisModule_FreeString(RedisModuleString *str);
However if you want to avoid having to free strings, the automatic memory
management, covered later in this document, can be a good alternative, by
doing it for you.

但是如果你想要避免释放字符串，这篇文档之后会介绍的自动化内存管理会是一个不错的选择。

Note that the strings provided via the argument vector `argv` never need
to be freed. You only need to free new strings you create, or new strings
returned by other APIs, where it is specified that the returned string must
be freed.

请注意，通过参数列表`argv`提供的字符串不需要释放，你只要释放你创建的，或者通过其他 APIs 返回的新的字符串，这些指定返回的字符串必须被释放。

## Creating strings from numbers or parsing strings as numbers

### 数字和字符串相互转换

Creating a new string from an integer is a very common operation, so there
is a function to do this:

将一个整数转换为一个新的字符串是非常常见的操作，因此有一个函数这样做：

    RedisModuleString *mystr = RedisModule_CreateStringFromLongLong(ctx,10);
Similarly in order to parse a string as a number:

同样地将一个字符串解析成数字：

    long long myval;
    if (RedisModule_StringToLongLong(ctx,argv[1],&myval) == REDISMODULE_OK) {
        /* Do something with 'myval' */
    }

## Accessing Redis keys from modules

### 从模块中访问 Redis 键

Most Redis modules, in order to be useful, have to interact with the Redis
data space (this is not always true, for example an ID generator may
never touch Redis keys). Redis modules have two different APIs in order to
access the Redis data space, one is a low level API that provides very
fast access and a set of functions to manipulate Redis data structures.
The other API is more high level, and allows to call Redis commands and
fetch the result, similarly to how Lua scripts access Redis.

大多数的 Redis 模块，为了有用，都要和 Redis 数据空间进行交互（不总是这样，例如一个 ID生成器通常不需要设计 Redis键）。Redis 模块有两个不同的访问 Redis数据空间的 APIs，一个是提供快速访问的 低级API 和一个操作 Redis 数据结构的函数集。另一个是更高级的 API，允许调用 Redis 命令并且获取结果，类似于 Lua 脚本访问 Redis。

The high level API is also useful in order to access Redis functionalities
that are not available as APIs.

更高级别的 API 也可以用来访问 Redis 不能作为 APIs 的功能。

In general modules developers should prefer the low level API, because commands
implemented using the low level API run at a speed comparable to the speed
of native Redis commands. However there are definitely use cases for the
higher level API. For example often the bottleneck could be processing the
data and not accessing it.

通常，模块开发者应该更喜欢低级的 API，因为使用低级 API 实现的命令运行速度和原生 Redis 命令速度相当。然而肯定有使用高级 API 的情况，例如通常一个瓶颈可能是处理数据而不是访问数据。

Also note that sometimes using the low level API is not harder compared to
the higher level one.

同时要注意，有时使用低级的 API 比高级 API 要容易。

# Calling Redis commands

## 调用 Redis 命令

The high level API to access Redis is the sum of the `RedisModule_Call()`
function, together with the functions needed in order to access the
reply object returned by `Call()`.

高级 API 访问 Redis 是`RedisModule_Call()`函数之和，以及访问由`Call()`函数返回的回复对象所需的函数。

`RedisModule_Call` uses a special calling convention, with a format specifier
that is used to specify what kind of objects you are passing as arguments
to the function.

`RedisModule_Call`使用一个特别调用规则，使用一个格式说明符来指定，要作为参数传递给函数的对象是什么类型。

Redis commands are invoked just using a command name and a list of arguments.
However when calling commands, the arguments may originate from different
kind of strings: null-terminated C strings, RedisModuleString objects as
received from the `argv` parameter in the command implementation, binary
safe C buffers with a pointer and a length, and so forth.

被调用的 Redis 命令只使用命令名称和参数列表。但是当调用命令时，参数可能来源于不同类型的字符串：以 null 为结尾的 C 字符串，在命令实现中从`argv`参数中接受的RedisModuleString 对象，有一个指针和一个长度的二进制安全的 C 缓冲区，等等。

For example if I want to call `INCRBY` using a first argument (the key)
a string received in the argument vector `argv`, which is an array
of RedisModuleString object pointers, and a C string representing the
number "10" as second argument (the increment), I'll use the following
function call:

例如，如果我想调用`INCRBY`命令，用一个从参数列表`argv`接受到的第一个字符串参数（键），参数列表是 RedisModuleString 对象类型的指针数组，并且一个表示数字“10”的 C 字符串作为第二个参数（增量），我将使用以下函数调用：

    RedisModuleCallReply *reply;
    reply = RedisModule_Call(ctx,"INCR","sc",argv[1],"10");

The first argument is the context, and the second is always a null terminated
C string with the command name. The third argument is the format specifier
where each character corresponds to the type of the arguments that will follow. In the above case `"sc"` means a RedisModuleString object, and a null
terminated C string. The other arguments are just the two arguments as
specified. In fact `argv[1]` is a RedisModuleString and `"10"` is a null
terminated C string.

第一个参数是上下文信息，并且第二个总是一个以 null 结尾的 C 字符串作为命令的名称。第三个参数是格式说明符，每个字符对应一个要遵循的参数类型。上述情况的`"sc"`是指一个 RedisModuleString 对象，和一个以 null 结尾的 C 字符串。其他参数是指定的两个参数。实际上，`argv[1]`对应一个 RedisModuleString 对象，并且 `"10"`对应的是一个以 null 结尾的 C 字符串。

This is the full list of format specifiers:

这是格式说明符的完整列表：

* **c** -- Null terminated C string pointer.
* **c** -- 以 null 结尾的 C 字符串指针。
* **b** -- C buffer, two arguments needed: C string pointer and `size_t` length.
* **b** -- C 缓冲区，需要两个参数：C 字符串的指针和`size_t`类型的长度。
* **s** -- RedisModuleString as received in `argv` or by other Redis module APIs returning a RedisModuleString object.
* **s** -- `argv`接受到的 RedisModuleString 对象或者其他 Redis 模块 APIs 返回的 RedisModuleString 对象。
* **l** -- Long long integer.
* **l** -- long long int类型。
* **v** -- Array of RedisModuleString objects.
* **v** -- RedisModuleString 对象的数组。
* **!** -- This modifier just tells the function to replicate the command to slaves and AOF. It is ignored from the point of view of arguments parsing.
* **!** -- 这个修饰符只是为了告诉函数去将命令复制到从节点和 AOF 文件中。从解析参数的角度看，它会被忽略。

The function returns a `RedisModuleCallReply` object on success, on
error NULL is returned.

函数成功执行返回一个 RedisModuleString 对象，错误返回 NULL。

NULL is returned when the command name is invalid, the format specifier uses characters that are not recognized, or when the command is called with the wrong number of arguments. In the above cases the `errno` var is set to `EINVAL`. NULL is also returned when, in an instance with Cluster enabled, the target keys are about non local hash slots. In this case `errno` is set to `EPERM`.

当命令名称无效时，格式说明符使用一个无法识别的字符或者当命令传入的参数个数出错时，返回 NULL 。以上情况`errno`变量被设置为`EINVAL`。当一个实例开启了集群模式，目标键不是当前实例所负责的哈希槽，也会返回 NULL。这种情况`errno`被设置为`EPERM`。

## Working with RedisModuleCallReply objects.

### 和 RedisModuleCallReply 对象配合使用

`RedisModuleCall` returns reply objects that can be accessed using the
`RedisModule_CallReply*` family of functions.

`RedisModuleCall`返回一个可以被`RedisModule_CallReply*`函数簇访问的回复对象。

In order to obtain the type or reply (corresponding to one of the data types
supported by the Redis protocol), the function `RedisModule_CallReplyType()` is used:

为了获取这个类型或回复（对应一个 Redis 协议支持的数据类型），使用`RedisModule_CallReplyType()`函数：

    reply = RedisModule_Call(ctx,"INCR","sc",argv[1],"10");
    if (RedisModule_CallReplyType(reply) == REDISMODULE_REPLY_INTEGER) {
        long long myval = RedisModule_CallReplyInteger(reply);
        /* Do something with myval. */
    }

Valid reply types are:

有效的类型有：

* `REDISMODULE_REPLY_STRING` Bulk string or status replies.
* `REDISMODULE_REPLY_STRING`批量字符串或状态回复。
* `REDISMODULE_REPLY_ERROR` Errors.
* `REDISMODULE_REPLY_ERROR`错误。
* `REDISMODULE_REPLY_INTEGER` Signed 64 bit integers.
* `REDISMODULE_REPLY_INTEGER`有符号的64位整数。
* `REDISMODULE_REPLY_ARRAY` Array of replies.
* `REDISMODULE_REPLY_ARRAY`回复数组。
* `REDISMODULE_REPLY_NULL` NULL reply.
* `REDISMODULE_REPLY_NULL`空回复。

Strings, errors and arrays have an associated length. For strings and errors
the length corresponds to the length of the string. For arrays the length
is the number of elements. To obtain the reply length the following function
is used:

字符串，错误和数组关联着一个长度。对于字符串回复和错误回复的长度，和回复字符串的长度一致。对于数组的长度，是元素的个数。为了获得回复长度，使用以下函数：

    size_t reply_len = RedisModule_CallReplyLength(reply);
In order to obtain the value of an integer reply, the following function is used, as already shown in the example above:

为了获得一个整数回复值，使用以下函数，如下面的例子所示：

    long long reply_integer_val = RedisModule_CallReplyInteger(reply);
Called with a reply object of the wrong type, the above function always
returns `LLONG_MIN`.

调用一个错误类型的回复对象，上述函数总会返回`LLONG_MIN`。

Sub elements of array replies are accessed this way:

数组回复的子元素是这样访问的：

    RedisModuleCallReply *subreply;
    subreply = RedisModule_CallReplyArrayElement(reply,idx);

The above function returns NULL if you try to access out of range elements.

如果你尝试越界访问数组，上述函数返回 NULL。

Strings and errors (which are like strings but with a different type) can
be accessed using in the following way, making sure to never write to
the resulting pointer (that is returned as as `const` pointer so that
misusing must be pretty explicit):

使用以下方式访问字符串回复和错误回复（都类似字符串但是类型不同），确保不写入返回的指针（返回值为`const`指针以便明确以防误用）

    size_t len;
    char *ptr = RedisModule_CallReplyStringPtr(reply,&len);

If the reply type is not a string or an error, NULL is returned.

如果回复类型不是一个字符串或一个错误，返回NULL。

RedisCallReply objects are not the same as module string objects
(RedisModuleString types). However sometimes you may need to pass replies
of type string or integer, to API functions expecting a module string.

RedisCallReply 对象和模块字符串对象不相同（RedisModuleString 类型）。但是有时你可能需要传递字符串或整数类型的回复，给接收一个模块字符串参数的 API 函数。

When this is the case, you may want to evaluate if using the low level
API could be a simpler way to implement your command, or you can use
the following function in order to create a new string object from a
call reply of type string, error or integer:

在这种情况下，你可能想要评估是否使用低级 API 作为最简单的方式实现你的命令，或者你可以使用以下函数，从一个字符串类型，错误类型或整型的调用回复中，去创建一个新的字符串对象。

    RedisModuleString *mystr = RedisModule_CreateStringFromCallReply(myreply);
If the reply is not of the right type, NULL is returned.
The returned string object should be released with `RedisModule_FreeString()`
as usually, or by enabling automatic memory management (see corresponding
section).

如果回复不是正确的类型，返回 NULL 。返回的字符串对象通常应该被`RedisModule_FreeString()`函数释放，或者通过授权的自动化内存管理器（请参阅相应的部分）。

# Releasing call reply objects

## 释放回复对象的调用

Reply objects must be freed using `RedisModule_FreeCallReply`. For arrays,
you need to free only the top level reply, not the nested replies. Currently the module implementation provides a protection in order to avoid crashing if you free a nested reply object for error, however this feature is not guaranteed to be here forever, so should not be considered part of the API.

回复对象必须使用`RedisModule_FreeCallReply`来释放。对于数组，你只需要释放最高级别的回复，不需要释放内嵌的回复。如果你释放内嵌回复对象发生错误，当前模块系统的实现提供了一个保护去避免崩溃，但是无法保证未来仍然提供保护，因此这不应该被视为 API 的一部分。

If you use automatic memory management (explained later in this document)
you don't need to free replies (but you still could if you wish to release
memory ASAP).

如果你使用自动化内存管理（本文后面有介绍），你不需要释放回复（但是如果你希望立即释放内存，也是可以的）。

## Returning values from Redis commands

### Redis 命令的返回值

Like normal Redis commands, new commands implemented via modules must be able to return values to the caller. The API exports a set of functions for this goal, in order to return the usual types of the Redis protocol, and
arrays of such types as elemented. Also errors can be returned with any
error string and code (the error code is the initial uppercase letters in
the error message, like the "BUSY" string in the "BUSY the sever is busy" error
message).

和一般的 Redis 命令一样，通过模块实现的新命令必须将返回值返回给调用者。API 为此提供了一组函数，以返回常规的 Redis 协议类型，以及作为元素类型的数组。也可以用任何错误字符串和错误码返回错误（错误码是错误消息的初始大写字母，如“BUSY the sever is busy”错误信息中的“BUSY”字符串）

All the functions to send a reply to the client are called
`RedisModule_ReplyWith<something>`.

所有的函数将回复发送给客户端调用`RedisModule_ReplyWith<something>`。

To return an error, use:

返回一个错误，使用：

    RedisModule_ReplyWithError(RedisModuleCtx *ctx, const char *err);
There is a predefined error string for key of wrong type errors:

对于错误类型的键，有一个预定义的错误字符串。

    REDISMODULE_ERRORMSG_WRONGTYPE
Example usage:

使用示例如下：

    RedisModule_ReplyWithError(ctx,"ERR invalid arguments");
We already saw how to reply with a long long in the examples above:

在上面的例子中，我们已经看到如何回复一个 long long 类型的回复。

    RedisModule_ReplyWithLongLong(ctx,12345);
To reply with a simple string, that can't contain binary values or newlines,
(so it's suitable to send small words, like "OK") we use:

要回复一个简单的字符串，不能包含二进制值或换行符（所以它适合发送短单词，例如“OK”），可以使用：

    RedisModule_ReplyWithSimpleString(ctx,"OK");
It's possible to reply with "bulk strings" that are binary safe, using
two different functions:

使用下面两种函数，可以回复一个二进制安全的批量字符串：

    int RedisModule_ReplyWithStringBuffer(RedisModuleCtx *ctx, const char *buf, size_t len);

    int RedisModule_ReplyWithString(RedisModuleCtx *ctx, RedisModuleString *str);
The first function gets a C pointer and length. The second a RedisMoudleString
object. Use one or the other depending on the source type you have at hand.

第一个函数接收一个 C 指针和长度。第二个是一个 RedisMoudleString 对象。使用哪一个取决于你目前所持有的类型。

In order to reply with an array, you just need to use a function to emit the
array length, followed by as many calls to the above functions as the number
of elements of the array are:

为了回复一个数组，你只需使用一个函数去指定数组长度，然后调用上述的函数，数组元素的个数如下：

    RedisModule_ReplyWithArray(ctx,2);
    RedisModule_ReplyWithStringBuffer(ctx,"age",3);
    RedisModule_ReplyWithLongLong(ctx,22);

To return nested arrays is easy, your nested array element just uses another
call to `RedisModule_ReplyWithArray()` followed by the calls to emit the
sub array elements.

要返回一个内嵌的数组很简单，你的内嵌数组元素只需要后面跟着使用另一个

`RedisModule_ReplyWithArray()`函数，来指定子数组元素。

## Returning arrays with dynamic length

### 返回动态长度的数组

Sometimes it is not possible to know beforehand the number of items of
an array. As an example, think of a Redis module implementing a FACTOR
command that given a number outputs the prime factors. Instead of
factorializing the number, storing the prime factors into an array, and
later produce the command reply, a better solution is to start an array
reply where the length is not known, and set it later. This is accomplished
with a special argument to `RedisModule_ReplyWithArray()`:

有时无法事先知道一个数组的元素个数。例如，想想一个事先实现 FACTOR 命令的 Redis 模块，输出一个给定数的因子。要将主要因子保存到一个数组中，然后生成命令的回复，而不是将该数进行序列化，一个较好的解决办法是开创一个长度未知的数组回复，之后在进行补充元素。这被实现为`RedisModule_ReplyWithArray()`，并且有一个特别的参数。

    RedisModule_ReplyWithArray(ctx, REDISMODULE_POSTPONED_ARRAY_LEN);
The above call starts an array reply so we can use other `ReplyWith` calls
in order to produce the array items. Finally in order to set the length
se use the following call:

上述调用开创一个数组回复以便我们使用其他`ReplyWith`调用来生成数组项。最终使用下面的调用来设置数组长度。

    RedisModule_ReplySetArrayLength(ctx, number_of_items);
In the case of the FACTOR command, this translates to some code similar
to this:

在 FACTOR 命令的情况下，类似的代码如下：

    RedisModule_ReplyWithArray(ctx, REDISMODULE_POSTPONED_ARRAY_LEN);
    number_of_factors = 0;
    while(still_factors) {
        RedisModule_ReplyWithLongLong(ctx, some_factor);
        number_of_factors++;
    }
    RedisModule_ReplySetArrayLength(ctx, number_of_factors);

Another common use case for this feature is iterating over the arrays of
some collection and only returning the ones passing some kind of filtering.

另一个常见的用例是遍历一些数组集合，并且只返回通过一些过滤的数组。

It is possible to have multiple nested arrays with postponed reply.
Each call to `SetArray()` will set the length of the latest corresponding
call to `ReplyWithArray()`:

有可能有多个延迟回复的嵌套数组。每个`SetArray()`调用都会设置最近对应调用`ReplyWithArray()`的长度。

    RedisModule_ReplyWithArray(ctx, REDISMODULE_POSTPONED_ARRAY_LEN);
    ... generate 100 elements ...
    RedisModule_ReplyWithArray(ctx, REDISMODULE_POSTPONED_ARRAY_LEN);
    ... generate 10 elements ...
    RedisModule_ReplySetArrayLength(ctx, 10);
    RedisModule_ReplySetArrayLength(ctx, 100);

This creates a 100 items array having as last element a 10 items array.

这将创建一个100项的数组，最后10项的数组作为一个元素。

# Arity and type checks

## 数量和类型检查

Often commands need to check that the number of arguments and type of the key is correct. In order to report a wrong arity, there is a specific function
called `RedisModule_WrongArity()`. The usage is trivial:

通常命令需要检查参数个数和键的类型是否正确。为了报告错误的参数个数，有一个叫`RedisModule_WrongArity()`特定的函数。用法非常简单：

    if (argc != 2) return RedisModule_WrongArity(ctx);
Checking for the wrong type involves opening the key and checking the type:

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

Note that you often want to proceed with a command both if the key
is of the expected type, or if it's empty.

请注意，如果一个键是预期的类型或者为空，通常要继续执行命令。

## Low level access to keys

### 键的低级访问

Low level access to keys allow to perform operations on value objects associated to keys directly, with a speed similar to what Redis uses internally to implement the built-in commands.

键的低级访问允许对直接关联键的值对象执行操作，速度类似于 Redis 在内部使用的内置命令。

Once a key is opened, a key pointer is returned that will be used with all the
other low level API calls in order to perform operations on the key or its
associated value.

一旦键被打开，将返回键的指针，该指针将被所有低级的 API 调用使用来对键或键的值对象执行操作。

Because the API is meant to be very fast, it cannot do too many run-time
checks, so the user must be aware of certain rules to follow:

因为 API 执行是非常快的，它不能做太多运行检查，所以用户必须注意遵循以下规则：

* Opening the same key multiple times where at least one instance is opened for writing, is undefined and may lead to crashes.
* 多次打开相同的键，至少一个被打开用于写操作，这是未定义的行为，可能会导致崩溃。
* While a key is open, it should only be accessed via the low level key API. For example opening a key, then calling DEL on the same key using the `RedisModule_Call()` API will result into a crash. However it is safe to open a key, perform some operation with the low level API, closing it, then using other APIs to manage the same key, and later opening it again to do some more work.
* 当一个键被打开，它应该只能通过低级的 API 访问。例如打开一个键，然后使用`RedisModule_Call()` API 对相同的键执行 DEL ，这将导致奔溃。但是用低级的 API 执行一些操作，然后关闭它，接着在使用其他 APIs 管理相同的键，并且随后再次打开它做更多操作，这是安全的打开键操作。

In order to open a key the `RedisModule_OpenKey` function is used. It returns
a key pointer, that we'll use with all the next calls to access and modify
the value:

为了用`RedisModule_OpenKey`函数打开一个键。它返回一个键的指针，我们能用它在下次的调用中访问和修改键的值对象。

    RedisModuleKey *key;
    key = RedisModule_OpenKey(ctx,argv[1],REDISMODULE_READ);

The second argument is the key name, that must be a `RedisModuleString` object. The third argument is the mode: `REDISMODULE_READ` or `REDISMODULE_WRITE`. It is possible to use `|` to bitwise OR the two modes to open the key in both modes. Currently a key opened for writing can also be accessed for reading but this is to be considered an implementation detail. The right mode should be used in sane modules.

第二个参数是键的名称，必须是`RedisModuleString`类型的对象。第三个参数是一个模式：`REDISMODULE_READ`或者`REDISMODULE_WRITE`。可以使用`|`来位或两个模式将打开的键处于两种模式。此时，被打开的用于写的键也能用于读操作，但是这是一个要考虑的实现细节。正确的模式应当被使用在正确的模块中。

You can open non exisitng keys for writing, since the keys will be created
when an attempt to write to the key is performed. However when opening keys just for reading, `RedisModule_OpenKey` will return NULL if the key does not exist.

你可以以写模式打开不存在的键，因为当尝试对该键进行写操作时，将创建该键。但是当以读模式打开该键时，如果该键不存在，`RedisModule_OpenKey`将会返回 NULL 。

Once you are done using a key, you can close it with:

一旦该键使用完成，你可以关闭它：

    RedisModule_CloseKey(key);
Note that if automatic memory management is enabled, you are not forced to
close keys. When the module function returns, Redis will take care to close
all the keys which are still open.

请注意，如果自动化内存管理被开启，你不用强制关闭键。但模块函数返回时， Redis 将把仍被打开的键小心地关闭掉。

## Getting the key type

### 获取键的类型

In order to obtain the value of a key, use the `RedisModule_KeyType()` function:

要获取键的值，使用`RedisModule_KeyType()`函数：

    int keytype = RedisModule_KeyType(key);
It returns one of the following values:

它返回以下值的其中一个：

    REDISMODULE_KEYTYPE_EMPTY
    REDISMODULE_KEYTYPE_STRING
    REDISMODULE_KEYTYPE_LIST
    REDISMODULE_KEYTYPE_HASH
    REDISMODULE_KEYTYPE_SET
    REDISMODULE_KEYTYPE_ZSET

The above are just the usual Redis key types, with the addition of an empty
type, that signals the key pointer is associated with an empty key that
does not yet exists.

上述是一般的 Redis 键类型，该添加了一个空类型，表示键指针关联了一个不存在空键。

## Creating new keys

### 创建新键

To create a new key, open it for writing and then write to it using one
of the key writing functions. Example:

要创建一个新键，以写模式打开并且使用键的其中一个写入函数写入它。例如：

    RedisModuleKey *key;
    key = RedisModule_OpenKey(ctx,argv[1],REDISMODULE_READ);
    if (RedisModule_KeyType(key) == REDISMODULE_KEYTYPE_EMPTY) {
        RedisModule_StringSet(key,argv[2]);
    }

## Deleting keys

### 删除键

Just use:

只需要用：

    RedisModule_DeleteKey(key);
The function returns `REDISMODULE_ERR` if the key is not open for writing.
Note that after a key gets deleted, it is setup in order to be targeted
by new key commands. For example `RedisModule_KeyType()` will return it is
an empty key, and writing to it will create a new key, possibly of another
type (depending on the API used).

如果键没以写模式打开，函数返回`REDISMODULE_ERR`。注意，当一个键被删除之后，该键就被设置为一个新的键命令的目标。例如，`RedisModule_KeyType`将返回它是空键类型，写入该键将创建一个新键，有可能是另一个类型（取决于使用的 API）。

## Managing key expires (TTLs)

### 管理键的到期时间（TTLs）

To control key expires two functions are provided, that are able to set,
modify, get, and unset the time to live associated with a key.

提供了两个函数来控制键的到期时间，能设置、修改、获取和取消键的生存时间。

One function is used in order to query the current expire of an open key:

一个函数用来查询当前打开键的到期时间。

    mstime_t RedisModule_GetExpire(RedisModuleKey *key);
The function returns the time to live of the key in milliseconds, or
`REDISMODULE_NO_EXPIRE` as a special value to signal the key has no associated expire or does not exist at all (you can differentiate the two cases checking if the key type is `REDISMODULE_KEYTYPE_EMPTY`).

函数返回键的毫秒单位的生存时间，或返回特殊值`REDISMODULE_NO_EXPIRE`，表示键没有关联到期时间或不存在过期（你可以区分两种情况检查是否键的类型是`REDISMODULE_KEYTYPE_EMPTY`）。

In order to change the expire of a key the following function is used instead:

要改变键的到期时间，使用下面的函数：

    int RedisModule_SetExpire(RedisModuleKey *key, mstime_t expire);
When called on a non existing key, `REDISMODULE_ERR` is returned, because
the function can only associate expires to existing open keys (non existing
open keys are only useful in order to create new values with data type
specific write operations).

当接收到一个不存在的键，返回`REDISMODULE_ERR`，因为函数只能将到期时间关联到一个存在且打开的键上（不存在但打开的键仅用于创建新的，具有特定写操作数据类型的值对象）。

Again the `expire` time is specified in milliseconds. If the key has currently
no expire, a new expire is set. If the key already have an expire, it is
replaced with the new value.

再次以毫秒单位指定`expire`时间。如果键当前没有到期时间，将设置一个新的到期时间。如果键已经有一个到期时间，则被一个新值替代。

If the key has an expire, and the special value `REDISMODULE_NO_EXPIRE` is
used as a new expire, the expire is removed, similarly to the Redis
`PERSIST` command. In case the key was already persistent, no operation is
performed.

如果键已经有一个到期时间，并且使用特殊值`REDISMODULE_NO_EXPIRE`作为新的到期时间，那么到期时间被删除，类似 Redis 的`PERSIST`命令。如果键本来就没有过期时间，则什么也不做。

## Obtaining the length of values

### 获取值的长度

There is a single function in order to retrieve the length of the value
associated to an open key. The returned length is value-specific, and is
the string length for strings, and the number of elements for the aggregated
data types (how many elements there is in a list, set, sorted set, hash).

有一个函数，被用来检索打开的键锁关联值对象的长度。返回的是一个指定的值，如果是字符串，则是字符串的长度，如果是聚合数据类型，则是元素的个数（列表、集合、有序集合、哈希表中元素的个数）。

    size_t len = RedisModule_ValueLength(key);
If the key does not exist, 0 is returned by the function:

如果键不存在，函数返回 0 。

## String type API

### 字符串类型的 API

Setting a new string value, like the Redis `SET` command does, is performed
using:

设置一个新的字符串值，就像 Redis 的`SET`命令，使用：

    int RedisModule_StringSet(RedisModuleKey *key, RedisModuleString *str);
The function works exactly like the Redis `SET` command itself, that is, if
there is a prior value (of any type) it will be deleted.

该函数完全和 Redis 的`SET`命令本身一样，也就是说，如果有先前存在的值（任何类型），它将被删除。

Accessing existing string values is performed using DMA (direct memory
access) for speed. The API will return a pointer and a length, so that's
possible to access and, if needed, modify the string directly.

使用 DMA（direct memory access）快速访问一个存在的字符串值。API 将返回一个指针和一个长度，因此可以这样访问，如果需要，直接修改字符串。

    size_t len, j;
    char *myptr = RedisModule_StringDMA(key,&len,REDISMODULE_WRITE);
    for (j = 0; j < len; j++) myptr[j] = 'A';

In the above example we write directly on the string. Note that if you want
to write, you must be sure to ask for `WRITE` mode.

上面的例子，我们直接写入字符串。请注意，如果你想写，你必须确定是否打开`WRITE`模式。

DMA pointers are only valid if no other operations are performed with the key
before using the pointer, after the DMA call.

如果在DMA 调用之后，DMA 指针仅仅在使用指针前不使用其他操作才有效。

Sometimes when we want to manipulate strings directly, we need to change
their size as well. For this scope, the `RedisModule_StringTruncate` function
is used. Example:

有时，当我们想直接操作字符串，我们还要改变他们的大小。对于这种情况，可以使用`RedisModule_StringTruncate`函数，例如：

    RedisModule_StringTruncate(mykey,1024);
The function truncates, or enlarges the string as needed, padding it with
zero bytes if the previos length is smaller than the new length we request.
If the string does not exist since `key` is associated to an open empty key,
a string value is created and associated to the key.

函数会按照需要截断或扩大字符串，如果之前的长度小于我们要求新的长度，会用0字节填充。如果字符串不存在，而`key`关联了一个打开的空键，那么会创建一个字符串值并且关联到该键。

Note that every time `StringTruncate()` is called, we need to re-obtain
the DMA pointer again, since the old may be invalid.

请注意，每次`StringTruncate()`被调用时，我们需要重新获取 DMA 指针，因为旧的可能已经无效。

## List type API

### 列表类型 API

It's possible to push and pop values from list values:

可以从列表中 push 和 pop 一个值：

    int RedisModule_ListPush(RedisModuleKey *key, int where, RedisModuleString *ele);
    RedisModuleString *RedisModule_ListPop(RedisModuleKey *key, int where);

In both the APIs the `where` argument specifies if to push or pop from tail
or head, using the following macros:

如果从尾部或头部 push 或 pop，可以使用以下宏在`where`参数中指定：

    REDISMODULE_LIST_HEAD
    REDISMODULE_LIST_TAIL

Elements returned by `RedisModule_ListPop()` are like strings craeted with
`RedisModule_CreateString()`, they must be released with
`RedisModule_FreeString()` or by enabling automatic memory management.

被`RedisModule_ListPop()`返回的元素像被`RedisModule_CreateString()`创建的字符串一样，他们必须被`RedisModule_FreeString()`函数释放，或则开启了自动化内存管理。

## Set type API

### 集合类型 API

Work in progress.

文档正在编写过程中。

## Sorted set type API

### 有序集合 API

Documentation missing, please refer to the top comments inside `module.c`
for the following functions:

文档缺失，关于以下函数请参阅`module.c`的顶部注释：

* `RedisModule_ZsetAdd`
* `RedisModule_ZsetIncrby`
* `RedisModule_ZsetScore`
* `RedisModule_ZsetRem`

And for the sorted set iterator:

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

## Hash type API

### 哈希类型 API

Documentation missing, please refer to the top comments inside `module.c`
for the following functions:

文档缺失，关于以下函数请参阅`module.c`的顶部注释：

* `RedisModule_HashSet`
* `RedisModule_HashGet`

## Iterating aggregated values

### 迭代聚合值

Work in progress.

文档正在编写过程中。

# Replicating commands

## 复制命令

If you want to use module commands exactly like normal Redis commands, in the context of replicated Redis instances, or using the AOF file for persistence,
it is important for module commands to handle their replication in a onsistent
way.

如果你想要像正常 Redis 命令那样使用模块命令，在复制的 Redis 实例的上下文中或者使用 AOF 持久化机制，这对于模块命令处理他们复制的一致性很重要。

When using the higher level APIs to invoke commands, replication happens
automatically if you use the "!" modifier in the format string of
`RedisModule_Call()` as in the following example:

当使用更高级别的 APIs 来调用命令时，如果你使用字符串格式中的“!”修饰符，则自动会进行复制操作，`RedisModule_Call()`使用示例如下：

    reply = RedisModule_Call(ctx,"INCR","!sc",argv[1],"10");
As you can see the format specifier is `"!sc"`. The bang is not parsed as a
format specifier, but it internally flags the command as "must replicate".

正如你能看到的格式修饰符是`"!sc"`。这个感叹号不会作为一个格式修饰符被解析，而是解释为一个内部命令“必须复制”。

If you use the above programming style, there are no problems. However sometimes things are more complex than that, and you use the low level API. In this case, if there are no side effects in the command execution, and it consistently always performs the same work, what is possible to do is to
replicate the command verbatim as the user executed it. To do that, you just
need to call the following function:

如果你使用上述的编程风格，这是没有问题的。但是有时事情会比这更加复杂，比如你说用着低级的 API 。在这种情况中，如果命令的执行没有副作用，并且总是执行着相同的动作，那么可以做的是在用户执行命令时，一字不差的复制命令。要做到这一点，你需要调用以下函数：

    RedisModule_ReplicateVerbatim(ctx);
When you use the above API, you should not use any other replication function since they are not guaranteed to mix well.

当你使用上述 API 时，你不应该使用任何其他复制函数，因为他们无法保证能够合成的很好。

However this is not the only option. It's also possible to exactly tell
Redis what commands to replicate as the effect of the command execution, using an API similar to `RedisModule_Call()` but that instead of calling the command sends it to the AOF / slaves stream. Example:

但是这不是唯一的选项。还可以正确的告诉 Redis 将要复制的命令作为命令执行的效果。使用一个类似于`RedisModule_Call()`的 API 但不是调用该命令将其发送给 AOF /从节点流。例如：

    RedisModule_Replicate(ctx,"INCRBY","cl","foo",my_increment);
It's possible to call `RedisModule_Replicate` multiple times, and each
will emit a command. All the sequence emitted is wrapped between a
`MULTI/EXEC` transaction, so that the AOF and replication effects are the
same as executing a single command.

可以多次调用`RedisModule_Replicate`，每次都会发出一个命令。所有被发出的序列被封装到一个`MULTI/EXEC`事务之中，以便 AOF 和复制的效果和执行单个命令是相同的。

Note that `Call()` replication and `Replicate()` replication have a rule,
in case you want to mix both forms of replication (not necessarily a good
idea if there are simpler approaches). Commands replicated with `Call()`
are always the first emitted in the final `MULTI/EXEC` block, while all
the commands emitted with `Replicate()` will follow.

请注意，`Call()`复制和`Replicate()`复制有一个规则，以防你想要混合两种复制的格式（如果有简单的处理方案，这种必定不是好办法）。调用`Call()`的复制的命令总是在最终的`MULTI/EXEC`块中第一个被发出，而所有调用`Replicate()`复制的命令则跟随在其后。

# Automatic memory management

## 自动化内存管理

Normally when writing programs in the C language, programmers need to manage memory manually. This is why the Redis modules API has functions to release strings, close open keys, free replies, and so forth.

通常在用 C 语言编写程序时，程序员需要手动管理内存。这是为什么 Redis 模块 API 有函数要去释放字符串，关闭打开的键，释放回复等等。

However given that commands are executed in a contained environment and
with a set of strict APIs, Redis is able to provide automatic memory management to modules, at the cost of some performance (most of the time, a very low cost).

但是，这些命令在一个独立的环境中和一套严格的 APIs 中执行，Redis 能够为模块系统提供自动化内存管理，而这些都是以性能为代价的（大多数时候是非常低的成本）。

When automatic memory management is enabled:

当自动化内存管理开启时：

1. You don't need to close open keys.

   你不需要关闭打开的键。

2. You don't need to free replies.

   你不需要释放回复。

3. You don't need to free RedisModuleString objects.

   你不需要释放 RedisModuleString 对象。

However you can still do it, if you want. For example, automatic memory
management may be active, but inside a loop allocating a lot of strings,
you may still want to free strings no longer used.

然而，如果你想要，你仍要可以这么做。例如，自动化内存管理可能是动态的，在一个分配许多字符串的循环中，你可能仍想要释放不在使用的字符串。

In order to enable automatic memory management, just call the following
function at the start of the command implementation:

要开启自动化内存管理，只要在命令实现开始时，调用下面的函数：

    RedisModule_AutoMemory(ctx);
Automatic memory management is usually the way to go, however experienced C programmers may not use it in order to gain some speed and memory usage benefit.

自动化内存管理通常是一个方法，有经验的 Ｃ程序员可能不使用它，而获取一些速度和内存使用效益。

# Allocating memory into modules

## 分配内存到模块中

Normal C programs use `malloc()` and `free()` in order to allocate and
release memory dynamically. While in Redis modules the use of malloc is
not technically forbidden, it is a lot better to use the Redis Modules
specific functions, that are exact replacements for `malloc`, `free`,
`realloc` and `strdup`. These functions are:

普通 C 程序员使用`malloc()`和`free()`来分配和释放动态内存。虽然在 Redis 模块中这种分配内存的方式在技术上不被禁止，但是更好的方式是使用 Redis 模块指定的函数，这能确切的替代`malloc`、`free`、`realloc`、`strdup`。这些函数是：

    void *RedisModule_Alloc(size_t bytes);
    void* RedisModule_Realloc(void *ptr, size_t bytes);
    void RedisModule_Free(void *ptr);
    void RedisModule_Calloc(size_t nmemb, size_t size);
    char *RedisModule_Strdup(const char *str);

They work exactly like their `libc` equivalent calls, however they use
the same allocator Redis uses, and the memory allocated using these
functions is reported by the `INFO` command in the memory section, is
accounted when enforcing the `maxmemory` policy, and in general is
a first citizen of the Redis executable. On the contrar, the method
allocated inside modules with libc `malloc()` is transparent to Redis.

这些函数和`libc`库中的调用工作是等价的，但是他们和 Redis 使用相同的内存分配器，并且使用这些函数分配的内存，能够通过`INFO`命令的内存信息部分报告出来，当实施了`maxmemory`策略时，这些函数会被考虑到，并且通常是 Redis 可执行的第一项。相反，在模块中使用 libc 的`malloc()`分配方法则对 Redis 是透明的。

Another reason to use the modules functions in order to allocate memory
is that, when creating native data types inside modules, the RDB loading
functions can return deserialized strings (from the RDB file) directly
as `RedisModule_Alloc()` allocations, so they can be used directly to
populate data structures after loading, instead of having to copy them
to the data structure.

另一个使用模块函数分配内存的原因是，当在模块中创建了原生数据类型，RDB 加载函数能直接返回反序列化的字符串（从 RDB 文件中）作为`RedisModule_Alloc()`的分配项，因此他们在加载之后能直接被使用来填充数据结构，而不是将其复制到数据结构中。

## Pool allocator

### 池分配器

Sometimes in commands implementations, it is required to perform many
small allocations that will be not retained at the end of the command
execution, but are just functional to execute the command itself.

有时在命令实现中，需要执行许多小的分配项，这些分配项在命令执行结束时不被保留，但是只能执行命令本身。

This work can be more easily accomplished using the Redis pool allocator:

使用 Redis 的池分配器可以轻松的完成此工作：

    void *RedisModule_PoolAlloc(RedisModuleCtx *ctx, size_t bytes);
It works similarly to `malloc()`, and returns memory aligned to the
next power of two of greater or equal to `bytes` (for a maximum alignment
of 8 bytes). However it allocates memory in blocks, so it the overhead
of the allocations is small, and more important, the memory allocated
is automatically released when the command returns.

他和`malloc()`工作类似，返回大于或等于`bytes`（最大对齐8字节）的下一个二的幂次方大小的对齐的内存。但是它会分配一个内存块，所以分配的开销很小，最重要的是，分配的内存当命令返回时自动被释放。

So in general short living allocations are a good candidates for the pool
allocator.

所以一般来说，短期分配项使用池分配器是一个好的选择。

# Writing commands compatible with Redis Cluster

## 编写与 Redis Cluster 兼容的命令

Documentation missing, please check the following functions inside `module.c`:

文档缺失，请在`module.c`中查看以下函数：

    RedisModule_IsKeysPositionRequest(ctx);
    RedisModule_KeyAtPos(ctx,pos);
