---
layout: topics
title: modules-native-types
permalink: topics/modules-native-types.html
disqusIdentifier: topics/modules-native-types
disqusUrl: http://redis.cn/topics/topics/modules-native-types.html
discuzTid: 2014
tranAuthor: menwengit
---

Redis 模块系统中的原生类型
===

Redis 模块系统可以通过调用 Redis 命令和低层次的直接访问数据结构，来深层次访问 Redis 内置的数据结构。

通过使用这些功能，以便在现有的 Redis 数据结构上构建新的抽象，或者通过使用字符串DMA将模块的数据结构编码为 Redis 字符串，创建模块可能看起来就像导出了新的数据类型。但是，对于更复杂的问题，需要在模块内部实现新的数据结构，这还不够。

我们使用 Redis 模块实现新的数据结构的功能，这就像本地的 Redis 实例中**原生支持的类型**。这个文档旨在描述 Redis 模块系统导出的 API ，这些 API 被用来创建新的数据类型、处理序列化的RDB文件和在处理AOF的重写过程中，通过`TYPE` 命令报告的类型等等。

原生类型的概述
---

一个导出原生类型的模块由以下主要的部分组成：

* 实现某些新的数据结构和对新数据结构进行操作的命令。
* 一组回调方法用来处理：生成RDB，载入RDB，AOF重写，释放值对象关联的键对象，计算和`DEBUG DIGEST`命令一起使用的哈希值。
* 每个模块原生数据类型独一无二的长度为9个字符的名字。
* 一种编码版本，用来将RDB文件持久化为指定模块的数据版本，以便一个模块能够载入更老版本的RDB文件。

当正在加载RDB文件时，生成RDB操作和AOF重写过程起初看起来可能很复杂，但是模块的API提供一个非常高级的功能来处理所有这些问题，而不需要用户来处理读写错误，所以实际情况中，为 Redis 写一个新的数据结构是非常简单的工作。

Redis 发行版的 `/modules/hellotype.c` 文件中提供了一个非常容易理解并且完整的原生类型实现的例子。希望读者通过浏览这个示例实现来阅读文档，以了解实践中的应用。

注册一个新的数据类型
===

为了在 Redis 内核中注册一个新的原生类型，模块需要声明一个全局变量，该变量将维护一个对数据类型的引用。注册数据类型的API将会返回一个被保存在全局变量的数据类型。

    static RedisModuleType *MyType;
    #define MYTYPE_ENCODING_VERSION 0
    
    int RedisModule_OnLoad(RedisModuleCtx *ctx) {
    RedisModuleTypeMethods tm = {
        .version = REDISMODULE_TYPE_METHOD_VERSION,
        .rdb_load = MyTypeRDBLoad,
        .rdb_save = MyTypeRDBSave,
        .aof_rewrite = MyTypeAOFRewrite,
        .free = MyTypeFree
    };
    
        MyType = RedisModule_CreateDataType(ctx, "MyType-AZ",
    	MYTYPE_ENCODING_VERSION, &tm);
        if (MyType == NULL) return REDISMODULE_ERR;
    }

从上面的例子可以看到，注册一个新的类型要需要一次API调用。然而，一些函数指针作为参数被传递进去。一部分参数是可选的，而一部分参数是必须要指定的。上述例子中的方法集必须被传递，而 `.digest` 和`.mem_usage` 是可选的，并且这两个选项在模块内部并没有被支持，所以你可以先忽略他们。

`ctx` 参数使我们在`OnLoad`函数中接收到的上下文，`name` 类型是一个由9个字符组成的名字，字符集包括  `A-Z`, `a-z`, `0-9` ，以及下划线 `_` 和负号 `-`。

请注意，在 Redis 中的每一个数据类型的名字必须是独一无二的，因此，如果其名称有意义，请使用大小写的组合，并且尝试使用类型名称和模块作者名称作为组合的习惯，创建一个9个字符长的独一无二的名称。

**注意:**  非常重要的是，名称长度必须为9个字符长度，否则注册类型将会失败，继续阅读更多以了解原因。

例如，如果我创建了一个 *b-tree* 的数据类型并且我的名字是 *antirez* ，那么我将其命名为 **btree1-az** 。该名字将会被转换为64 bit的整数，当进行持久化时会被存储在RDB文件中，并且当加载RDB数据时，会被用来解析成对应的模块数据。如果 Redis 没有发现相匹配的模块，整数值会被转换为名称，以便为用户提供一些关于加载数据时丢失的模块的线索。

当执行 `TYPE` 命令调用了持有已注册的类型的键，该类型名称也被用来作为命令的回复。

`encver` 参数是所使用的模块在RDB文件中存储的编码版本。例如，我的编码版本从0开始，但是当我发布2.0版本的模块时，我可以更好的切换编码，新的模块将被注册为编码版本1，因此，当当它生成新的RDB文件时，新的版本将会被存储在磁盘中。但是，当载入RDB文件时，模块的`rdb_load` 方法将会被调用，即使发现有不同的编码版本（该编码版本会被作为参数传递给`rdb_load`），以便该模块仍然能够加载旧的RDB文件。

最后一个参数是一个结构体，用于传递类型方法给注册函数： `rdb_load`, `rdb_save`, `aof_rewrite`, `digest` 和`free` 和`mem_usage` 全都是回调函数，且具有以下的原型和用途：

    typedef void *(*RedisModuleTypeLoadFunc)(RedisModuleIO *rdb, int encver);
    typedef void (*RedisModuleTypeSaveFunc)(RedisModuleIO *rdb, void *value);
    typedef void (*RedisModuleTypeRewriteFunc)(RedisModuleIO *aof, RedisModuleString *key, void *value);
    typedef size_t (*RedisModuleTypeMemUsageFunc)(void *value);
    typedef void (*RedisModuleTypeDigestFunc)(RedisModuleDigest *digest, void *value);
    typedef void (*RedisModuleTypeFreeFunc)(void *value);

* 当从RDB文件中加载数据时，调用 `rdb_load` 函数，它以与`rdb_save` 所生成相同的格式加载数据。
* 当生成RDB文件时，`rdb_save` 被调用。
* 当AOF正在被执行重写操作时，`aof_rewrite` 被调用，并且模块需要告诉 Redis 重新创建指定键的命令顺序。
* 当执行 `DEBUG DIGEST` 并且持有模块类型的键被找到时，`digest` 被调用。当前还没有实现该功能，因此被留为空。
* 当`digest` 命令请求指定键总共消耗的内存时，`mem_usage` 被调用，并且被用于获取模块值使用的字节数。
* 当一个具有模块原生类型的键通过`DEL` 或者任何其他的方式被删除时，`free` 被调用，是为了让模块回收与此相关联的内存。

为什么模块类型需要9个字符的名字？
---

哦，我明白你需要了解这一点，所以这里有一个具体的解释。

当 Redis 进行持久化生成 RDB 文件时，模块特定的数据类型也需要被持久化。当前 RDB 文件是键值对的序列，如下所示：

1个字节用来标识字符串、列表或集合等等。就模块数据而言，他被设置为`module data` 的特殊值，但是这当然还不够，我们还需要将一个特定值和能够加载和处理该特定值的特定模块类型相链接的信息。

所以，当我将一个模块的 `type specific value` 进行持久化时，我们用一个64位整数来表示它的前缀。64位足够去存储所需要的信息，以便查找到可以处理指定类型的模块，并且足够的短，以至于可以在RDB文件中存储每一个模块的前缀，而最终不会使RDB文件太大。同时，这个用64位签名作为前缀的解决方案不需要做奇怪的事，比如在RDB头文件中定义具体类型模块的列表。一切都很简单。

那么，为了以可靠的方式标识给定的模块，那么你可以在64位中存储什么呢？如果你构建了一个64个符号的字符集，你可以轻易的存储9个字符，每个字符6位长度，并且还剩下10位，这10位用于存储类型的编码版本，以便在将来相同的类型能够逐步演变，并且能为RDB文件提供不同的、更加有效或可更新的序列化格式。

因此每个模块值被存储的前缀如下所示：

    6|6|6|6|6|6|6|6|6|10

前9个元素是由6位组成的字符，最后10位是编码版本。

当RDB文件加载时，先会读取64位值，然后屏蔽最后10位，并且在模块类型的缓存中查找一个可以匹配上的模块。当找到一个匹配项时，载入RDB文件值的方法就被调用，10位的编码版本作为该方法的参数，以便如果支持多个版本，模块能够了解要加载的数据布局的版本。

现在有趣的是，如果因为没有被加载的模块由这个签名，而模块类型不能被解决，我们可以将64位值转换回9个字符的名字，并且将一个包括模块类型名称的错误打印给用户！以便她或者他能够立刻意识到错误。

设置和获取键
---

在`RedisModule_OnLoad()` 函数中注册了我们新的数据类型之后，我们还需要能够设置具有原生类型值的 Redis 键。

这通常发生在将数据写到键的命令的上下文中。原生类型API允许设置和获取模块原生数据类型，并且可以测试一个给定的键是否已经和一个指定的数据类型相关联。

API使用正常模块的`RedisModule_OnLoad()` 低层次的访问接口来处理此问题。这是一个将原生类型私有数据结构设置为Redis键的一个例子。

    RedisModuleKey *key = RedisModule_OpenKey(ctx,keyname,REDISMODULE_WRITE);
    struct some_private_struct *data = createMyDataStructure();
    RedisModule_ModuleTypeSetValue(key,MyType,data);

函数 `RedisModule_ModuleTypeSetValue()` 用于打开一个键的用于写操作的句柄，并且获得三个参数：键的句柄，原生类型的引用和一个在类型注册期间获取，最终包含实现原生类型的私有数据的指针`void*` 。

请注意，Redis没有任何关于你的数据的线索。它只是调用在注册方法时你提供的回调函数，以便对该类型执行操作。

类似地，我们可以从一个键中找回私有的数据，使用下面的函数：

    struct some_private_struct *data;
    data = RedisModule_ModuleTypeGetValue(key);

我们还可以测试一个键是否含有原生类型作为其值。

    if (RedisModule_ModuleTypeGetType(key) == MyType) {
        /* ... do something ... */
    }

但是，为了让调用能做正确的事，我们需要检查是否键为空，是否包含正确类型的值等等。所以一贯的实现写原生类型命令的代码如下面这些行所示。

    RedisModuleKey *key = RedisModule_OpenKey(ctx,argv[1],
        REDISMODULE_READ|REDISMODULE_WRITE);
    int type = RedisModule_KeyType(key);
    if (type != REDISMODULE_KEYTYPE_EMPTY &&
        RedisModule_ModuleTypeGetType(key) != MyType)
    {
        return RedisModule_ReplyWithError(ctx,REDISMODULE_ERRORMSG_WRONGTYPE);
    }

然后，如果我们成功的验证了该键不是一个错误的类型，并且我们准备要写入值，如果键为空，那么我们通常是想要创建一个新的数据结构，或者如果键不为空，则返回一个关联该键的值的引用。

    /* Create an empty value object if the key is currently empty. */
    struct some_private_struct *data;
    if (type == REDISMODULE_KEYTYPE_EMPTY) {
        data = createMyDataStructure();
        RedisModule_ModuleTypeSetValue(key,MyTyke,data);
    } else {
        data = RedisModule_ModuleTypeGetValue(key);
    }
    /* Do something with 'data'... */

释放的方法
---

如之前所述，当 Redis 需要去释放一个持有原生类型值的键时，它需要从模块的帮助才能释放内存。这就是我们为什么在类型注册期间传递一个`free` 回调函数的原因。

    typedef void (*RedisModuleTypeFreeFunc)(void *value);

假如我们的数据结构只由单个分配项组成，那么这个释放方法的一个最简单的实现如下所示

    void MyTypeFreeCallback(void *value) {
        RedisModule_Free(value);
    }

然而一个更加现实的实现会调用一些执行更加复杂内存回收的函数，通过将void指针转换为一些结构并且释放构成该值的所有资源。

加载和生成RDB的方法
---

生成和加载RDB的回调方法需要创建（并加载）磁盘上的数据类型的表示。Redis 提供高级的API能够自动在RDB文件中存储以下类型：

* 无符号64位整数
* 有符号64位整数
* 双精度浮点数（double）
* 字符串

使用以上基本类型的哪一个取决于模块找到的可行的表示。但是请注意，尽管整型和双精度浮点数类型的值是以一个体系结构的方式被存储和被加载并且是以*字节序* 无关的方式。如果你使用原始的字符串生成RDB的API，例如，将结构保存在磁盘上，你必须注意这样细节。

下面是执行生成RDB和加载RDB的函数列表：

    void RedisModule_SaveUnsigned(RedisModuleIO *io, uint64_t value);
    uint64_t RedisModule_LoadUnsigned(RedisModuleIO *io);
    void RedisModule_SaveSigned(RedisModuleIO *io, int64_t value);
    int64_t RedisModule_LoadSigned(RedisModuleIO *io);
    void RedisModule_SaveString(RedisModuleIO *io, RedisModuleString *s);
    void RedisModule_SaveStringBuffer(RedisModuleIO *io, const char *str, size_t len);
    RedisModuleString *RedisModule_LoadString(RedisModuleIO *io);
    char *RedisModule_LoadStringBuffer(RedisModuleIO *io, size_t *lenptr);
    void RedisModule_SaveDouble(RedisModuleIO *io, double value);
    double RedisModule_LoadDouble(RedisModuleIO *io);

这些函数不需要对模块进行任何错误检查，总是能够假定成功调用。

例如，设想我有一个原生类型，它实现了一个double类型值的数组，具有以下结构：

    struct double_array {
        size_t count;
        double *values;
    };

我的`rdb_save` 方法可能如下所示：

    void DoubleArrayRDBSave(RedisModuleIO *io, void *ptr) {
        struct dobule_array *da = ptr;
        RedisModule_SaveUnsigned(io,da->count);
        for (size_t j = 0; j < da->count; j++)
            RedisModule_SaveDouble(io,da->values[j]);
    }

我们要做的是存储每个double值的元素，所以当我们稍后必须去在 `rdb_load` 方法中加载结构时，我们将做如下的事情：

    void *DoubleArrayRDBLoad(RedisModuleIO *io, int encver) {
        if (encver != DOUBLE_ARRAY_ENC_VER) {
            /* We should actually log an error here, or try to implement
               the ability to load older versions of our data structure. */
            return NULL;
        }
    
        struct double_array *da;
        da = RedisModule_Alloc(sizeof(*da));
        da->count = RedisModule_LoadUnsigned(io);
        da->values = RedisModule_Alloc(da->count * sizeof(double));
        for (size_t j = 0; j < da->count; j++)
            da->values = RedisModule_LoadDouble(io);
        return da;
    }

加载回调函数只是将我们存储在RDB文件中的数据重建回原来的数据结构。

请注意，尽管没有从磁盘写操作和读操作的API没有的错误处理，但是加载回调函数仍然能在出错时返回NULL，以防读操作没有正确执行。在这种情况下，Redis仅仅会这样。

AOF重写
---

    void RedisModule_EmitAOF(RedisModuleIO *io, const char *cmdname, const char *fmt, ...);

处理多种编码
---

    WORK IN PROGRESS

分配内存
---

模块数据类型应该尝试使用 `RedisModule_Alloc()` 函数族来分配，重新分配和释放用于实现原生数据结构的堆内存。（详细细节请查看其他Redis模块的文档）

这不仅是为了Redis能够有力的说明内存被模块使用，而且还有更多的优点：

* Redis使用 `jemalloc` 分配器，通常可以防止使用libc分配器所造成的内存碎片问题。
* 当从RDB文件中加载字符串时，原生类型API能够直接返回用 `RedisModule_Alloc()` 分配的字符串，以便模块可以直接连接这片内存到数据结构的表示上，避免一个进行无用的拷贝操作。

即使你使用外部库是实现你的数据结构，但是由模块API提供的内存分配函数能恰好与`malloc()`, `realloc()`, `free()` 和`strdup()` 兼容，因此为了使用这些函数而更换库是不重要的。

当你有一个使用libc库的 `malloc()` 的外部库，并且你想去避免手动的用Redis模块API调用代替所有调用，那么有一种方法是使用简单的宏定义使用Redis 的API调用替换libc的调用。方法如下所示：

    #define malloc RedisModule_Alloc
    #define realloc RedisModule_Realloc
    #define free RedisModule_Free
    #define strdup RedisModule_Strdup

但是请记住，混合使用libc调用和Redis API调用将会导致出错和崩溃，因此如果你使用宏定义替换，你需要确保所有的调用都被正确替换，并且有被替换调用的代码能够从不交叉混合，例如，尝试调用`RedisModule_Free()` 函数确使用一个由 `malloc()` 分配的指针。