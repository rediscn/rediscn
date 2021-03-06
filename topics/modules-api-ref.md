---
layout: topics
title: modules-api-ref
permalink: topics/modules-api-ref.html
disqusIdentifier: topics/modules-api-ref
disqusUrl: http://redis.cn/topics/modules-api-ref.html
discuzTid: 2017
---

# Modules API reference

## `RedisModule_Alloc`

    void *RedisModule_Alloc(size_t bytes);

Use like malloc(). Memory allocated with this function is reported in
Redis INFO memory, used for keys eviction according to maxmemory settings
and in general is taken into account as memory allocated by Redis.
You should avoid using malloc().
用法同malloc()。Redis 会根据最大内存设置，做keys的淘汰时会用到该函数，命令INFO memory 会统计该函数分配的内存。
避免使用malloc()函数。
## `RedisModule_Calloc`

    void *RedisModule_Calloc(size_t nmemb, size_t size);

Use like calloc(). Memory allocated with this function is reported in
Redis INFO memory, used for keys eviction according to maxmemory settings
and in general is taken into account as memory allocated by Redis.
You should avoid using calloc() directly.
用法同calloc()。Redis 会根据最大内存设置，做keys的淘汰时会用到该函数，命令INFO memory 会统计该函数分配的内存。
避免使用calloc()函数。

## `RedisModule_Realloc`

    void* RedisModule_Realloc(void *ptr, size_t bytes);

Use like realloc() for memory obtained with `RedisModule_Alloc()`.
用法同realloc(),针对使用`RedisModule_Alloc()`分配的内存
## `RedisModule_Free`

    void RedisModule_Free(void *ptr);

Use like free() for memory obtained by `RedisModule_Alloc()` and
`RedisModule_Realloc()`. However you should never try to free with
`RedisModule_Free()` memory allocated with malloc() inside your module.
用法同 free()，针对使用`RedisModule_Alloc`和`RedisModule_Realloc()`分配的内存。切勿调用`RedisModule_Free()`释放malloc()分配的内存。
## `RedisModule_Strdup`

    char *RedisModule_Strdup(const char *str);

Like strdup() but returns memory allocated with `RedisModule_Alloc()`.
用法同strdup()，不过返回使用`RedisModule_Alloc()`分配的内存
## `RedisModule_PoolAlloc`

    void *RedisModule_PoolAlloc(RedisModuleCtx *ctx, size_t bytes);

Return heap allocated memory that will be freed automatically when the
module callback function returns. Mostly suitable for small allocations
that are short living and must be released when the callback returns
anyway. The returned memory is aligned to the architecture word size
if at least word size bytes are requested, otherwise it is just
aligned to the next power of two, so for example a 3 bytes request is
4 bytes aligned while a 2 bytes request is 2 bytes aligned.
返回分配的堆内存，该段内存会在回调函数返回时被自动释放。当回调函数返回时必须释放的小块内存适合使用该函数申请。
申请的内存会按照计算机字对齐，如果有指定字的字节数，则按指定的对齐，默认按照大于申请内存最小的2的次幂对齐，比如3字节会按照4个字节对齐，
2字节则按照2字节对齐。

There is no realloc style function since when this is needed to use the
pool allocator is not a good idea.
没有对应的realloc 函数，不建议使用realloc操作内存池分配器分配的诶村。
The function returns NULL if `bytes` is 0.
`bytes` 为0时返回NULL。

## `RedisModule_GetApi`

    int RedisModule_GetApi(const char *funcname, void **targetPtrPtr);

Lookup the requested module API and store the function pointer into the
target pointer. The function returns `REDISMODULE_ERR` if there is no such
named API, otherwise `REDISMODULE_OK`.
查询调用的API模块，并将函数指着保存在目标指针。当没有改API时返回`REDISMODULE_ERR`,否则返回`REDISMODULE_OK`。

This function is not meant to be used by modules developer, it is only
used implicitly by including redismodule.h.
该函数不是为模块开发者使用的仅是在包含redismodule.h时隐式可调用。

## `RedisModule_IsKeysPositionRequest`

    int RedisModule_IsKeysPositionRequest(RedisModuleCtx *ctx);

Return non-zero if a module command, that was declared with the
flag "getkeys-api", is called in a special way to get the keys positions
and not to get executed. Otherwise zero is returned.
当一个标志为“getkeys-api”的模块命令被调用来获得keys的位置还没有被执行时，返回非0值，否则返回0.

## `RedisModule_KeyAtPos`

    void RedisModule_KeyAtPos(RedisModuleCtx *ctx, int pos);

When a module command is called in order to obtain the position of
keys, since it was flagged as "getkeys-api" during the registration,
the command implementation checks for this special call using the
`RedisModule_IsKeysPositionRequest()` API and uses this function in
order to report keys, like in the following example:
调用模块命令获取keys的位置，如果模块命令在注册阶段被标志为“getkeys-api”,那么它会调用`RedisModule_IsKeysPositionRequest()`API并使用
该函数来返回keys位置信息，见如下例子
    if (RedisModule_IsKeysPositionRequest(ctx)) {
        RedisModule_KeyAtPos(ctx,1);
        RedisModule_KeyAtPos(ctx,2);
    }

 Note: in the example below the get keys API would not be needed since
 keys are at fixed positions. This interface is only used for commands
 with a more complex structure.
注意：如果keys的位置固定，可忽略例子。因为该结构仅针对需要更复杂结构的命令。
## `RedisModule_CreateCommand`

    int RedisModule_CreateCommand(RedisModuleCtx *ctx, const char *name, RedisModuleCmdFunc cmdfunc, const char *strflags, int firstkey, int lastkey, int keystep);

Register a new command in the Redis server, that will be handled by
calling the function pointer 'func' using the RedisModule calling
convention. The function returns `REDISMODULE_ERR` if the specified command
name is already busy or a set of invalid flags were passed, otherwise
`REDISMODULE_OK` is returned and the new command is registered.
使用该函数对新增redis命令进行注册。如果需要注册的命令正在创建或者部分参数设置错误则返回`REDISMODULE_ERR`,
否则新增命令注册成功，并返回`REDISMODULE_OK`

This function must be called during the initialization of the module
inside the `RedisModule_OnLoad()` function. Calling this function outside
of the initialization function is not defined.
该函数在调用`RedisModule_OnLoad()` 进行模块初始化的过程中被调用，其他阶段调用无效。

The command function type is the following:
命令函数的类型如下：
     int MyCommand_RedisCommand(RedisModuleCtx *ctx, RedisModuleString **argv, int argc);

And is supposed to always return `REDISMODULE_OK`.
正常返回`REDISMODULE_OK`

The set of flags 'strflags' specify the behavior of the command, and should
be passed as a C string compoesd of space separated words, like for
example "write deny-oom". The set of flags are:
信号量`strflags` 限定了命令的操作，用空格隔开的C 字符串组成，例如"write deny-oom",信号量如下：

* **"write"**:     The command may modify the data set (it may also read
                   from it).
* **"write"**:     该命令会修改数据集
				   
* **"readonly"**:  The command returns data from keys but never writes.
* **"readonly"**:  该命令仅返回值，不做修改
* **"admin"**:     The command is an administrative command (may change
                   replication or perform similar tasks).
* **"admin"**:     管理命令(可以调整复制或类似操作)
* **"deny-oom"**:  The command may use additional memory and should be
                   denied during out of memory conditions.
* **"deny-oom"**:  该命令使用额外内存，在内存超用的场景下应当被拒绝

* **"deny-script"**:   Don't allow this command in Lua scripts.
* **"deny-script"**:   禁止使用Lua 脚本

* **"allow-loading"**: Allow this command while the server is loading data.
                       Only commands not interacting with the data set
                       should be allowed to run in this mode. If not sure
                       don't use this flag.
* **"allow-loading"**: 允许Redis 服务器加载数据时执行该命令，只有不和数据集交互的命令在该模式下被允许执行。否则不设置该信号量。
					   
* **"pubsub"**:    The command publishes things on Pub/Sub channels.
* **"pubsub"**:    该命令回想发布/订阅频道里发布内容.

* **"random"**:    The command may have different outputs even starting
                   from the same input arguments and key values.
* **"random"**:    该命令接收相同的输入可能会有不同的输出
				   
* **"allow-stale"**: The command is allowed to run on slaves that don't
                     serve stale data. Don't use if you don't know what
                     this means.
* **"allow-stale"**: 该命令允许在slave上执行，即使slave提供的数据不一致。
					 
* **"no-monitor"**: Don't propoagate the command on monitor. Use this if
                    the command has sensible data among the arguments.
* **"no-monitor"**: 不监控该命令。如果命令参数有敏感数据可以使用该设置
					
* **"fast"**:      The command time complexity is not greater
                   than O(log(N)) where N is the size of the collection or
                   anything else representing the normal scalability
                   issue with the command.
* **"fast"**:      该命令的时间复杂度应当低于O(log(N)),其中N是集合的大小等

* **"getkeys-api"**: The command implements the interface to return
                     the arguments that are keys. Used when start/stop/step
                     is not enough because of the command syntax.

* **"getkeys-api"**: 该命令实现了返回keys的接口。
					 
* **"no-cluster"**: The command should not register in Redis Cluster
                    since is not designed to work with it because, for
                    example, is unable to report the position of the
                    keys, programmatically creates key names, or any
                    other reason.
* **"no-cluster"**: 该命令不在Redis群集中注册，因为该命令不是为群集设计的。
					
## `RedisModule_SetModuleAttribs`

    void RedisModule_SetModuleAttribs(RedisModuleCtx *ctx, const char *name, int ver, int apiver);

Called by `RM_Init()` to setup the `ctx->module` structure.
`RM_Init()`使用该函数安装`ctx->module`结构

This is an internal function, Redis modules developers don't need
to use it.
该函数是测试函数，Redis模块开发者不需要用该函数

## `RedisModule_Milliseconds`

    long long RedisModule_Milliseconds(void);

Return the current UNIX time in milliseconds.
以毫秒数格式返回当前UNIX时间
## `RedisModule_AutoMemory`

    void RedisModule_AutoMemory(RedisModuleCtx *ctx);

Enable automatic memory management. See API.md for more information.
打开自动内存管理。详见API.md

The function must be called as the first function of a command implementation
that wants to use automatic memory.
新增命令如果需要自动内存管理，必须先调用该函数。
## `RedisModule_CreateString`

    RedisModuleString *RedisModule_CreateString(RedisModuleCtx *ctx, const char *ptr, size_t len);

Create a new module string object. The returned string must be freed
with `RedisModule_FreeString()`, unless automatic memory is enabled.
创建一个模块字符串对象。除非打开了自动内存管理，否则返回的字符串必须调用`RedisModule_FreeString()`释放
The string is created by copying the `len` bytes starting
at `ptr`. No reference is retained to the passed buffer.
返回的字符串是从`ptr`开始的`len`个字节。
## `RedisModule_CreateStringPrintf`

    RedisModuleString *RedisModule_CreateStringPrintf(RedisModuleCtx *ctx, const char *fmt, ...);

Create a new module string object from a printf format and arguments.
The returned string must be freed with `RedisModule_FreeString()`, unless
automatic memory is enabled.
创建一个格式化后的模块字符串对象。除非打开了自动内存管理，否则返回的字符串必须调用`RedisModule_FreeString()`释放。

The string is created using the sds formatter function sdscatvprintf().
该字符串调用sds格式化函数sdscatvprintf()创建。
## `RedisModule_CreateStringFromLongLong`

    RedisModuleString *RedisModule_CreateStringFromLongLong(RedisModuleCtx *ctx, long long ll);

Like `RedisModule_CreatString()`, but creates a string starting from a long long
integer instead of taking a buffer and its length.
功能同`RedisModule_CreatString()`，不同的地方是该函数接收一个长整型数值，不像`RedisModule_CreatString()`需要缓存和缓存长度。
The returned string must be released with `RedisModule_FreeString()` or by
enabling automatic memory management.
除非打开了自动内存管理，否则返回的字符串必须调用`RedisModule_FreeString()`释放。

## `RedisModule_CreateStringFromString`

    RedisModuleString *RedisModule_CreateStringFromString(RedisModuleCtx *ctx, const RedisModuleString *str);

Like `RedisModule_CreatString()`, but creates a string starting from another
RedisModuleString.
功能同`RedisModule_CreatString()`,不过该函数通过其他RedisModuleString创建字符串
The returned string must be released with `RedisModule_FreeString()` or by
enabling automatic memory management.
除非打开了自动内存管理，否则返回的字符串必须调用`RedisModule_FreeString()`释放。
## `RedisModule_FreeString`

    void RedisModule_FreeString(RedisModuleCtx *ctx, RedisModuleString *str);

Free a module string object obtained with one of the Redis modules API calls
that return new string objects.
释放通过Redis模块API创建的字符串对象。

It is possible to call this function even when automatic memory management
is enabled. In that case the string will be released ASAP and removed
from the pool of string to release at the end.
即使打开了自动内存管理，也可以调用该函数。只不过调用该函数后字符串会被马上释放，不用等到自动管理函数释放。
## `RedisModule_RetainString`

    void RedisModule_RetainString(RedisModuleCtx *ctx, RedisModuleString *str);

Every call to this function, will make the string 'str' requiring
an additional call to `RedisModule_FreeString()` in order to really
free the string. Note that the automatic freeing of the string obtained
enabling modules automatic memory management counts for one
`RedisModule_FreeString()` call (it is just executed automatically).
调用过该函数后，需要额外调用一次`RedisModule_FreeString()` 真正释放字符串。注意，开启自动内存释放后，
每调用一次`RedisModule_FreeString()`，会增加一次计数。
Normally you want to call this function when, at the same time
the following conditions are true:
正常情况下，如下情况下，你会调用该函数

1) You have automatic memory management enabled.
1) 打开了自动内存管理
2) You want to create string objects.
2) 创建新的字符串对象
3) Those string objects you create need to live *after* the callback
   function(for example a command implementation) creating them returns.
3) 有些字符串对象，需要保存到回调函数执行完之后。
Usually you want this in order to store the created string object
into your own data structure, for example when implementing a new data
type.
通常情况，调用该函数是为了在自己创建的结构体里保存字符串对象，例如实现一种新的数据类型。

Note that when memory management is turned off, you don't need
any call to RetainString() since creating a string will always result
into a string that lives after the callback function returns, if
no FreeString() call is performed.
注意，如果内存管理未启用，不需要调用RetainString()，已创建的字符串在调用FreeString()前会一存在。
## `RedisModule_StringPtrLen`

    const char *RedisModule_StringPtrLen(const RedisModuleString *str, size_t *len);

Given a string module object, this function returns the string pointer
and length of the string. The returned pointer and length should only
be used for read only accesses and never modified.
返回给定字符串对象的指针和长度。注意，返回的字符串仅可读，不可修改。
## `RedisModule_StringToLongLong`

    int RedisModule_StringToLongLong(const RedisModuleString *str, long long *ll);

Convert the string into a long long integer, storing it at `*ll`.
Returns `REDISMODULE_OK` on success. If the string can't be parsed
as a valid, strict long long (no spaces before/after), `REDISMODULE_ERR`
is returned.
将字符串转换为长整型，存储在`*ll`中，如果成功返回`REDISMODULE_OK`，失败则返回`REDISMODULE_ERR`。
## `RedisModule_StringToDouble`

    int RedisModule_StringToDouble(const RedisModuleString *str, double *d);

Convert the string into a double, storing it at `*d`.
Returns `REDISMODULE_OK` on success or `REDISMODULE_ERR` if the string is
not a valid string representation of a double value.
将字符串转换为双精度类型，存储在`*d`中，如果成功返回`REDISMODULE_OK`，失败则返回`REDISMODULE_ERR`。
## `RedisModule_StringCompare`

    int RedisModule_StringCompare(RedisModuleString *a, RedisModuleString *b);

Compare two string objects, returning -1, 0 or 1 respectively if
a < b, a == b, a > b. Strings are compared byte by byte as two
binary blobs without any encoding care / collation attempt.
比较两个字符串对象的大小，针对情况a < b, a == b, a > b 分别反馈-1,0,1。字符串按字节比较，不考虑编码和校验。
## `RedisModule_StringAppendBuffer`

    int RedisModule_StringAppendBuffer(RedisModuleCtx *ctx, RedisModuleString *str, const char *buf, size_t len);

Append the specified buffere to the string 'str'. The string must be a
string created by the user that is referenced only a single time, otherwise
`REDISMODULE_ERR` is returend and the operation is not performed.
增加字符串`str`的内存，该字符串必须是用户创建和使用的，否则不做操作并返回`REDISMODULE_ERROR`。

## `RedisModule_WrongArity`

    int RedisModule_WrongArity(RedisModuleCtx *ctx);

Send an error about the number of arguments given to the command,
citing the command name in the error message.
发送参数个数不匹配的错误信息，错误信息包含该命令名称。
Example:
例子

    if (argc != 3) return RedisModule_WrongArity(ctx);

## `RedisModule_ReplyWithLongLong`

    int RedisModule_ReplyWithLongLong(RedisModuleCtx *ctx, long long ll);

Send an integer reply to the client, with the specified long long value.
The function always returns `REDISMODULE_OK`.
向客户端返回长整型值。
## `RedisModule_ReplyWithError`

    int RedisModule_ReplyWithError(RedisModuleCtx *ctx, const char *err);

Reply with the error 'err'.
返回错误`err`
Note that 'err' must contain all the error, including
the initial error code. The function only provides the initial "-", so
the usage is, for example:
注意，`err`必须包含所有报错，包括开头的错误代码，因此使用方法如下例
    RedisModule_ReplyWithError(ctx,"ERR Wrong Type");

and not just:
而不是，这样：

    RedisModule_ReplyWithError(ctx,"Wrong Type");

The function always returns `REDISMODULE_OK`.
该函数返回`REDISMODULE_OK`
## `RedisModule_ReplyWithSimpleString`

    int RedisModule_ReplyWithSimpleString(RedisModuleCtx *ctx, const char *msg);

Reply with a simple string (+... \r\n in RESP protocol). This replies
are suitable only when sending a small non-binary string with small
overhead, like "OK" or similar replies.
回复简单字符串(+... \r\n)。对于仅返回非二进制简单字符串如"OK"比较合适。
The function always returns `REDISMODULE_OK`.
该函数返回`REDISMODULE_OK`
## `RedisModule_ReplyWithArray`

    int RedisModule_ReplyWithArray(RedisModuleCtx *ctx, long len);

Reply with an array type of 'len' elements. However 'len' other calls
to `ReplyWith*` style functions must follow in order to emit the elements
of the array.
回复包含`len`个元素的数组。但是和`len`有关的其他`ReplyWith*`类型函数会被调用，用于取出和使用数组中的元素
When producing arrays with a number of element that is not known beforehand
the function can be called with the special count
`REDISMODULE_POSTPONED_ARRAY_LEN`, and the actual number of elements can be
later set with `RedisModule_ReplySetArrayLength()` (which will set the
latest "open" count if there are multiple ones).
当生成包含多个元素的数组是，可能预先不知道元素的个数，可以先使用`REDISMODULE_POSTPONED_ARRAY_LEN`进行设置。
实际的个数值可以通过后续调用`RedisModule_ReplySetArrayLength()`进行设置。

The function always returns `REDISMODULE_OK`.
函数返回`REDISMODULE_OK`
## `RedisModule_ReplySetArrayLength`

    void RedisModule_ReplySetArrayLength(RedisModuleCtx *ctx, long len);

When `RedisModule_ReplyWithArray()` is used with the argument
`REDISMODULE_POSTPONED_ARRAY_LEN`, because we don't know beforehand the number
of items we are going to output as elements of the array, this function
will take care to set the array length.
当`RedisModule_ReplyWithArray()`使用了参数`REDISMODULE_POSTPONED_ARRAY_LEN`，设置数组长度值时需要注意。
因为很有可能有多个数组都没有设置元素个数。该函数只设置最新生成的数组的长度。

Since it is possible to have multiple array replies pending with unknown
length, this function guarantees to always set the latest array length
that was created in a postponed way.

For example in order to output an array like [1,[10,20,30]] we
could write:
例如，要输出数组[1,[10,20,30]],我们可以这样写

     RedisModule_ReplyWithArray(ctx,REDISMODULE_POSTPONED_ARRAY_LEN);
     RedisModule_ReplyWithLongLong(ctx,1);
     RedisModule_ReplyWithArray(ctx,REDISMODULE_POSTPONED_ARRAY_LEN);
     RedisModule_ReplyWithLongLong(ctx,10);
     RedisModule_ReplyWithLongLong(ctx,20);
     RedisModule_ReplyWithLongLong(ctx,30);
     RedisModule_ReplySetArrayLength(ctx,3); // Set len of 10,20,30 array.
     RedisModule_ReplySetArrayLength(ctx,2); // Set len of top array

Note that in the above example there is no reason to postpone the array
length, since we produce a fixed number of elements, but in the practice
the code may use an interator or other ways of creating the output so
that is not easy to calculate in advance the number of elements.
注意，上例中，我们没必要延迟设置数组长度，因为生成的是一个固定个数的数组，但是实际生产中，
程序会使用迭代器或其他方法创建输出，因此很难算出数组中的元素个数。
## `RedisModule_ReplyWithStringBuffer`

    int RedisModule_ReplyWithStringBuffer(RedisModuleCtx *ctx, const char *buf, size_t len);

Reply with a bulk string, taking in input a C buffer pointer and length.

The function always returns `REDISMODULE_OK`.
批量返回字符串，每个字符串包含指向缓存的指针和字符串长度。
该函数返回`REDISMODULE_OK`

## `RedisModule_ReplyWithString`

    int RedisModule_ReplyWithString(RedisModuleCtx *ctx, RedisModuleString *str);

Reply with a bulk string, taking in input a RedisModuleString object.

The function always returns `REDISMODULE_OK`.
批量返回字符串，每个字符串包含指向缓存的指针和字符串长度。
该函数返回`REDISMODULE_OK`
## `RedisModule_ReplyWithNull`

    int RedisModule_ReplyWithNull(RedisModuleCtx *ctx);

Reply to the client with a NULL. In the RESP protocol a NULL is encoded
as the string "$-1\r\n".

The function always returns `REDISMODULE_OK`.
恢复客户端NULL，在RESP协议中，NULL的编码为字符串变量“$-l\r\n”
该函数返回`REDISMODULE_OK`
## `RedisModule_ReplyWithCallReply`

    int RedisModule_ReplyWithCallReply(RedisModuleCtx *ctx, RedisModuleCallReply *reply);

Reply exactly what a Redis command returned us with `RedisModule_Call()`.
This function is useful when we use `RedisModule_Call()` in order to
execute some command, as we want to reply to the client exactly the
same reply we obtained by the command.
将`RedisModule_Call()`的执行结果返回给客户端。当我们调用`RedisModule_Call()`执行命令，并希望
将我们收到的回复内容也返回给客户端时可以使用该函数。
The function always returns `REDISMODULE_OK`.
该函数返回`REDISMODULE_OK`.
## `RedisModule_ReplyWithDouble`

    int RedisModule_ReplyWithDouble(RedisModuleCtx *ctx, double d);

Send a string reply obtained converting the double 'd' into a bulk string.
This function is basically equivalent to converting a double into
a string into a C buffer, and then calling the function
`RedisModule_ReplyWithStringBuffer()` with the buffer and length.
该函数将double类型变量的返回结果`d`转换为字符串类型，然后调用函数`RedisModule_ReplyWithStringBuffer`
将结果返回给客户端。
The function always returns `REDISMODULE_OK`.
该函数返回`REDISMODULE_OK`
## `RedisModule_Replicate`

    int RedisModule_Replicate(RedisModuleCtx *ctx, const char *cmdname, const char *fmt, ...);

Replicate the specified command and arguments to slaves and AOF, as effect
of execution of the calling command implementation.
向从节点复制和AOF写入特定的命令和参数。
The replicated commands are always wrapped into the MULTI/EXEC that
contains all the commands replicated in a given module command
execution. However the commands replicated with `RedisModule_Call()`
are the first items, the ones replicated with `RedisModule_Replicate()`
will all follow before the EXEC.
被复制的命令通常都被MULTI/EXECT包裹在一个事务内，其中`RedisModule_Call()`复制的命令在第一位，`RedisModule_Replicate()`
复制的命令排在后面位置，但是在EXEC之前。

Modules should try to use one interface or the other.
模块建议使用同一个接口
This command follows exactly the same interface of `RedisModule_Call()`,
so a set of format specifiers must be passed, followed by arguments
matching the provided format specifiers.
该命令
Please refer to `RedisModule_Call()` for more information.

The command returns `REDISMODULE_ERR` if the format specifiers are invalid
or the command name does not belong to a known command.

## `RedisModule_ReplicateVerbatim`

    int RedisModule_ReplicateVerbatim(RedisModuleCtx *ctx);

This function will replicate the command exactly as it was invoked
by the client. Note that this function will not wrap the command into
a MULTI/EXEC stanza, so it should not be mixed with other replication
commands.

Basically this form of replication is useful when you want to propagate
the command to the slaves and AOF file exactly as it was called, since
the command can just be re-executed to deterministically re-create the
new state starting from the old one.

The function always returns `REDISMODULE_OK`.

## `RedisModule_GetClientId`

    unsigned long long RedisModule_GetClientId(RedisModuleCtx *ctx);

Return the ID of the current client calling the currently active module
command. The returned ID has a few guarantees:

1. The ID is different for each different client, so if the same client
   executes a module command multiple times, it can be recognized as
   having the same ID, otherwise the ID will be different.
2. The ID increases monotonically. Clients connecting to the server later
   are guaranteed to get IDs greater than any past ID previously seen.

Valid IDs are from 1 to 2^64-1. If 0 is returned it means there is no way
to fetch the ID in the context the function was currently called.

## `RedisModule_GetSelectedDb`

    int RedisModule_GetSelectedDb(RedisModuleCtx *ctx);

Return the currently selected DB.

## `RedisModule_SelectDb`

    int RedisModule_SelectDb(RedisModuleCtx *ctx, int newid);

Change the currently selected DB. Returns an error if the id
is out of range.

Note that the client will retain the currently selected DB even after
the Redis command implemented by the module calling this function
returns.

If the module command wishes to change something in a different DB and
returns back to the original one, it should call `RedisModule_GetSelectedDb()`
before in order to restore the old DB number before returning.

## `RedisModule_OpenKey`

    void *RedisModule_OpenKey(RedisModuleCtx *ctx, robj *keyname, int mode);

Return an handle representing a Redis key, so that it is possible
to call other APIs with the key handle as argument to perform
operations on the key.

The return value is the handle repesenting the key, that must be
closed with `RM_CloseKey()`.

If the key does not exist and WRITE mode is requested, the handle
is still returned, since it is possible to perform operations on
a yet not existing key (that will be created, for example, after
a list push operation). If the mode is just READ instead, and the
key does not exist, NULL is returned. However it is still safe to
call `RedisModule_CloseKey()` and `RedisModule_KeyType()` on a NULL
value.

## `RedisModule_CloseKey`

    void RedisModule_CloseKey(RedisModuleKey *key);

Close a key handle.

## `RedisModule_KeyType`

    int RedisModule_KeyType(RedisModuleKey *key);

Return the type of the key. If the key pointer is NULL then
`REDISMODULE_KEYTYPE_EMPTY` is returned.

## `RedisModule_ValueLength`

    size_t RedisModule_ValueLength(RedisModuleKey *key);

Return the length of the value associated with the key.
For strings this is the length of the string. For all the other types
is the number of elements (just counting keys for hashes).

If the key pointer is NULL or the key is empty, zero is returned.

## `RedisModule_DeleteKey`

    int RedisModule_DeleteKey(RedisModuleKey *key);

If the key is open for writing, remove it, and setup the key to
accept new writes as an empty key (that will be created on demand).
On success `REDISMODULE_OK` is returned. If the key is not open for
writing `REDISMODULE_ERR` is returned.

## `RedisModule_GetExpire`

    mstime_t RedisModule_GetExpire(RedisModuleKey *key);

Return the key expire value, as milliseconds of remaining TTL.
If no TTL is associated with the key or if the key is empty,
`REDISMODULE_NO_EXPIRE` is returned.

## `RedisModule_SetExpire`

    int RedisModule_SetExpire(RedisModuleKey *key, mstime_t expire);

Set a new expire for the key. If the special expire
`REDISMODULE_NO_EXPIRE` is set, the expire is cancelled if there was
one (the same as the PERSIST command).

Note that the expire must be provided as a positive integer representing
the number of milliseconds of TTL the key should have.

The function returns `REDISMODULE_OK` on success or `REDISMODULE_ERR` if
the key was not open for writing or is an empty key.

## `RedisModule_StringSet`

    int RedisModule_StringSet(RedisModuleKey *key, RedisModuleString *str);

If the key is open for writing, set the specified string 'str' as the
value of the key, deleting the old value if any.
On success `REDISMODULE_OK` is returned. If the key is not open for
writing or there is an active iterator, `REDISMODULE_ERR` is returned.

## `RedisModule_StringDMA`

    char *RedisModule_StringDMA(RedisModuleKey *key, size_t *len, int mode);

Prepare the key associated string value for DMA access, and returns
a pointer and size (by reference), that the user can use to read or
modify the string in-place accessing it directly via pointer.

The 'mode' is composed by bitwise OR-ing the following flags:

    REDISMODULE_READ -- Read access
    REDISMODULE_WRITE -- Write access

If the DMA is not requested for writing, the pointer returned should
only be accessed in a read-only fashion.

On error (wrong type) NULL is returned.

DMA access rules:

1. No other key writing function should be called since the moment
the pointer is obtained, for all the time we want to use DMA access
to read or modify the string.

2. Each time `RM_StringTruncate()` is called, to continue with the DMA
access, `RM_StringDMA()` should be called again to re-obtain
a new pointer and length.

3. If the returned pointer is not NULL, but the length is zero, no
byte can be touched (the string is empty, or the key itself is empty)
so a `RM_StringTruncate()` call should be used if there is to enlarge
the string, and later call StringDMA() again to get the pointer.

## `RedisModule_StringTruncate`

    int RedisModule_StringTruncate(RedisModuleKey *key, size_t newlen);

If the string is open for writing and is of string type, resize it, padding
with zero bytes if the new length is greater than the old one.

After this call, `RM_StringDMA()` must be called again to continue
DMA access with the new pointer.

The function returns `REDISMODULE_OK` on success, and `REDISMODULE_ERR` on
error, that is, the key is not open for writing, is not a string
or resizing for more than 512 MB is requested.

If the key is empty, a string key is created with the new string value
unless the new length value requested is zero.

## `RedisModule_ListPush`

    int RedisModule_ListPush(RedisModuleKey *key, int where, RedisModuleString *ele);

Push an element into a list, on head or tail depending on 'where' argumnet.
If the key pointer is about an empty key opened for writing, the key
is created. On error (key opened for read-only operations or of the wrong
type) `REDISMODULE_ERR` is returned, otherwise `REDISMODULE_OK` is returned.

## `RedisModule_ListPop`

    RedisModuleString *RedisModule_ListPop(RedisModuleKey *key, int where);

Pop an element from the list, and returns it as a module string object
that the user should be free with `RM_FreeString()` or by enabling
automatic memory. 'where' specifies if the element should be popped from
head or tail. The command returns NULL if:
1) The list is empty.
2) The key was not open for writing.
3) The key is not a list.

## `RedisModule_ZsetAddFlagsToCoreFlags`

    int RedisModule_ZsetAddFlagsToCoreFlags(int flags);

Conversion from/to public flags of the Modules API and our private flags,
so that we have everything decoupled.

## `RedisModule_ZsetAddFlagsFromCoreFlags`

    int RedisModule_ZsetAddFlagsFromCoreFlags(int flags);

See previous function comment.

## `RedisModule_ZsetAdd`

    int RedisModule_ZsetAdd(RedisModuleKey *key, double score, RedisModuleString *ele, int *flagsptr);

Add a new element into a sorted set, with the specified 'score'.
If the element already exists, the score is updated.

A new sorted set is created at value if the key is an empty open key
setup for writing.

Additional flags can be passed to the function via a pointer, the flags
are both used to receive input and to communicate state when the function
returns. 'flagsptr' can be NULL if no special flags are used.

The input flags are:

    REDISMODULE_ZADD_XX: Element must already exist. Do nothing otherwise.
    REDISMODULE_ZADD_NX: Element must not exist. Do nothing otherwise.

The output flags are:

    REDISMODULE_ZADD_ADDED: The new element was added to the sorted set.
    REDISMODULE_ZADD_UPDATED: The score of the element was updated.
    REDISMODULE_ZADD_NOP: No operation was performed because XX or NX flags.

On success the function returns `REDISMODULE_OK`. On the following errors
`REDISMODULE_ERR` is returned:

* The key was not opened for writing.
* The key is of the wrong type.
* 'score' double value is not a number (NaN).

## `RedisModule_ZsetIncrby`

    int RedisModule_ZsetIncrby(RedisModuleKey *key, double score, RedisModuleString *ele, int *flagsptr, double *newscore);

This function works exactly like `RM_ZsetAdd()`, but instead of setting
a new score, the score of the existing element is incremented, or if the
element does not already exist, it is added assuming the old score was
zero.

The input and output flags, and the return value, have the same exact
meaning, with the only difference that this function will return
`REDISMODULE_ERR` even when 'score' is a valid double number, but adding it
to the existing score resuts into a NaN (not a number) condition.

This function has an additional field 'newscore', if not NULL is filled
with the new score of the element after the increment, if no error
is returned.

## `RedisModule_ZsetRem`

    int RedisModule_ZsetRem(RedisModuleKey *key, RedisModuleString *ele, int *deleted);

Remove the specified element from the sorted set.
The function returns `REDISMODULE_OK` on success, and `REDISMODULE_ERR`
on one of the following conditions:

* The key was not opened for writing.
* The key is of the wrong type.

The return value does NOT indicate the fact the element was really
removed (since it existed) or not, just if the function was executed
with success.

In order to know if the element was removed, the additional argument
'deleted' must be passed, that populates the integer by reference
setting it to 1 or 0 depending on the outcome of the operation.
The 'deleted' argument can be NULL if the caller is not interested
to know if the element was really removed.

Empty keys will be handled correctly by doing nothing.

## `RedisModule_ZsetScore`

    int RedisModule_ZsetScore(RedisModuleKey *key, RedisModuleString *ele, double *score);

On success retrieve the double score associated at the sorted set element
'ele' and returns `REDISMODULE_OK`. Otherwise `REDISMODULE_ERR` is returned
to signal one of the following conditions:

* There is no such element 'ele' in the sorted set.
* The key is not a sorted set.
* The key is an open empty key.

## `RedisModule_ZsetRangeStop`

    void RedisModule_ZsetRangeStop(RedisModuleKey *key);

Stop a sorted set iteration.

## `RedisModule_ZsetRangeEndReached`

    int RedisModule_ZsetRangeEndReached(RedisModuleKey *key);

Return the "End of range" flag value to signal the end of the iteration.

## `RedisModule_ZsetFirstInScoreRange`

    int RedisModule_ZsetFirstInScoreRange(RedisModuleKey *key, double min, double max, int minex, int maxex);

Setup a sorted set iterator seeking the first element in the specified
range. Returns `REDISMODULE_OK` if the iterator was correctly initialized
otherwise `REDISMODULE_ERR` is returned in the following conditions:

1. The value stored at key is not a sorted set or the key is empty.

The range is specified according to the two double values 'min' and 'max'.
Both can be infinite using the following two macros:

`REDISMODULE_POSITIVE_INFINITE` for positive infinite value
`REDISMODULE_NEGATIVE_INFINITE` for negative infinite value

'minex' and 'maxex' parameters, if true, respectively setup a range
where the min and max value are exclusive (not included) instead of
inclusive.

## `RedisModule_ZsetLastInScoreRange`

    int RedisModule_ZsetLastInScoreRange(RedisModuleKey *key, double min, double max, int minex, int maxex);

Exactly like `RedisModule_ZsetFirstInScoreRange()` but the last element of
the range is selected for the start of the iteration instead.

## `RedisModule_ZsetFirstInLexRange`

    int RedisModule_ZsetFirstInLexRange(RedisModuleKey *key, RedisModuleString *min, RedisModuleString *max);

Setup a sorted set iterator seeking the first element in the specified
lexicographical range. Returns `REDISMODULE_OK` if the iterator was correctly
initialized otherwise `REDISMODULE_ERR` is returned in the
following conditions:

1. The value stored at key is not a sorted set or the key is empty.
2. The lexicographical range 'min' and 'max' format is invalid.

'min' and 'max' should be provided as two RedisModuleString objects
in the same format as the parameters passed to the ZRANGEBYLEX command.
The function does not take ownership of the objects, so they can be released
ASAP after the iterator is setup.

## `RedisModule_ZsetLastInLexRange`

    int RedisModule_ZsetLastInLexRange(RedisModuleKey *key, RedisModuleString *min, RedisModuleString *max);

Exactly like `RedisModule_ZsetFirstInLexRange()` but the last element of
the range is selected for the start of the iteration instead.

## `RedisModule_ZsetRangeCurrentElement`

    RedisModuleString *RedisModule_ZsetRangeCurrentElement(RedisModuleKey *key, double *score);

Return the current sorted set element of an active sorted set iterator
or NULL if the range specified in the iterator does not include any
element.

## `RedisModule_ZsetRangeNext`

    int RedisModule_ZsetRangeNext(RedisModuleKey *key);

Go to the next element of the sorted set iterator. Returns 1 if there was
a next element, 0 if we are already at the latest element or the range
does not include any item at all.

## `RedisModule_ZsetRangePrev`

    int RedisModule_ZsetRangePrev(RedisModuleKey *key);

Go to the previous element of the sorted set iterator. Returns 1 if there was
a previous element, 0 if we are already at the first element or the range
does not include any item at all.

## `RedisModule_HashSet`

    int RedisModule_HashSet(RedisModuleKey *key, int flags, ...);

Set the field of the specified hash field to the specified value.
If the key is an empty key open for writing, it is created with an empty
hash value, in order to set the specified field.

The function is variadic and the user must specify pairs of field
names and values, both as RedisModuleString pointers (unless the
CFIELD option is set, see later).

Example to set the hash argv[1] to the value argv[2]:

     RedisModule_HashSet(key,REDISMODULE_HASH_NONE,argv[1],argv[2],NULL);

The function can also be used in order to delete fields (if they exist)
by setting them to the specified value of `REDISMODULE_HASH_DELETE`:

     RedisModule_HashSet(key,REDISMODULE_HASH_NONE,argv[1],
                         REDISMODULE_HASH_DELETE,NULL);

The behavior of the command changes with the specified flags, that can be
set to `REDISMODULE_HASH_NONE` if no special behavior is needed.

    REDISMODULE_HASH_NX: The operation is performed only if the field was not
                         already existing in the hash.
    REDISMODULE_HASH_XX: The operation is performed only if the field was
                         already existing, so that a new value could be
                         associated to an existing filed, but no new fields
                         are created.
    REDISMODULE_HASH_CFIELDS: The field names passed are null terminated C
                              strings instead of RedisModuleString objects.

Unless NX is specified, the command overwrites the old field value with
the new one.

When using `REDISMODULE_HASH_CFIELDS`, field names are reported using
normal C strings, so for example to delete the field "foo" the following
code can be used:

     RedisModule_HashSet(key,REDISMODULE_HASH_CFIELDS,"foo",
                         REDISMODULE_HASH_DELETE,NULL);

Return value:

The number of fields updated (that may be less than the number of fields
specified because of the XX or NX options).

In the following case the return value is always zero:

* The key was not open for writing.
* The key was associated with a non Hash value.

## `RedisModule_HashGet`

    int RedisModule_HashGet(RedisModuleKey *key, int flags, ...);

Get fields from an hash value. This function is called using a variable
number of arguments, alternating a field name (as a StringRedisModule
pointer) with a pointer to a StringRedisModule pointer, that is set to the
value of the field if the field exist, or NULL if the field did not exist.
At the end of the field/value-ptr pairs, NULL must be specified as last
argument to signal the end of the arguments in the variadic function.

This is an example usage:

     RedisModuleString *first, *second;
     RedisModule_HashGet(mykey,REDISMODULE_HASH_NONE,argv[1],&first,
                     argv[2],&second,NULL);

As with `RedisModule_HashSet()` the behavior of the command can be specified
passing flags different than `REDISMODULE_HASH_NONE`:

`REDISMODULE_HASH_CFIELD`: field names as null terminated C strings.

`REDISMODULE_HASH_EXISTS`: instead of setting the value of the field
expecting a RedisModuleString pointer to pointer, the function just
reports if the field esists or not and expects an integer pointer
as the second element of each pair.

Example of `REDISMODULE_HASH_CFIELD`:

     RedisModuleString *username, *hashedpass;
     RedisModule_HashGet(mykey,"username",&username,"hp",&hashedpass, NULL);

Example of `REDISMODULE_HASH_EXISTS`:

     int exists;
     RedisModule_HashGet(mykey,argv[1],&exists,NULL);

The function returns `REDISMODULE_OK` on success and `REDISMODULE_ERR` if
the key is not an hash value.

Memory management:

The returned RedisModuleString objects should be released with
`RedisModule_FreeString()`, or by enabling automatic memory management.

## `RedisModule_FreeCallReply_Rec`

    void RedisModule_FreeCallReply_Rec(RedisModuleCallReply *reply, int freenested);

Free a Call reply and all the nested replies it contains if it's an
array.

## `RedisModule_FreeCallReply`

    void RedisModule_FreeCallReply(RedisModuleCallReply *reply);

Wrapper for the recursive free reply function. This is needed in order
to have the first level function to return on nested replies, but only
if called by the module API.

## `RedisModule_CallReplyType`

    int RedisModule_CallReplyType(RedisModuleCallReply *reply);

Return the reply type.

## `RedisModule_CallReplyLength`

    size_t RedisModule_CallReplyLength(RedisModuleCallReply *reply);

Return the reply type length, where applicable.

## `RedisModule_CallReplyArrayElement`

    RedisModuleCallReply *RedisModule_CallReplyArrayElement(RedisModuleCallReply *reply, size_t idx);

Return the 'idx'-th nested call reply element of an array reply, or NULL
if the reply type is wrong or the index is out of range.

## `RedisModule_CallReplyInteger`

    long long RedisModule_CallReplyInteger(RedisModuleCallReply *reply);

Return the long long of an integer reply.

## `RedisModule_CallReplyStringPtr`

    const char *RedisModule_CallReplyStringPtr(RedisModuleCallReply *reply, size_t *len);

Return the pointer and length of a string or error reply.

## `RedisModule_CreateStringFromCallReply`

    RedisModuleString *RedisModule_CreateStringFromCallReply(RedisModuleCallReply *reply);

Return a new string object from a call reply of type string, error or
integer. Otherwise (wrong reply type) return NULL.

## `RedisModule_Call`

    RedisModuleCallReply *RedisModule_Call(RedisModuleCtx *ctx, const char *cmdname, const char *fmt, ...);

Exported API to call any Redis command from modules.
On success a RedisModuleCallReply object is returned, otherwise
NULL is returned and errno is set to the following values:

EINVAL: command non existing, wrong arity, wrong format specifier.
EPERM:  operation in Cluster instance with key in non local slot.

## `RedisModule_CallReplyProto`

    const char *RedisModule_CallReplyProto(RedisModuleCallReply *reply, size_t *len);

Return a pointer, and a length, to the protocol returned by the command
that returned the reply object.

## `RedisModule_CreateDataType`

    moduleType *RedisModule_CreateDataType(RedisModuleCtx *ctx, const char *name, int encver, void *typemethods_ptr);

Register a new data type exported by the module. The parameters are the
following. Please for in depth documentation check the modules API
documentation, especially the TYPES.md file.

* **name**: A 9 characters data type name that MUST be unique in the Redis
  Modules ecosystem. Be creative... and there will be no collisions. Use
  the charset A-Z a-z 9-0, plus the two "-_" characters. A good
  idea is to use, for example `<typename>-<vendor>`. For example
  "tree-AntZ" may mean "Tree data structure by @antirez". To use both
  lower case and upper case letters helps in order to prevent collisions.
* **encver**: Encoding version, which is, the version of the serialization
  that a module used in order to persist data. As long as the "name"
  matches, the RDB loading will be dispatched to the type callbacks
  whatever 'encver' is used, however the module can understand if
  the encoding it must load are of an older version of the module.
  For example the module "tree-AntZ" initially used encver=0. Later
  after an upgrade, it started to serialize data in a different format
  and to register the type with encver=1. However this module may
  still load old data produced by an older version if the rdb_load
  callback is able to check the encver value and act accordingly.
  The encver must be a positive value between 0 and 1023.
* **typemethods_ptr** is a pointer to a RedisModuleTypeMethods structure
  that should be populated with the methods callbacks and structure
  version, like in the following example:

     RedisModuleTypeMethods tm = {
         .version = REDISMODULE_TYPE_METHOD_VERSION,
         .rdb_load = myType_RDBLoadCallBack,
         .rdb_save = myType_RDBSaveCallBack,
         .aof_rewrite = myType_AOFRewriteCallBack,
         .free = myType_FreeCallBack,

         // Optional fields
         .digest = myType_DigestCallBack,
         .mem_usage = myType_MemUsageCallBack,
     }

* **rdb_load**: A callback function pointer that loads data from RDB files.
* **rdb_save**: A callback function pointer that saves data to RDB files.
* **aof_rewrite**: A callback function pointer that rewrites data as commands.
* **digest**: A callback function pointer that is used for `DEBUG DIGEST`.
* **free**: A callback function pointer that can free a type value.

The **digest* and **mem_usage** methods should currently be omitted since
they are not yet implemented inside the Redis modules core.

Note: the module name "AAAAAAAAA" is reserved and produces an error, it
happens to be pretty lame as well.

If there is already a module registering a type with the same name,
and if the module name or encver is invalid, NULL is returned.
Otherwise the new type is registered into Redis, and a reference of
type RedisModuleType is returned: the caller of the function should store
this reference into a gobal variable to make future use of it in the
modules type API, since a single module may register multiple types.
Example code fragment:

     static RedisModuleType *BalancedTreeType;

     int RedisModule_OnLoad(RedisModuleCtx *ctx) {
         // some code here ...
         BalancedTreeType = RM_CreateDataType(...);
     }

## `RedisModule_ModuleTypeSetValue`

    int RedisModule_ModuleTypeSetValue(RedisModuleKey *key, moduleType *mt, void *value);

If the key is open for writing, set the specified module type object
as the value of the key, deleting the old value if any.
On success `REDISMODULE_OK` is returned. If the key is not open for
writing or there is an active iterator, `REDISMODULE_ERR` is returned.

## `RedisModule_ModuleTypeGetType`

    moduleType *RedisModule_ModuleTypeGetType(RedisModuleKey *key);

Assuming `RedisModule_KeyType()` returned `REDISMODULE_KEYTYPE_MODULE` on
the key, returns the moduel type pointer of the value stored at key.

If the key is NULL, is not associated with a module type, or is empty,
then NULL is returned instead.

## `RedisModule_ModuleTypeGetValue`

    void *RedisModule_ModuleTypeGetValue(RedisModuleKey *key);

Assuming `RedisModule_KeyType()` returned `REDISMODULE_KEYTYPE_MODULE` on
the key, returns the module type low-level value stored at key, as
it was set by the user via `RedisModule_ModuleTypeSet()`.

If the key is NULL, is not associated with a module type, or is empty,
then NULL is returned instead.

## `RedisModule_SaveUnsigned`

    void RedisModule_SaveUnsigned(RedisModuleIO *io, uint64_t value);

Save an unsigned 64 bit value into the RDB file. This function should only
be called in the context of the rdb_save method of modules implementing new
data types.

## `RedisModule_LoadUnsigned`

    uint64_t RedisModule_LoadUnsigned(RedisModuleIO *io);

Load an unsigned 64 bit value from the RDB file. This function should only
be called in the context of the rdb_load method of modules implementing
new data types.

## `RedisModule_SaveSigned`

    void RedisModule_SaveSigned(RedisModuleIO *io, int64_t value);

Like `RedisModule_SaveUnsigned()` but for signed 64 bit values.

## `RedisModule_LoadSigned`

    int64_t RedisModule_LoadSigned(RedisModuleIO *io);

Like `RedisModule_LoadUnsigned()` but for signed 64 bit values.

## `RedisModule_SaveString`

    void RedisModule_SaveString(RedisModuleIO *io, RedisModuleString *s);

In the context of the rdb_save method of a module type, saves a
string into the RDB file taking as input a RedisModuleString.

The string can be later loaded with `RedisModule_LoadString()` or
other Load family functions expecting a serialized string inside
the RDB file.

## `RedisModule_SaveStringBuffer`

    void RedisModule_SaveStringBuffer(RedisModuleIO *io, const char *str, size_t len);

Like `RedisModule_SaveString()` but takes a raw C pointer and length
as input.

## `RedisModule_LoadString`

    RedisModuleString *RedisModule_LoadString(RedisModuleIO *io);

In the context of the rdb_load method of a module data type, loads a string
from the RDB file, that was previously saved with `RedisModule_SaveString()`
functions family.

The returned string is a newly allocated RedisModuleString object, and
the user should at some point free it with a call to `RedisModule_FreeString()`.

If the data structure does not store strings as RedisModuleString objects,
the similar function `RedisModule_LoadStringBuffer()` could be used instead.

## `RedisModule_LoadStringBuffer`

    char *RedisModule_LoadStringBuffer(RedisModuleIO *io, size_t *lenptr);

Like `RedisModule_LoadString()` but returns an heap allocated string that
was allocated with `RedisModule_Alloc()`, and can be resized or freed with
`RedisModule_Realloc()` or `RedisModule_Free()`.

The size of the string is stored at '*lenptr' if not NULL.
The returned string is not automatically NULL termianted, it is loaded
exactly as it was stored inisde the RDB file.

## `RedisModule_SaveDouble`

    void RedisModule_SaveDouble(RedisModuleIO *io, double value);

In the context of the rdb_save method of a module data type, saves a double
value to the RDB file. The double can be a valid number, a NaN or infinity.
It is possible to load back the value with `RedisModule_LoadDouble()`.

## `RedisModule_LoadDouble`

    double RedisModule_LoadDouble(RedisModuleIO *io);

In the context of the rdb_save method of a module data type, loads back the
double value saved by `RedisModule_SaveDouble()`.

## `RedisModule_SaveFloat`

    void RedisModule_SaveFloat(RedisModuleIO *io, float value);

In the context of the rdb_save method of a module data type, saves a float
value to the RDB file. The float can be a valid number, a NaN or infinity.
It is possible to load back the value with `RedisModule_LoadFloat()`.

## `RedisModule_LoadFloat`

    float RedisModule_LoadFloat(RedisModuleIO *io);

In the context of the rdb_save method of a module data type, loads back the
float value saved by `RedisModule_SaveFloat()`.

## `RedisModule_DigestAddStringBuffer`

    void RedisModule_DigestAddStringBuffer(RedisModuleDigest *md, unsigned char *ele, size_t len);

Add a new element to the digest. This function can be called multiple times
one element after the other, for all the elements that constitute a given
data structure. The function call must be followed by the call to
``RedisModule_DigestEndSequence`` eventually, when all the elements that are
always in a given order are added. See the Redis Modules data types
documentation for more info. However this is a quick example that uses Redis
data types as an example.

To add a sequence of unordered elements (for example in the case of a Redis
Set), the pattern to use is:

    foreach element {
        AddElement(element);
        EndSequence();
    }

Because Sets are not ordered, so every element added has a position that
does not depend from the other. However if instead our elements are
ordered in pairs, like field-value pairs of an Hash, then one should
use:

    foreach key,value {
        AddElement(key);
        AddElement(value);
        EndSquence();
    }

Because the key and value will be always in the above order, while instead
the single key-value pairs, can appear in any position into a Redis hash.

A list of ordered elements would be implemented with:

    foreach element {
        AddElement(element);
    }
    EndSequence();

## `RedisModule_DigestAddLongLong`

    void RedisModule_DigestAddLongLong(RedisModuleDigest *md, long long ll);

Like ``RedisModule_DigestAddStringBuffer()`` but takes a long long as input
that gets converted into a string before adding it to the digest.

## `RedisModule_DigestEndSequence`

    void RedisModule_DigestEndSequence(RedisModuleDigest *md);

See the doucmnetation for ``RedisModule_DigestAddElement()``.

## `RedisModule_EmitAOF`

    void RedisModule_EmitAOF(RedisModuleIO *io, const char *cmdname, const char *fmt, ...);

Emits a command into the AOF during the AOF rewriting process. This function
is only called in the context of the aof_rewrite method of data types exported
by a module. The command works exactly like `RedisModule_Call()` in the way
the parameters are passed, but it does not return anything as the error
handling is performed by Redis itself.

## `RedisModule_LogRaw`

    void RedisModule_LogRaw(RedisModule *module, const char *levelstr, const char *fmt, va_list ap);

This is the low level function implementing both:

     RM_Log()
     RM_LogIOError()

## `RedisModule_Log`

    void RedisModule_Log(RedisModuleCtx *ctx, const char *levelstr, const char *fmt, ...);

Produces a log message to the standard Redis log, the format accepts
printf-alike specifiers, while level is a string describing the log
level to use when emitting the log, and must be one of the following:

* "debug"
* "verbose"
* "notice"
* "warning"

If the specified log level is invalid, verbose is used by default.
There is a fixed limit to the length of the log line this function is able
to emit, this limti is not specified but is guaranteed to be more than
a few lines of text.

## `RedisModule_LogIOError`

    void RedisModule_LogIOError(RedisModuleIO *io, const char *levelstr, const char *fmt, ...);

Log errors from RDB / AOF serialization callbacks.

This function should be used when a callback is returning a critical
error to the caller since cannot load or save the data for some
critical reason.

## `RedisModule_BlockClient`

    RedisModuleBlockedClient *RedisModule_BlockClient(RedisModuleCtx *ctx, RedisModuleCmdFunc reply_callback, RedisModuleCmdFunc timeout_callback, void (*free_privdata)(void*), long long timeout_ms);

Block a client in the context of a blocking command, returning an handle
which will be used, later, in order to block the client with a call to
`RedisModule_UnblockClient()`. The arguments specify callback functions
and a timeout after which the client is unblocked.

The callbacks are called in the following contexts:

    reply_callback:  called after a successful RedisModule_UnblockClient()
                     call in order to reply to the client and unblock it.

    reply_timeout:   called when the timeout is reached in order to send an
                     error to the client.

    free_privdata:   called in order to free the privata data that is passed
                     by RedisModule_UnblockClient() call.

## `RedisModule_UnblockClient`

    int RedisModule_UnblockClient(RedisModuleBlockedClient *bc, void *privdata);

Unblock a client blocked by ``RedisModule_BlockedClient``. This will trigger
the reply callbacks to be called in order to reply to the client.
The 'privdata' argument will be accessible by the reply callback, so
the caller of this function can pass any value that is needed in order to
actually reply to the client.

A common usage for 'privdata' is a thread that computes something that
needs to be passed to the client, included but not limited some slow
to compute reply or some reply obtained via networking.

Note: this function can be called from threads spawned by the module.

## `RedisModule_AbortBlock`

    int RedisModule_AbortBlock(RedisModuleBlockedClient *bc);

Abort a blocked client blocking operation: the client will be unblocked
without firing the reply callback.

## `RedisModule_IsBlockedReplyRequest`

    int RedisModule_IsBlockedReplyRequest(RedisModuleCtx *ctx);

Return non-zero if a module command was called in order to fill the
reply for a blocked client.

## `RedisModule_IsBlockedTimeoutRequest`

    int RedisModule_IsBlockedTimeoutRequest(RedisModuleCtx *ctx);

Return non-zero if a module command was called in order to fill the
reply for a blocked client that timed out.

## `RedisModule_GetBlockedClientPrivateData`

    void *RedisModule_GetBlockedClientPrivateData(RedisModuleCtx *ctx);

Get the privata data set by `RedisModule_UnblockClient()`

## `RedisModule_GetThreadSafeContext`

    RedisModuleCtx *RedisModule_GetThreadSafeContext(RedisModuleBlockedClient *bc);

Return a context which can be used inside threads to make Redis context
calls with certain modules APIs. If 'bc' is not NULL then the module will
be bound to a blocked client, and it will be possible to use the
``RedisModule_Reply`*` family of functions to accumulate a reply for when the
client will be unblocked. Otherwise the thread safe context will be
detached by a specific client.

To call non-reply APIs, the thread safe context must be prepared with:

    RedisModule_ThreadSafeCallStart(ctx);
    ... make your call here ...
    RedisModule_ThreadSafeCallStop(ctx);

This is not needed when using ``RedisModule_Reply`*` functions, assuming
that a blocked client was used when the context was created, otherwise
no `RedisModule_Reply`* call should be made at all.

TODO: thread safe contexts do not inherit the blocked client
selected database.

## `RedisModule_FreeThreadSafeContext`

    void RedisModule_FreeThreadSafeContext(RedisModuleCtx *ctx);

Release a thread safe context.

## `RedisModule_ThreadSafeContextLock`

    void RedisModule_ThreadSafeContextLock(RedisModuleCtx *ctx);

Acquire the server lock before executing a thread safe API call.
This is not needed for ``RedisModule_Reply`*` calls when there is
a blocked client connected to the thread safe context.

## `RedisModule_ThreadSafeContextUnlock`

    void RedisModule_ThreadSafeContextUnlock(RedisModuleCtx *ctx);

Release the server lock after a thread safe API call was executed.

