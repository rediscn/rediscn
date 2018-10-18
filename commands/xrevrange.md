---
layout: commands
title: xrevrange 命令
permalink: commands/xrevrange.html
disqusIdentifier: command_xrevrange
disqusUrl: http://redis.cn/commands/xrevrange.html
commandsType: streams
discuzTid: 13926
---

This command is exactly like `XRANGE`, but with the notable difference of
returning the entries in reverse order, and also taking the start-end
range in reverse order: in `XREVRANGE` you need to state the *end* ID
and later the *start* ID, and the command will produce all the element
between (or exactly like) the two IDs, starting from the *end* side.

So for instance, to get all the elements from the higher ID to the lower
ID one could use:

    XREVRANGE + -

Similarly to get just the last element added into the stream it is
enough to send:

    XREVRANGE + - COUNT 1

## Iterating with XREVRANGE

Like `XRANGE` this command can be used in order to iterate the whole
stream content, however note that in this case, the next command calls
should use the ID of the last entry, with the sequence number decremneted
by one. However if the sequence number is already 0, the time part of the
ID should be decremented by 1, and the sequence part should be set to
the maxium possible sequence number, that is, 18446744073709551615, or
could be omitted at all, and the command will automatically assume it to
be such a number (see `XRANGE` for more info about incomplete IDs).

Example:

```
> XREVRANGE writers + - COUNT 2
1) 1) 1526985723355-0
   2) 1) "name"
      2) "Ngozi"
      3) "surname"
      4) "Adichie"
2) 1) 1526985712947-0
   2) 1) "name"
      2) "Agatha"
      3) "surname"
      4) "Christie"
```

The last ID returned is `1526985712947-0`, since the sequence number is
already zero, the next ID I'll use instead of the `+` special ID will
be `1526985712946-18446744073709551615`, or just `18446744073709551615`:

```
> XREVRANGE writers 1526985712946-18446744073709551615 - COUNT 2
1) 1) 1526985691746-0
   2) 1) "name"
      2) "Toni"
      3) "surname"
      4) "Morris"
2) 1) 1526985685298-0
   2) 1) "name"
      2) "Jane"
      3) "surname"
      4) "Austen"
```

And so for until the iteration is complete and no result is returned.
See the `XRANGE` page about iterating for more information.

## 返回值

[array-reply](/topics/protocol.html#array-reply)：


The command returns the entries with IDs matching the specified range,
from the higher ID to the lower ID matching.
The returned entries are complete, that means that the ID and all the fields
they are composed are returned. Moreover the entries are returned with
their fields and values in the exact same order as `XADD` added them.

## 例子

	redis> XADD writers * name Virginia surname Woolf
	"1539863673862-0"
	redis> XADD writers * name Jane surname Austen
	"1539863673863-0"
	redis> XADD writers * name Toni surname Morris
	"1539863673865-0"
	redis> XADD writers * name Agatha surname Christie
	"1539863673866-0"
	redis> XADD writers * name Ngozi surname Adichie
	"1539863673867-0"
	redis> XLEN writers
	(integer) 5
	redis> XREVRANGE writers + - COUNT 1
	1) 1) "1539863673867-0"
	   2) 1) "name"
		  2) "Ngozi"
		  3) "surname"
		  4) "Adichie"
	redis> 