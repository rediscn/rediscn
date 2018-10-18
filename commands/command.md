---
layout: commands
title: command 命令
permalink: commands/command.html
disqusIdentifier: command_command
disqusUrl: http://redis.cn/commands/command.html
commandsType: server
discuzTid: 935
---

返回Redis所有命令数组。

Cluster clients must be aware of key positions in commands so commands can go to matching instances,
but Redis commands vary between accepting one key,
multiple keys, or even multiple keys separated by other data.

You can use `COMMAND` to cache a mapping between commands and key positions for
each command to enable exact routing of commands to cluster instances.

## Nested Result Array
Each top-level result contains six nested results.  Each nested result is:

  - command name
  - command arity specification
  - nested @array-reply of command flags
  - position of first key in argument list
  - position of last key in argument list
  - step count for locating repeating keys

### Command Name

Command name is the command returned as a lowercase string.

### Command Arity

<table style="width:50%">
<tr><td>
<pre>
<code>1) 1) "get"
   2) (integer) 2
   3) 1) readonly
   4) (integer) 1
   5) (integer) 1
   6) (integer) 1
</code>
</pre>
</td>
<td>
<pre>
<code>1) 1) "mget"
   2) (integer) -2
   3) 1) readonly
   4) (integer) 1
   5) (integer) -1
   6) (integer) 1
</code>
</pre>
</td></tr>
</table>

Command arity follows a simple pattern:

  - positive if command has fixed number of required arguments.
  - negative if command has minimum number of required arguments, but may have more.

Command arity _includes_ counting the command name itself.

Examples:

  - `GET` arity is 2 since the command only accepts one
argument and always has the format `GET _key_`.
  - `MGET` arity is -2 since the command accepts at a minimum
one argument, but up to an unlimited number: `MGET _key1_ [key2] [key3] ...`.

Also note with `MGET`, the -1 value for "last key position" means the list
of keys may have unlimited length.

### Flags
Command flags is @array-reply containing one or more status replies:

  - *write* - command may result in modifications
  - *readonly* - command will never modify keys
  - *denyoom* - reject command if currently OOM
  - *admin* - server admin command
  - *pubsub* - pubsub-related command
  - *noscript* - deny this command from scripts
  - *random* - command has random results, dangerous for scripts
  - *sort\_for\_script* - if called from script, sort output
  - *loading* - allow command while database is loading
  - *stale* - allow command while replica has stale data
  - *skip_monitor* - do not show this command in MONITOR
  - *asking* - cluster related - accept even if importing
  - *fast* - command operates in constant or log(N) time.  Used for latency monitoring.
  - *movablekeys* - keys have no pre-determined position.  You must discover keys yourself.


### Movable Keys

```
1) 1) "sort"
   2) (integer) -2
   3) 1) write
      2) denyoom
      3) movablekeys
   4) (integer) 1
   5) (integer) 1
   6) (integer) 1
```

Some Redis commands have no predetermined key locations.  For those commands,
flag `movablekeys` is added to the command flags @array-reply.  Your Redis
Cluster client needs to parse commands marked `movabkeleys` to locate all relevant key positions.

Complete list of commands currently requiring key location parsing:

  - `SORT` - optional `STORE` key, optional `BY` weights, optional `GET` keys
  - `ZUNIONSTORE` - keys stop when `WEIGHT` or `AGGREGATE` starts
  - `ZINTERSTORE` - keys stop when `WEIGHT` or `AGGREGATE` starts
  - `EVAL` - keys stop after `numkeys` count arguments
  - `EVALSHA` - keys stop after `numkeys` count arguments

Also see `COMMAND GETKEYS` for getting your Redis server tell you where keys
are in any given command.

### First Key in Argument List

For most commands the first key is position 1.  Position 0 is
always the command name itself.


### Last Key in Argument List

Redis commands usually accept one key, two keys, or an unlimited number of keys.

If a command accepts one key, the first key and last key positions is 1.

If a command accepts two keys (e.g. `BRPOPLPUSH`, `SMOVE`, `RENAME`, ...) then the
last key position is the location of the last key in the argument list.

If a command accepts an unlimited number of keys, the last key position is -1.


### Step Count

<table style="width:50%">
<tr><td>
<pre>
<code>1) 1) "mset"
   2) (integer) -3
   3) 1) write
      2) denyoom
   4) (integer) 1
   5) (integer) -1
   6) (integer) 2
</code>
</pre>
</td>
<td>
<pre>
<code>1) 1) "mget"
   2) (integer) -2
   3) 1) readonly
   4) (integer) 1
   5) (integer) -1
   6) (integer) 1
</code>
</pre>
</td></tr>
</table>

Key step count allows us to find key positions in commands
like `MSET` where the format is `MSET _key1_ _val1_ [key2] [val2] [key3] [val3]...`.

In the case of `MSET`, keys are every other position so the step value is 2.  Compare
with `MGET` above where the step value is just 1.



## 返回值

[array-reply](/topics/protocol.html#array-reply): nested list of command details.  Commands are returned
in random order.

## 例子

	redis> COMMAND
	1) 1) "sadd"
		 2) (integer) -3
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	  2) 1) "lrange"
		 2) (integer) 4
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	  3) 1) "time"
		 2) (integer) 1
		 3) 1) "random"
			2) "fast"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	  4) 1) "spop"
		 2) (integer) -2
		 3) 1) "write"
			2) "random"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	  5) 1) "hvals"
		 2) (integer) 2
		 3) 1) "readonly"
			2) "sort_for_script"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	  6) 1) "debug"
		 2) (integer) -2
		 3) 1) "admin"
			2) "noscript"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	  7) 1) "georadius_ro"
		 2) (integer) -6
		 3) 1) "readonly"
			2) "movablekeys"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	  8) 1) "select"
		 2) (integer) 2
		 3) 1) "loading"
			2) "fast"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	  9) 1) "auth"
		 2) (integer) 2
		 3) 1) "noscript"
			2) "loading"
			3) "stale"
			4) "fast"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 10) 1) "mset"
		 2) (integer) -3
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) -1
		 6) (integer) 2
	 11) 1) "zremrangebylex"
		 2) (integer) 4
		 3) 1) "write"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 12) 1) "rename"
		 2) (integer) 3
		 3) 1) "write"
		 4) (integer) 1
		 5) (integer) 2
		 6) (integer) 1
	 13) 1) "xreadgroup"
		 2) (integer) -3
		 3) 1) "write"
			2) "noscript"
			3) "movablekeys"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 14) 1) "xrange"
		 2) (integer) -4
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 15) 1) "georadiusbymember_ro"
		 2) (integer) -5
		 3) 1) "readonly"
			2) "movablekeys"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 16) 1) "xadd"
		 2) (integer) -5
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 17) 1) "srem"
		 2) (integer) -3
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 18) 1) "punsubscribe"
		 2) (integer) -1
		 3) 1) "pubsub"
			2) "noscript"
			3) "loading"
			4) "stale"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 19) 1) "hmget"
		 2) (integer) -3
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 20) 1) "sinterstore"
		 2) (integer) -3
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) -1
		 6) (integer) 1
	 21) 1) "xdel"
		 2) (integer) -2
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 22) 1) "blpop"
		 2) (integer) -3
		 3) 1) "write"
			2) "noscript"
		 4) (integer) 1
		 5) (integer) -2
		 6) (integer) 1
	 23) 1) "zrangebyscore"
		 2) (integer) -4
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 24) 1) "decr"
		 2) (integer) 2
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 25) 1) "touch"
		 2) (integer) -2
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 26) 1) "sismember"
		 2) (integer) 3
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 27) 1) "object"
		 2) (integer) -2
		 3) 1) "readonly"
		 4) (integer) 2
		 5) (integer) 2
		 6) (integer) 1
	 28) 1) "sunion"
		 2) (integer) -2
		 3) 1) "readonly"
			2) "sort_for_script"
		 4) (integer) 1
		 5) (integer) -1
		 6) (integer) 1
	 29) 1) "type"
		 2) (integer) 2
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 30) 1) "persist"
		 2) (integer) 2
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 31) 1) "xack"
		 2) (integer) -3
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 32) 1) "asking"
		 2) (integer) 1
		 3) 1) "fast"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 33) 1) "randomkey"
		 2) (integer) 1
		 3) 1) "readonly"
			2) "random"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 34) 1) "sync"
		 2) (integer) 1
		 3) 1) "readonly"
			2) "admin"
			3) "noscript"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 35) 1) "incr"
		 2) (integer) 2
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 36) 1) "slaveof"
		 2) (integer) 3
		 3) 1) "admin"
			2) "noscript"
			3) "stale"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 37) 1) "zadd"
		 2) (integer) -4
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 38) 1) "bitfield"
		 2) (integer) -2
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 39) 1) "module"
		 2) (integer) -2
		 3) 1) "admin"
			2) "noscript"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 40) 1) "psubscribe"
		 2) (integer) -2
		 3) 1) "pubsub"
			2) "noscript"
			3) "loading"
			4) "stale"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 41) 1) "getrange"
		 2) (integer) 4
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 42) 1) "bzpopmin"
		 2) (integer) -2
		 3) 1) "write"
			2) "noscript"
			3) "fast"
		 4) (integer) 1
		 5) (integer) -2
		 6) (integer) 1
	 43) 1) "lpush"
		 2) (integer) -3
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 44) 1) "bgrewriteaof"
		 2) (integer) 1
		 3) 1) "admin"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 45) 1) "replconf"
		 2) (integer) -1
		 3) 1) "admin"
			2) "noscript"
			3) "loading"
			4) "stale"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 46) 1) "eval"
		 2) (integer) -3
		 3) 1) "noscript"
			2) "movablekeys"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 47) 1) "pfmerge"
		 2) (integer) -2
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) -1
		 6) (integer) 1
	 48) 1) "incrby"
		 2) (integer) 3
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 49) 1) "zincrby"
		 2) (integer) 4
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 50) 1) "sscan"
		 2) (integer) -3
		 3) 1) "readonly"
			2) "random"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 51) 1) "substr"
		 2) (integer) 4
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 52) 1) "zremrangebyrank"
		 2) (integer) 4
		 3) 1) "write"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 53) 1) "append"
		 2) (integer) 3
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 54) 1) "zpopmax"
		 2) (integer) -2
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) -1
		 6) (integer) 1
	 55) 1) "bitpos"
		 2) (integer) -3
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 56) 1) "hstrlen"
		 2) (integer) 3
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 57) 1) "monitor"
		 2) (integer) 1
		 3) 1) "admin"
			2) "noscript"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 58) 1) "post"
		 2) (integer) -1
		 3) 1) "loading"
			2) "stale"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 59) 1) "lset"
		 2) (integer) 4
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 60) 1) "set"
		 2) (integer) -3
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 61) 1) "brpop"
		 2) (integer) -3
		 3) 1) "write"
			2) "noscript"
		 4) (integer) 1
		 5) (integer) -2
		 6) (integer) 1
	 62) 1) "zrevrank"
		 2) (integer) 3
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 63) 1) "georadius"
		 2) (integer) -6
		 3) 1) "write"
			2) "movablekeys"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 64) 1) "sdiffstore"
		 2) (integer) -3
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) -1
		 6) (integer) 1
	 65) 1) "lpop"
		 2) (integer) 2
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 66) 1) "ping"
		 2) (integer) -1
		 3) 1) "stale"
			2) "fast"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 67) 1) "pfcount"
		 2) (integer) -2
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) -1
		 6) (integer) 1
	 68) 1) "zrangebylex"
		 2) (integer) -4
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 69) 1) "zrevrangebyscore"
		 2) (integer) -4
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 70) 1) "flushdb"
		 2) (integer) -1
		 3) 1) "write"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 71) 1) "sort"
		 2) (integer) -2
		 3) 1) "write"
			2) "denyoom"
			3) "movablekeys"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 72) 1) "bzpopmax"
		 2) (integer) -2
		 3) 1) "write"
			2) "noscript"
			3) "fast"
		 4) (integer) 1
		 5) (integer) -2
		 6) (integer) 1
	 73) 1) "move"
		 2) (integer) 3
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 74) 1) "georadiusbymember"
		 2) (integer) -5
		 3) 1) "write"
			2) "movablekeys"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 75) 1) "config"
		 2) (integer) -2
		 3) 1) "admin"
			2) "loading"
			3) "stale"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 76) 1) "xrevrange"
		 2) (integer) -4
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 77) 1) "zunionstore"
		 2) (integer) -4
		 3) 1) "write"
			2) "denyoom"
			3) "movablekeys"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 78) 1) "geopos"
		 2) (integer) -2
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 79) 1) "hdel"
		 2) (integer) -3
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 80) 1) "hincrby"
		 2) (integer) 4
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 81) 1) "cluster"
		 2) (integer) -2
		 3) 1) "admin"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 82) 1) "geodist"
		 2) (integer) -4
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 83) 1) "bgsave"
		 2) (integer) -1
		 3) 1) "admin"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 84) 1) "unsubscribe"
		 2) (integer) -1
		 3) 1) "pubsub"
			2) "noscript"
			3) "loading"
			4) "stale"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 85) 1) "renamenx"
		 2) (integer) 3
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 2
		 6) (integer) 1
	 86) 1) "unwatch"
		 2) (integer) 1
		 3) 1) "noscript"
			2) "fast"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 87) 1) "echo"
		 2) (integer) 2
		 3) 1) "fast"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 88) 1) "flushall"
		 2) (integer) -1
		 3) 1) "write"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 89) 1) "host:"
		 2) (integer) -1
		 3) 1) "loading"
			2) "stale"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 90) 1) "hkeys"
		 2) (integer) 2
		 3) 1) "readonly"
			2) "sort_for_script"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 91) 1) "zlexcount"
		 2) (integer) 4
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 92) 1) "xpending"
		 2) (integer) -3
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 93) 1) "hscan"
		 2) (integer) -3
		 3) 1) "readonly"
			2) "random"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 94) 1) "setnx"
		 2) (integer) 3
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 95) 1) "lastsave"
		 2) (integer) 1
		 3) 1) "random"
			2) "fast"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 96) 1) "memory"
		 2) (integer) -2
		 3) 1) "readonly"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 97) 1) "getbit"
		 2) (integer) 3
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	 98) 1) "keys"
		 2) (integer) 2
		 3) 1) "readonly"
			2) "sort_for_script"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	 99) 1) "hexists"
		 2) (integer) 3
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	100) 1) "migrate"
		 2) (integer) -6
		 3) 1) "write"
			2) "movablekeys"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	101) 1) "expire"
		 2) (integer) 3
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	102) 1) "geohash"
		 2) (integer) -2
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	103) 1) "role"
		 2) (integer) 1
		 3) 1) "noscript"
			2) "loading"
			3) "stale"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	104) 1) "unlink"
		 2) (integer) -2
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) -1
		 6) (integer) 1
	105) 1) "zcard"
		 2) (integer) 2
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	106) 1) "save"
		 2) (integer) 1
		 3) 1) "admin"
			2) "noscript"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	107) 1) "script"
		 2) (integer) -2
		 3) 1) "noscript"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	108) 1) "hsetnx"
		 2) (integer) 4
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	109) 1) "rpush"
		 2) (integer) -3
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	110) 1) "xclaim"
		 2) (integer) -5
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	111) 1) "rpushx"
		 2) (integer) -3
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	112) 1) "hset"
		 2) (integer) -4
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	113) 1) "setrange"
		 2) (integer) 4
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	114) 1) "zscore"
		 2) (integer) 3
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	115) 1) "hget"
		 2) (integer) 3
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	116) 1) "lpushx"
		 2) (integer) -3
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	117) 1) "linsert"
		 2) (integer) 5
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	118) 1) "multi"
		 2) (integer) 1
		 3) 1) "noscript"
			2) "fast"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	119) 1) "pfadd"
		 2) (integer) -2
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	120) 1) "scan"
		 2) (integer) -2
		 3) 1) "readonly"
			2) "random"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	121) 1) "latency"
		 2) (integer) -2
		 3) 1) "admin"
			2) "noscript"
			3) "loading"
			4) "stale"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	122) 1) "xread"
		 2) (integer) -3
		 3) 1) "readonly"
			2) "noscript"
			3) "movablekeys"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	123) 1) "ltrim"
		 2) (integer) 4
		 3) 1) "write"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	124) 1) "ttl"
		 2) (integer) 2
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	125) 1) "psync"
		 2) (integer) 3
		 3) 1) "readonly"
			2) "admin"
			3) "noscript"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	126) 1) "msetnx"
		 2) (integer) -3
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) -1
		 6) (integer) 2
	127) 1) "sinter"
		 2) (integer) -2
		 3) 1) "readonly"
			2) "sort_for_script"
		 4) (integer) 1
		 5) (integer) -1
		 6) (integer) 1
	128) 1) "zcount"
		 2) (integer) 4
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	129) 1) "zrevrange"
		 2) (integer) -4
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	130) 1) "rpop"
		 2) (integer) 2
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	131) 1) "dump"
		 2) (integer) 2
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	132) 1) "pttl"
		 2) (integer) 2
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	133) 1) "bitcount"
		 2) (integer) -2
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	134) 1) "decrby"
		 2) (integer) 3
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	135) 1) "xgroup"
		 2) (integer) -2
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 2
		 5) (integer) 2
		 6) (integer) 1
	136) 1) "hincrbyfloat"
		 2) (integer) 4
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	137) 1) "lindex"
		 2) (integer) 3
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	138) 1) "client"
		 2) (integer) -2
		 3) 1) "admin"
			2) "noscript"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	139) 1) "pexpireat"
		 2) (integer) 3
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	140) 1) "xinfo"
		 2) (integer) -2
		 3) 1) "readonly"
		 4) (integer) 2
		 5) (integer) 2
		 6) (integer) 1
	141) 1) "zpopmin"
		 2) (integer) -2
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) -1
		 6) (integer) 1
	142) 1) "hmset"
		 2) (integer) -4
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	143) 1) "pfdebug"
		 2) (integer) -3
		 3) 1) "write"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	144) 1) "brpoplpush"
		 2) (integer) 4
		 3) 1) "write"
			2) "denyoom"
			3) "noscript"
		 4) (integer) 1
		 5) (integer) 2
		 6) (integer) 1
	145) 1) "sdiff"
		 2) (integer) -2
		 3) 1) "readonly"
			2) "sort_for_script"
		 4) (integer) 1
		 5) (integer) -1
		 6) (integer) 1
	146) 1) "zrem"
		 2) (integer) -3
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	147) 1) "command"
		 2) (integer) 0
		 3) 1) "loading"
			2) "stale"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	148) 1) "publish"
		 2) (integer) 3
		 3) 1) "pubsub"
			2) "loading"
			3) "stale"
			4) "fast"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	149) 1) "exists"
		 2) (integer) -2
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) -1
		 6) (integer) 1
	150) 1) "swapdb"
		 2) (integer) 3
		 3) 1) "write"
			2) "fast"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	151) 1) "del"
		 2) (integer) -2
		 3) 1) "write"
		 4) (integer) 1
		 5) (integer) -1
		 6) (integer) 1
	152) 1) "getset"
		 2) (integer) 3
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	153) 1) "rpoplpush"
		 2) (integer) 3
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) 2
		 6) (integer) 1
	154) 1) "setbit"
		 2) (integer) 4
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	155) 1) "hlen"
		 2) (integer) 2
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	156) 1) "incrbyfloat"
		 2) (integer) 3
		 3) 1) "write"
			2) "denyoom"
			3) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	157) 1) "zrange"
		 2) (integer) -4
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	158) 1) "setex"
		 2) (integer) 4
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	159) 1) "psetex"
		 2) (integer) 4
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	160) 1) "shutdown"
		 2) (integer) -1
		 3) 1) "admin"
			2) "loading"
			3) "stale"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	161) 1) "evalsha"
		 2) (integer) -3
		 3) 1) "noscript"
			2) "movablekeys"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	162) 1) "scard"
		 2) (integer) 2
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	163) 1) "restore-asking"
		 2) (integer) -4
		 3) 1) "write"
			2) "denyoom"
			3) "asking"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	164) 1) "srandmember"
		 2) (integer) -2
		 3) 1) "readonly"
			2) "random"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	165) 1) "hgetall"
		 2) (integer) 2
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	166) 1) "strlen"
		 2) (integer) 2
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	167) 1) "wait"
		 2) (integer) 3
		 3) 1) "noscript"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	168) 1) "watch"
		 2) (integer) -2
		 3) 1) "noscript"
			2) "fast"
		 4) (integer) 1
		 5) (integer) -1
		 6) (integer) 1
	169) 1) "get"
		 2) (integer) 2
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	170) 1) "pubsub"
		 2) (integer) -2
		 3) 1) "pubsub"
			2) "random"
			3) "loading"
			4) "stale"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	171) 1) "dbsize"
		 2) (integer) 1
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	172) 1) "smembers"
		 2) (integer) 2
		 3) 1) "readonly"
			2) "sort_for_script"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	173) 1) "zrevrangebylex"
		 2) (integer) -4
		 3) 1) "readonly"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	174) 1) "subscribe"
		 2) (integer) -2
		 3) 1) "pubsub"
			2) "noscript"
			3) "loading"
			4) "stale"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	175) 1) "zinterstore"
		 2) (integer) -4
		 3) 1) "write"
			2) "denyoom"
			3) "movablekeys"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	176) 1) "smove"
		 2) (integer) 4
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 2
		 6) (integer) 1
	177) 1) "readonly"
		 2) (integer) 1
		 3) 1) "fast"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	178) 1) "zremrangebyscore"
		 2) (integer) 4
		 3) 1) "write"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	179) 1) "sunionstore"
		 2) (integer) -3
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) -1
		 6) (integer) 1
	180) 1) "llen"
		 2) (integer) 2
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	181) 1) "discard"
		 2) (integer) 1
		 3) 1) "noscript"
			2) "fast"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	182) 1) "info"
		 2) (integer) -1
		 3) 1) "loading"
			2) "stale"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	183) 1) "pfselftest"
		 2) (integer) 1
		 3) 1) "admin"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	184) 1) "bitop"
		 2) (integer) -4
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 2
		 5) (integer) -1
		 6) (integer) 1
	185) 1) "pexpire"
		 2) (integer) 3
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	186) 1) "xlen"
		 2) (integer) 2
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	187) 1) "mget"
		 2) (integer) -2
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) -1
		 6) (integer) 1
	188) 1) "xtrim"
		 2) (integer) -2
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	189) 1) "exec"
		 2) (integer) 1
		 3) 1) "noscript"
			2) "skip_monitor"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	190) 1) "zscan"
		 2) (integer) -3
		 3) 1) "readonly"
			2) "random"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	191) 1) "zrank"
		 2) (integer) 3
		 3) 1) "readonly"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	192) 1) "geoadd"
		 2) (integer) -5
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	193) 1) "expireat"
		 2) (integer) 3
		 3) 1) "write"
			2) "fast"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	194) 1) "slowlog"
		 2) (integer) -2
		 3) 1) "admin"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	195) 1) "readwrite"
		 2) (integer) 1
		 3) 1) "fast"
		 4) (integer) 0
		 5) (integer) 0
		 6) (integer) 0
	196) 1) "lrem"
		 2) (integer) 4
		 3) 1) "write"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	197) 1) "restore"
		 2) (integer) -4
		 3) 1) "write"
			2) "denyoom"
		 4) (integer) 1
		 5) (integer) 1
		 6) (integer) 1
	redis> 
