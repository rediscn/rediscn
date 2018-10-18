var rediscn_commands={
  "APPEND": {
    "summary": "追加一个值到key上",
    "complexity": "O(1)。均摊时间复杂度是O(1)， 因为redis用的动态字符串的库在每次分配空间的时候会增加一倍的可用空闲空间，所以在添加的value较小而且已经存在的 value是任意大小的情况下，均摊时间复杂度是O(1) 。",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "value",
        "type": "string"
      }
    ],
    "since": "2.0.0",
    "group": "string"
  },
  "AUTH": {
    "summary": "验证服务器",
    "arguments": [
      {
        "name": "password",
        "type": "string"
      }
    ],
    "since": "1.0.0",
    "group": "connection"
  },
  "BGREWRITEAOF": {
    "summary": "异步重写追加文件",
    "since": "1.0.0",
    "group": "server"
  },
  "BGSAVE": {
    "summary": "异步保存数据集到磁盘上",
    "since": "1.0.0",
    "group": "server"
  },
  "BITCOUNT": {
    "summary": "统计字符串指定起始位置的字节数",
    "complexity": "O(N)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": ["start", "end"],
        "type": ["integer", "integer"],
        "optional": true
      }
    ],
    "since": "2.6.0",
    "group": "string"
  },
  "BITFIELD": {
    "summary": "Perform arbitrary bitfield integer operations on strings",
    "complexity": "O(1) for each subcommand specified",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "command": "GET",
        "name": ["type", "offset"],
        "type": ["type", "integer"],
        "optional": true
      },
      {
        "command": "SET",
        "name": ["type", "offset", "value"],
        "type": ["type", "integer", "integer"],
        "optional": true
      },
      {
        "command": "INCRBY",
        "name": ["type", "offset", "increment"],
        "type": ["type", "integer", "integer"],
        "optional": true
      },
      {
        "command": "OVERFLOW",
        "type": "enum",
        "enum": ["OVERFLOW WRAP", "SAT", "FAIL"],
        "optional": true
      }
    ],
    "since": "3.2.0",
    "group": "string"
  },
  "BITOP": {
    "summary": "在字符串上按位执行运算",
    "complexity": "O(N)",
    "arguments": [
      {
        "name": "operation",
        "type": "string"
      },
      {
        "name": "destkey",
        "type": "key"
      },
      {
        "name": "key",
        "type": "key",
        "multiple": true
      }
    ],
    "since": "2.6.0",
    "group": "string"
  },
  "BITPOS": {
    "summary": "在字符串中查找第一个满足条件的位置(bit)",
    "complexity": "O(N)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "bit",
        "type": "integer"
      },
      {
        "name": "start",
        "type": "integer",
        "optional": true
      },
      {
        "name": "end",
        "type": "integer",
        "optional": true
      }
    ],
    "since": "2.8.7",
    "group": "string"
  },
  "BLPOP": {
    "summary": "删除，并获得该列表中的第一元素，或阻塞，直到有一个可用",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key",
        "multiple": true
      },
      {
        "name": "timeout",
        "type": "integer"
      }
    ],
    "since": "2.0.0",
    "group": "list"
  },
  "BRPOP": {
    "summary": "删除，并获得该列表中的最后一个元素，或阻塞，直到有一个可用",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key",
        "multiple": true
      },
      {
        "name": "timeout",
        "type": "integer"
      }
    ],
    "since": "2.0.0",
    "group": "list"
  },
  "BRPOPLPUSH": {
    "summary": "弹出一个列表的值，将它推到另一个列表，并返回它;或阻塞，直到有一个可用",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "source",
        "type": "key"
      },
      {
        "name": "destination",
        "type": "key"
      },
      {
        "name": "timeout",
        "type": "integer"
      }
    ],
    "since": "2.2.0",
    "group": "list"
  },
  "BZPOPMIN": {
    "summary": "Remove and return the member with the lowest score from one or more sorted sets, or block until one is available",
    "complexity": "O(log(N)) with N being the number of elements in the sorted set.",
    "arguments": [
      {
        "name": "key",
        "type": "key",
        "multiple": true
      },
      {
        "name": "timeout",
        "type": "integer"
      }
    ],
    "since": "5.0.0",
    "group": "sorted_set"
  },
  "BZPOPMAX": {
    "summary": "Remove and return the member with the highest score from one or more sorted sets, or block until one is available",
    "complexity": "O(log(N)) with N being the number of elements in the sorted set.",
    "arguments": [
      {
        "name": "key",
        "type": "key",
        "multiple": true
      },
      {
        "name": "timeout",
        "type": "integer"
      }
    ],
    "since": "5.0.0",
    "group": "sorted_set"
  },
  "CLIENT ID": {
    "summary": "Returns the client ID for the current connection",
    "complexity": "O(1)",
    "since": "5.0.0",
    "group": "server"
  },
  "CLIENT KILL": {
    "summary": "关闭客户端连接",
    "complexity": "O(N) N是客户端连接数量",
    "arguments": [
      {
        "name": "ip:port",
        "type": "string",
        "optional": true
      },
      {
        "command": "ID",
        "name": "client-id",
        "type": "integer",
        "optional": true
      },
      {
        "command": "TYPE",
        "type": "enum",
        "enum": ["normal", "slave", "pubsub"],
        "optional": true
      },
      {
        "command": "ADDR",
        "name": "ip:port",
        "type": "string",
        "optional": true
      },
      {
        "command": "SKIPME",
        "name": "yes/no",
        "type": "string",
        "optional": true
      }
    ],
    "since": "2.4.0",
    "group": "server"
  },
  "CLIENT LIST": {
    "summary": "获得客户端连接列表",
    "complexity": "O(N) N是客户端连接数量",
    "since": "2.4.0",
    "group": "server"
  },
  "CLIENT GETNAME": {
    "summary": "获得当前连接名称",
    "complexity": "O(1)",
    "since": "2.6.9",
    "group": "server"
  },
  "CLIENT PAUSE": {
    "summary": "暂停处理客户端命令",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "timeout",
        "type": "integer"
      }
    ],
    "since": "2.9.50",
    "group": "server"
  },
  "CLIENT REPLY": {
    "summary": "Instruct the server whether to reply to commands",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "reply-mode",
        "type": "enum",
        "enum": ["ON", "OFF", "SKIP"]
      }
    ],
    "since": "3.2",
    "group": "server"
  },
  "CLIENT SETNAME": {
    "summary": "设置当前连接的名字",
    "complexity": "O(1)",
    "since": "2.6.9",
    "arguments": [
      {
        "name": "connection-name",
        "type": "string"
      }
    ],
    "group": "server"
  },
  "CLIENT UNBLOCK": {
    "summary": "Unblock a client blocked in a blocking command from a different connection",
    "complexity": "O(log N) where N is the number of client connections",
    "arguments": [
      {
        "name": "client-id",
        "type": "string"
      },
      {
        "name": "unblock-type",
        "type": "enum",
        "enum": ["TIMEOUT", "ERROR"],
        "optional": true
      }
    ],
    "since": "5.0.0",
    "group": "server"
  },
  "CLUSTER ADDSLOTS": {
    "summary": "为新的node分配哈希插槽（hash slots）",
    "complexity": "O(N) N是参数的哈希插槽总数",
    "arguments": [
      {
        "name": "slot",
        "type": "integer",
        "multiple": true
      }
    ],
    "since": "3.0.0",
    "group": "cluster"
  },
  "CLUSTER COUNT-FAILURE-REPORTS": {
    "summary": "返回给定节点的故障报告的数目",
    "complexity": "O(N) N是故障报告的数量",
    "arguments": [
      {
        "name": "node-id",
        "type": "string"
      }
    ],
    "since": "3.0.0",
    "group": "cluster"
  },
  "CLUSTER COUNTKEYSINSLOT": {
    "summary": "返回指定的哈希槽中的本地键的数目",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "slot",
        "type": "integer"
      }
    ],
    "since": "3.0.0",
    "group": "cluster"
  },
  "CLUSTER DELSLOTS": {
    "summary": "Set hash slots as unbound in receiving node",
    "complexity": "O(N) where N is the total number of hash slot arguments",
    "arguments": [
      {
        "name": "slot",
        "type": "integer",
        "multiple": true
      }
    ],
    "since": "3.0.0",
    "group": "cluster"
  },
  "CLUSTER FAILOVER": {
    "summary": "Forces a slave to perform a manual failover of its master.",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "options",
        "type": "enum",
        "enum": ["FORCE","TAKEOVER"],
        "optional": true
      }
    ],
    "since": "3.0.0",
    "group": "cluster"
  },
  "CLUSTER FORGET": {
    "summary": "Remove a node from the nodes table",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "node-id",
        "type": "string"
      }
    ],
    "since": "3.0.0",
    "group": "cluster"
  },
  "CLUSTER GETKEYSINSLOT": {
    "summary": "Return local key names in the specified hash slot",
    "complexity": "O(log(N)) where N is the number of requested keys",
    "arguments": [
      {
        "name": "slot",
        "type": "integer"
      },
      {
        "name": "count",
        "type": "integer"
      }
    ],
    "since": "3.0.0",
    "group": "cluster"
  },
  "CLUSTER INFO": {
    "summary": "Provides info about Redis Cluster node state",
    "complexity": "O(1)",
    "since": "3.0.0",
    "group": "cluster"
  },
  "CLUSTER KEYSLOT": {
    "summary": "Returns the hash slot of the specified key",
    "complexity": "O(N) where N is the number of bytes in the key",
    "arguments": [
      {
        "name": "key",
        "type": "string"
      }
    ],
    "since": "3.0.0",
    "group": "cluster"
  },
  "CLUSTER MEET": {
    "summary": "Force a node cluster to handshake with another node",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "ip",
        "type": "string"
      },
      {
        "name": "port",
        "type": "integer"
      }
    ],
    "since": "3.0.0",
    "group": "cluster"
  },
  "CLUSTER NODES": {
    "summary": "Get Cluster config for the node",
    "complexity": "O(N) where N is the total number of Cluster nodes",
    "since": "3.0.0",
    "group": "cluster"
  },
  "CLUSTER REPLICATE": {
    "summary": "Reconfigure a node as a slave of the specified master node",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "node-id",
        "type": "string"
      }
    ],
    "since": "3.0.0",
    "group": "cluster"
  },
  "CLUSTER RESET": {
    "summary": "Reset a Redis Cluster node",
    "complexity": "O(N) where N is the number of known nodes. The command may execute a FLUSHALL as a side effect.",
    "arguments": [
      {
        "name": "reset-type",
        "type": "enum",
        "enum": ["HARD", "SOFT"],
        "optional": true
      }
    ],
    "since": "3.0.0",
    "group": "cluster"
  },
  "CLUSTER SAVECONFIG": {
    "summary": "Forces the node to save cluster state on disk",
    "complexity": "O(1)",
    "since": "3.0.0",
    "group": "cluster"
  },
  "CLUSTER SET-CONFIG-EPOCH": {
    "summary": "Set the configuration epoch in a new node",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "config-epoch",
        "type": "integer"
      }
    ],
    "since": "3.0.0",
    "group": "cluster"
  },
  "CLUSTER SETSLOT": {
    "summary": "Bind an hash slot to a specific node",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "slot",
        "type": "integer"
      },
      {
        "name": "subcommand",
        "type": "enum",
        "enum": ["IMPORTING", "MIGRATING", "STABLE", "NODE"]
      },
      {
        "name": "node-id",
        "type": "string",
        "optional": true
      }
    ],
    "since": "3.0.0",
    "group": "cluster"
  },
  "CLUSTER SLAVES": {
    "summary": "List slave nodes of the specified master node",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "node-id",
        "type": "string"
      }
    ],
    "since": "3.0.0",
    "group": "cluster"
  },
  "CLUSTER REPLICAS": {
    "summary": "List replica nodes of the specified master node",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "node-id",
        "type": "string"
      }
    ],
    "since": "5.0.0",
    "group": "cluster"
  },
  "CLUSTER SLOTS": {
    "summary": "Get array of Cluster slot to node mappings",
    "complexity": "O(N) where N is the total number of Cluster nodes",
    "since": "3.0.0",
    "group": "cluster"
  },
  "COMMAND": {
    "summary": "Get array of Redis command details",
    "complexity": "O(N) where N is the total number of Redis commands",
    "since": "2.8.13",
    "group": "server"
  },
  "COMMAND COUNT": {
    "summary": "Get total number of Redis commands",
    "complexity": "O(1)",
    "since": "2.8.13",
    "group": "server"
  },
  "COMMAND GETKEYS": {
    "summary": "Extract keys given a full Redis command",
    "complexity": "O(N) where N is the number of arguments to the command",
    "since": "2.8.13",
    "group": "server"
  },
  "COMMAND INFO": {
    "summary": "Get array of specific Redis command details",
    "complexity": "O(N) when N is number of commands to look up",
    "since": "2.8.13",
    "arguments": [
      {
        "name": "command-name",
        "type": "string",
        "multiple": true
      }
    ],
    "group": "server"
  },
  "CONFIG GET": {
    "summary": "获取配置参数的值",
    "arguments": [
      {
        "name": "parameter",
        "type": "string"
      }
    ],
    "since": "2.0.0",
    "group": "server"
  },
  "CONFIG REWRITE": {
    "summary": "从写内存中的配置文件",
    "since": "2.8.0",
    "group": "server"
  },
  "CONFIG SET": {
    "summary": "设置配置文件",
    "arguments": [
      {
        "name": "parameter",
        "type": "string"
      },
      {
        "name": "value",
        "type": "string"
      }
    ],
    "since": "2.0.0",
    "group": "server"
  },
  "CONFIG RESETSTAT": {
    "summary": "复位再分配使用info命令报告的统计",
    "complexity": "O(1)",
    "since": "2.0.0",
    "group": "server"
  },
  "DBSIZE": {
    "summary": "返回当前数据库里面的keys数量",
    "since": "1.0.0",
    "group": "server"
  },
  "DEBUG OBJECT": {
    "summary": "获取一个key的debug信息",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "1.0.0",
    "group": "server"
  },
  "DEBUG SEGFAULT": {
    "summary": "使服务器崩溃",
    "since": "1.0.0",
    "group": "server"
  },
  "DECR": {
    "summary": "整数原子减1",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "1.0.0",
    "group": "string"
  },
  "DECRBY": {
    "summary": "原子减指定的整数",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "decrement",
        "type": "integer"
      }
    ],
    "since": "1.0.0",
    "group": "string"
  },
  "DEL": {
    "summary": "删除指定的key（一个或多个）",
    "complexity": "O(N) 将要被删除的key的数量，当删除的key是字符串以外的复杂数据类型时比如List,Set,Hash删除这个key的时间复杂度是O(1)。",
    "arguments": [
      {
        "name": "key",
        "type": "key",
        "multiple": true
      }
    ],
    "since": "1.0.0",
    "group": "generic"
  },
  "DISCARD": {
    "summary": "丢弃所有 MULTI 之后发的命令",
    "since": "2.0.0",
    "group": "transactions"
  },
  "DUMP": {
    "summary": "导出key的值",
    "complexity": "O(1) to access the key and additional O(N*M) to serialized it, where N is the number of Redis objects composing the value and M their average size. For small string values the time complexity is thus O(1)+O(1*M) where M is small, so simply O(1).",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "2.6.0",
    "group": "generic"
  },
  "ECHO": {
    "summary": "回显输入的字符串",
    "arguments": [
      {
        "name": "message",
        "type": "string"
      }
    ],
    "since": "1.0.0",
    "group": "connection"
  },
  "EVAL": {
    "summary": "在服务器端执行 LUA 脚本",
    "complexity": "取决于脚本本身的执行的时间复杂度。",
    "arguments": [
      {
        "name": "script",
        "type": "string"
      },
      {
        "name": "numkeys",
        "type": "integer"
      },
      {
        "name": "key",
        "type": "key",
        "multiple": true
      },
      {
        "name": "arg",
        "type": "string",
        "multiple": true
      }
    ],
    "since": "2.6.0",
    "group": "scripting"
  },
  "EVALSHA": {
    "summary": "在服务器端执行 LUA 脚本",
    "complexity": "取决于脚本本身的执行的时间复杂度。",
    "arguments": [
      {
        "name": "sha1",
        "type": "string"
      },
      {
        "name": "numkeys",
        "type": "integer"
      },
      {
        "name": "key",
        "type": "key",
        "multiple": true
      },
      {
        "name": "arg",
        "type": "string",
        "multiple": true
      }
    ],
    "since": "2.6.0",
    "group": "scripting"
  },
  "EXEC": {
    "summary": "执行所有 MULTI 之后发的命令",
    "since": "1.2.0",
    "group": "transactions"
  },
  "EXISTS": {
    "summary": "查询一个key是否存在",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key",
        "multiple": true
      }
    ],
    "since": "1.0.0",
    "group": "generic"
  },
  "EXPIRE": {
    "summary": "设置一个key的过期的秒数",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "seconds",
        "type": "integer"
      }
    ],
    "since": "1.0.0",
    "group": "generic"
  },
  "EXPIREAT": {
    "summary": "设置一个UNIX时间戳的过期时间",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "timestamp",
        "type": "posix time"
      }
    ],
    "since": "1.2.0",
    "group": "generic"
  },
  "FLUSHALL": {
    "summary": "清空所有数据库",
    "since": "1.0.0",
    "group": "server"
  },
  "FLUSHDB": {
    "summary": "清空当前的数据库",
    "since": "1.0.0",
    "group": "server"
  },
  "GEOADD": {
    "summary": "添加一个或多个地理空间位置到sorted set",
    "complexity": "每一个元素添加是O(log(N)) ，N是sorted set的元素数量。",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": ["longitude", "latitude", "member"],
        "type": ["double", "double", "string"],
        "multiple": true
      }
    ],
    "group": "geo"
  },
  "GEOHASH": {
    "summary": "Returns members of a geospatial index as standard geohash strings",
    "complexity": "O(log(N)) for each member requested, where N is the number of elements in the sorted set.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "member",
        "type": "string",
        "multiple": true
      }
    ],
    "group": "geo"
  },
  "GEOPOS": {
    "summary": "Returns longitude and latitude of members of a geospatial index",
    "complexity": "O(log(N)) for each member requested, where N is the number of elements in the sorted set.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "member",
        "type": "string",
        "multiple": true
      }
    ],
    "group": "geo"
  },
  "GEODIST": {
    "summary": "Returns the distance between two members of a geospatial index",
    "complexity": "O(log(N))",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "member1",
        "type": "string"
      },
      {
        "name": "member2",
        "type": "string"
      },
      {
        "name": "unit",
        "type": "string",
        "optional": true
      }
    ],
    "group": "geo"
  },
  "GEORADIUS": {
    "summary": "Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point",
    "complexity": "O(N+log(M)) where N is the number of elements inside the bounding box of the circular area delimited by center and radius and M is the number of items inside the index.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "longitude",
        "type": "double"
      },
      {
        "name": "latitude",
        "type": "double"
      },
      {
        "name": "radius",
        "type": "double"
      },
      {
        "name": "unit",
        "type": "enum",
        "enum": ["m", "km", "ft", "mi"]
      },
      {
        "name": "withcoord",
        "type": "enum",
        "enum": ["WITHCOORD"],
        "optional": true
      },
      {
        "name": "withdist",
        "type": "enum",
        "enum": ["WITHDIST"],
        "optional": true
      },
      {
        "name": "withhash",
        "type": "enum",
        "enum": ["WITHHASH"],
        "optional": true
      },
      {
        "command": "COUNT",
        "name": "count",
        "type": "integer",
        "optional": true
      }
    ],
    "group": "geo"
  },
  "GEORADIUSBYMEMBER": {
    "summary": "Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member",
    "complexity": "O(N+log(M)) where N is the number of elements inside the bounding box of the circular area delimited by center and radius and M is the number of items inside the index.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "member",
        "type": "string"
      },
      {
        "name": "radius",
        "type": "double"
      },
      {
        "name": "unit",
        "type": "enum",
        "enum": ["m", "km", "ft", "mi"]
      },
      {
        "name": "withcoord",
        "type": "enum",
        "enum": ["WITHCOORD"],
        "optional": true
      },
      {
        "name": "withdist",
        "type": "enum",
        "enum": ["WITHDIST"],
        "optional": true
      },
      {
        "name": "withhash",
        "type": "enum",
        "enum": ["WITHHASH"],
        "optional": true
      },
      {
        "command": "COUNT",
        "name": "count",
        "type": "integer",
        "optional": true
      }
    ],
    "group": "geo"
  },
  "GET": {
    "summary": "获取key的值",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "1.0.0",
    "group": "string"
  },
  "GETBIT": {
    "summary": "返回位的值存储在关键的字符串值的偏移量。",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "offset",
        "type": "integer"
      }
    ],
    "since": "2.2.0",
    "group": "string"
  },
  "GETRANGE": {
    "summary": "获取存储在key上的值的一个子字符串",
    "complexity": "O(N) N是字符串长度，复杂度由最终返回长度决定，但由于通过一个字符串创建子字符串是很容易的，它可以被认为是O(1)。",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "start",
        "type": "integer"
      },
      {
        "name": "end",
        "type": "integer"
      }
    ],
    "since": "2.4.0",
    "group": "string"
  },
  "GETSET": {
    "summary": "设置一个key的value，并获取设置前的值",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "value",
        "type": "string"
      }
    ],
    "since": "1.0.0",
    "group": "string"
  },
  "HDEL": {
    "summary": "删除一个或多个Hash的field",
    "complexity": "O(N) N是被删除的字段数量。",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "field",
        "type": "string",
        "multiple": true
      }
    ],
    "since": "2.0.0",
    "group": "hash"
  },
  "HEXISTS": {
    "summary": "判断field是否存在于hash中",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "field",
        "type": "string"
      }
    ],
    "since": "2.0.0",
    "group": "hash"
  },
  "HGET": {
    "summary": "获取hash中field的值",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "field",
        "type": "string"
      }
    ],
    "since": "2.0.0",
    "group": "hash"
  },
  "HGETALL": {
    "summary": "从hash中读取全部的域和值",
    "complexity": "O(N) where N is the size of the hash.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "2.0.0",
    "group": "hash"
  },
  "HINCRBY": {
    "summary": "将hash中指定域的值增加给定的数字",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "field",
        "type": "string"
      },
      {
        "name": "increment",
        "type": "integer"
      }
    ],
    "since": "2.0.0",
    "group": "hash"
  },
  "HINCRBYFLOAT": {
    "summary": "将hash中指定域的值增加给定的浮点数",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "field",
        "type": "string"
      },
      {
        "name": "increment",
        "type": "double"
      }
    ],
    "since": "2.6.0",
    "group": "hash"
  },
  "HKEYS": {
    "summary": "获取hash的所有字段",
    "complexity": "O(N) where N is the size of the hash.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "2.0.0",
    "group": "hash"
  },
  "HLEN": {
    "summary": "获取hash里所有字段的数量",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "2.0.0",
    "group": "hash"
  },
  "HMGET": {
    "summary": "获取hash里面指定字段的值",
    "complexity": "O(N) where N is the number of fields being requested.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "field",
        "type": "string",
        "multiple": true
      }
    ],
    "since": "2.0.0",
    "group": "hash"
  },
  "HMSET": {
    "summary": "设置hash字段值",
    "complexity": "O(N) where N is the number of fields being set.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": ["field", "value"],
        "type": ["string", "string"],
        "multiple": true
      }
    ],
    "since": "2.0.0",
    "group": "hash"
  },
  "HSET": {
    "summary": "设置hash里面一个字段的值",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "field",
        "type": "string"
      },
      {
        "name": "value",
        "type": "string"
      }
    ],
    "since": "2.0.0",
    "group": "hash"
  },
  "HSETNX": {
    "summary": "设置hash的一个字段，只有当这个字段不存在时有效",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "field",
        "type": "string"
      },
      {
        "name": "value",
        "type": "string"
      }
    ],
    "since": "2.0.0",
    "group": "hash"
  },
  "HSTRLEN": {
    "summary": "Get the length of the value of a hash field",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "field",
        "type": "string"
      }
    ],
    "since": "3.2.0",
    "group": "hash"
  },
  "HVALS": {
    "summary": "获得hash的所有值",
    "complexity": "O(N) where N is the size of the hash.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "2.0.0",
    "group": "hash"
  },
  "INCR": {
    "summary": "执行原子加1操作",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "1.0.0",
    "group": "string"
  },
  "INCRBY": {
    "summary": "执行原子增加一个整数",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "increment",
        "type": "integer"
      }
    ],
    "since": "1.0.0",
    "group": "string"
  },
  "INCRBYFLOAT": {
    "summary": "执行原子增加一个浮点数",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "increment",
        "type": "double"
      }
    ],
    "since": "2.6.0",
    "group": "string"
  },
  "INFO": {
    "summary": "获得服务器的详细信息",
    "arguments": [
      {
        "name": "section",
        "type": "string",
        "optional": true
      }
    ],
    "since": "1.0.0",
    "group": "server"
  },
  "KEYS": {
    "summary": "查找所有匹配给定的模式的键",
    "complexity": "O(N) with N being the number of keys in the database, under the assumption that the key names in the database and the given pattern have limited length.",
    "arguments": [
      {
        "name": "pattern",
        "type": "pattern"
      }
    ],
    "since": "1.0.0",
    "group": "generic"
  },
  "LASTSAVE": {
    "summary": "获得最后一次同步磁盘的时间",
    "since": "1.0.0",
    "group": "server"
  },
  "LINDEX": {
    "summary": "获取一个元素，通过其索引列表",
    "complexity": "O(N) where N is the number of elements to traverse to get to the element at index. This makes asking for the first or the last element of the list O(1).",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "index",
        "type": "integer"
      }
    ],
    "since": "1.0.0",
    "group": "list"
  },
  "LINSERT": {
    "summary": "在列表中的另一个元素之前或之后插入一个元素",
    "complexity": "O(N) where N is the number of elements to traverse before seeing the value pivot. This means that inserting somewhere on the left end on the list (head) can be considered O(1) and inserting somewhere on the right end (tail) is O(N).",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "where",
        "type": "enum",
        "enum": ["BEFORE", "AFTER"]
      },
      {
        "name": "pivot",
        "type": "string"
      },
      {
        "name": "value",
        "type": "string"
      }
    ],
    "since": "2.2.0",
    "group": "list"
  },
  "LLEN": {
    "summary": "获得队列(List)的长度",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "1.0.0",
    "group": "list"
  },
  "LPOP": {
    "summary": "从队列的左边出队一个元素",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "1.0.0",
    "group": "list"
  },
  "LPUSH": {
    "summary": "从队列的左边入队一个或多个元素",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "value",
        "type": "string",
        "multiple": true
      }
    ],
    "since": "1.0.0",
    "group": "list"
  },
  "LPUSHX": {
    "summary": "当队列存在时，从队到左边入队一个元素",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "value",
        "type": "string"
      }
    ],
    "since": "2.2.0",
    "group": "list"
  },
  "LRANGE": {
    "summary": "从列表中获取指定返回的元素",
    "complexity": "O(S+N) where S is the distance of start offset from HEAD for small lists, from nearest end (HEAD or TAIL) for large lists; and N is the number of elements in the specified range.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "start",
        "type": "integer"
      },
      {
        "name": "stop",
        "type": "integer"
      }
    ],
    "since": "1.0.0",
    "group": "list"
  },
  "LREM": {
    "summary": "从列表中删除元素",
    "complexity": "O(N) where N is the length of the list.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "count",
        "type": "integer"
      },
      {
        "name": "value",
        "type": "string"
      }
    ],
    "since": "1.0.0",
    "group": "list"
  },
  "LSET": {
    "summary": "设置队列里面一个元素的值",
    "complexity": "O(N) where N is the length of the list. Setting either the first or the last element of the list is O(1).",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "index",
        "type": "integer"
      },
      {
        "name": "value",
        "type": "string"
      }
    ],
    "since": "1.0.0",
    "group": "list"
  },
  "LTRIM": {
    "summary": "修剪到指定范围内的清单",
    "complexity": "O(N) where N is the number of elements to be removed by the operation.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "start",
        "type": "integer"
      },
      {
        "name": "stop",
        "type": "integer"
      }
    ],
    "since": "1.0.0",
    "group": "list"
  },
  "MEMORY DOCTOR": {
    "summary": "Outputs memory problems report",
    "since": "4.0.0",
    "group": "server"
  },
  "MEMORY HELP": {
    "summary": "Show helpful text about the different subcommands",
    "since": "4.0.0",
    "group": "server"

  },
  "MEMORY MALLOC-STATS": {
    "summary": "Show allocator internal stats",
    "since": "4.0.0",
    "group": "server"
  },
  "MEMORY PURGE": {
    "summary": "Ask the allocator to release memory",
    "since": "4.0.0",
    "group": "server"
  },
  "MEMORY STATS": {
    "summary": "Show memory usage details",
    "since": "4.0.0",
    "group": "server"
  },
  "MEMORY USAGE": {
    "summary": "Estimate the memory usage of a key",
    "complexity": "O(N) where N is the number of samples.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "command": "SAMPLES",
        "name": "count",
        "type": "integer",
        "optional": true
      }
    ],
    "since": "4.0.0",
    "group": "server"
  },
  "MGET": {
    "summary": "获得所有key的值",
    "complexity": "O(N) where N is the number of keys to retrieve.",
    "arguments": [
      {
        "name": "key",
        "type": "key",
        "multiple": true
      }
    ],
    "since": "1.0.0",
    "group": "string"
  },
  "MIGRATE": {
    "summary": "原子性的将key从redis的一个实例移到另一个实例",
    "complexity": "This command actually executes a DUMP+DEL in the source instance, and a RESTORE in the target instance. See the pages of these commands for time complexity. Also an O(N) data transfer between the two instances is performed.",
    "arguments": [
      {
        "name": "host",
        "type": "string"
      },
      {
        "name": "port",
        "type": "string"
      },
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "destination-db",
        "type": "integer"
      },
      {
        "name": "timeout",
        "type": "integer"
      },
      {
        "name": "copy",
        "type": "enum",
        "enum": ["COPY"],
        "optional": true
      },
      {
        "name": "replace",
        "type": "enum",
        "enum": ["REPLACE"],
        "optional": true
      }
    ],
    "since": "2.6.0",
    "group": "generic"
  },
  "MONITOR": {
    "summary": "实时监控服务器",
    "since": "1.0.0",
    "group": "server"
  },
  "MOVE": {
    "summary": "移动一个key到另一个数据库",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "db",
        "type": "integer"
      }
    ],
    "since": "1.0.0",
    "group": "generic"
  },
  "MSET": {
    "summary": "设置多个key value",
    "complexity": "O(N) where N is the number of keys to set.",
    "arguments": [
      {
        "name": ["key", "value"],
        "type": ["key", "string"],
        "multiple": true
      }
    ],
    "since": "1.0.1",
    "group": "string"
  },
  "MSETNX": {
    "summary": "设置多个key value,仅当key存在时",
    "complexity": "O(N) where N is the number of keys to set.",
    "arguments": [
      {
        "name": ["key", "value"],
        "type": ["key", "string"],
        "multiple": true
      }
    ],
    "since": "1.0.1",
    "group": "string"
  },
  "MULTI": {
    "summary": "标记一个事务块开始",
    "since": "1.2.0",
    "group": "transactions"
  },
  "OBJECT": {
    "summary": "检查内部的再分配对象",
    "complexity": "O(1) for all the currently implemented subcommands.",
    "since": "2.2.3",
    "group": "generic",
    "arguments": [
      {
        "name": "subcommand",
        "type": "string"
      },
      {
        "name": "arguments",
        "type": "string",
        "optional": true,
        "multiple": true
      }
    ]
  },
  "PERSIST": {
    "summary": "移除key的过期时间",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "2.2.0",
    "group": "generic"
  },
  "PEXPIRE": {
    "summary": "Set a key's time to live in milliseconds",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "milliseconds",
        "type": "integer"
      }
    ],
    "since": "2.6.0",
    "group": "generic"
  },
  "PEXPIREAT": {
    "summary": "Set the expiration for a key as a UNIX timestamp specified in milliseconds",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "milliseconds-timestamp",
        "type": "posix time"
      }
    ],
    "since": "2.6.0",
    "group": "generic"
  },
  "PFADD": {
    "summary": "Adds the specified elements to the specified HyperLogLog.",
    "complexity": "O(1) to add every element.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "element",
        "type": "string",
        "multiple": true
      }
    ],
    "since": "2.8.9",
    "group": "hyperloglog"
  },
  "PFCOUNT": {
    "summary": "Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).",
    "complexity": "O(1) with every small average constant times when called with a single key. O(N) with N being the number of keys, and much bigger constant times, when called with multiple keys.",
    "arguments": [
      {
        "name": "key",
        "type": "key",
        "multiple": true
      }
    ],
    "since": "2.8.9",
    "group": "hyperloglog"
  },
  "PFMERGE": {
    "summary": "Merge N different HyperLogLogs into a single one.",
    "complexity": "O(N) to merge N HyperLogLogs, but with high constant times.",
    "arguments": [
      {
        "name": "destkey",
        "type": "key"
      },
      {
        "name": "sourcekey",
        "type": "key",
        "multiple": true
      }
    ],
    "since": "2.8.9",
    "group": "hyperloglog"
  },
  "PING": {
    "summary": "Ping 服务器",
    "since": "1.0.0",
    "group": "connection"
  },
  "PSETEX": {
    "summary": "Set the value and expiration in milliseconds of a key",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "milliseconds",
        "type": "integer"
      },
      {
        "name": "value",
        "type": "string"
      }
    ],
    "since": "2.6.0",
    "group": "string"
  },
  "PSUBSCRIBE": {
    "summary": "Listen for messages published to channels matching the given patterns",
    "complexity": "O(N) where N is the number of patterns the client is already subscribed to.",
    "arguments": [
      {
        "name": ["pattern"],
        "type": ["pattern"],
        "multiple": true
      }
    ],
    "since": "2.0.0",
    "group": "pubsub"
  },
  "PUBSUB": {
    "summary": "Inspect the state of the Pub/Sub subsystem",
    "complexity": "O(N) for the CHANNELS subcommand, where N is the number of active channels, and assuming constant time pattern matching (relatively short channels and patterns). O(N) for the NUMSUB subcommand, where N is the number of requested channels. O(1) for the NUMPAT subcommand.",
    "arguments": [
      {
        "name": "subcommand",
        "type": "string"
      },
      {
        "name": "argument",
        "type": "string",
        "optional": true,
        "multiple": true
      }
    ],
    "since": "2.8.0",
    "group": "pubsub"
  },
  "PTTL": {
    "summary": "获取key的有效毫秒数",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "2.6.0",
    "group": "generic"
  },
  "PUBLISH": {
    "summary": "发布一条消息到频道",
    "complexity": "O(N+M) where N is the number of clients subscribed to the receiving channel and M is the total number of subscribed patterns (by any client).",
    "arguments": [
      {
        "name": "channel",
        "type": "string"
      },
      {
        "name": "message",
        "type": "string"
      }
    ],
    "since": "2.0.0",
    "group": "pubsub"
  },
  "PUNSUBSCRIBE": {
    "summary": "停止发布到匹配给定模式的渠道的消息听",
    "complexity": "O(N+M) where N is the number of patterns the client is already subscribed and M is the number of total patterns subscribed in the system (by any client).",
    "arguments": [
      {
        "name": "pattern",
        "type": "pattern",
        "optional": true,
        "multiple": true
      }
    ],
    "since": "2.0.0",
    "group": "pubsub"
  },
  "QUIT": {
    "summary": "关闭连接，退出",
    "since": "1.0.0",
    "group": "connection"
  },
  "RANDOMKEY": {
    "summary": "返回一个随机的key",
    "complexity": "O(1)",
    "since": "1.0.0",
    "group": "generic"
  },
  "READONLY": {
    "summary": "Enables read queries for a connection to a cluster slave node",
    "complexity": "O(1)",
    "since": "3.0.0",
    "group": "cluster"
  },
  "READWRITE": {
    "summary": "Disables read queries for a connection to a cluster slave node",
    "complexity": "O(1)",
    "since": "3.0.0",
    "group": "cluster"
  },
  "RENAME": {
    "summary": "将一个key重命名",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "newkey",
        "type": "key"
      }
    ],
    "since": "1.0.0",
    "group": "generic"
  },
  "RENAMENX": {
    "summary": "重命名一个key,新的key必须是不存在的key",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "newkey",
        "type": "key"
      }
    ],
    "since": "1.0.0",
    "group": "generic"
  },
  "RESTORE": {
    "summary": "Create a key using the provided serialized value, previously obtained using DUMP.",
    "complexity": "O(1) to create the new key and additional O(N*M) to reconstruct the serialized value, where N is the number of Redis objects composing the value and M their average size. For small string values the time complexity is thus O(1)+O(1*M) where M is small, so simply O(1). However for sorted set values the complexity is O(N*M*log(N)) because inserting values into sorted sets is O(log(N)).",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "ttl",
        "type": "integer"
      },
      {
        "name": "serialized-value",
        "type": "string"
      },
      {
        "name": "replace",
        "type": "enum",
        "enum": ["REPLACE"],
        "optional": true
      }

    ],
    "since": "2.6.0",
    "group": "generic"
  },
  "ROLE": {
    "summary": "Return the role of the instance in the context of replication",
    "since": "2.8.12",
    "group": "server"
  },
  "RPOP": {
    "summary": "从队列的右边出队一个元素",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "1.0.0",
    "group": "list"
  },
  "RPOPLPUSH": {
    "summary": "删除列表中的最后一个元素，将其追加到另一个列表",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "source",
        "type": "key"
      },
      {
        "name": "destination",
        "type": "key"
      }
    ],
    "since": "1.2.0",
    "group": "list"
  },
  "RPUSH": {
    "summary": "从队列的右边入队一个元素",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "value",
        "type": "string",
        "multiple": true
      }
    ],
    "since": "1.0.0",
    "group": "list"
  },
  "RPUSHX": {
    "summary": "从队列的右边入队一个元素，仅队列存在时有效",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "value",
        "type": "string"
      }
    ],
    "since": "2.2.0",
    "group": "list"
  },
  "SADD": {
    "summary": "添加一个或者多个元素到集合(set)里",
    "complexity": "O(N) where N is the number of members to be added.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "member",
        "type": "string",
        "multiple": true
      }
    ],
    "since": "1.0.0",
    "group": "set"
  },
  "SAVE": {
    "summary": "同步数据到磁盘上",
    "since": "1.0.0",
    "group": "server"
  },
  "SCARD": {
    "summary": "获取集合里面的元素数量",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "1.0.0",
    "group": "set"
  },
  "SCRIPT DEBUG": {
    "summary": "Set the debug mode for executed scripts.",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "mode",
        "type": "enum",
        "enum": ["YES", "SYNC", "NO"]
      }
    ],
    "since": "3.2.0",
    "group": "scripting"
  },
  "SCRIPT EXISTS": {
    "summary": "Check existence of scripts in the script cache.",
    "complexity": "O(N) with N being the number of scripts to check (so checking a single script is an O(1) operation).",
    "arguments": [
      {
        "name": "script",
        "type": "string",
        "multiple": true
      }
    ],
    "since": "2.6.0",
    "group": "scripting"
  },
  "SCRIPT FLUSH": {
    "summary": "删除服务器缓存中所有Lua脚本。",
    "complexity": "O(N) with N being the number of scripts in cache",
    "since": "2.6.0",
    "group": "scripting"
  },
  "SCRIPT KILL": {
    "summary": "杀死当前正在运行的 Lua 脚本。",
    "complexity": "O(1)",
    "since": "2.6.0",
    "group": "scripting"
  },
  "SCRIPT LOAD": {
    "summary": "从服务器缓存中装载一个Lua脚本。",
    "complexity": "O(N) with N being the length in bytes of the script body.",
    "arguments": [
      {
        "name": "script",
        "type": "string"
      }
    ],
    "since": "2.6.0",
    "group": "scripting"
  },
  "SDIFF": {
    "summary": "获得队列不存在的元素",
    "complexity": "O(N) where N is the total number of elements in all given sets.",
    "arguments": [
      {
        "name": "key",
        "type": "key",
        "multiple": true
      }
    ],
    "since": "1.0.0",
    "group": "set"
  },
  "SDIFFSTORE": {
    "summary": "获得队列不存在的元素，并存储在一个关键的结果集",
    "complexity": "O(N) where N is the total number of elements in all given sets.",
    "arguments": [
      {
        "name": "destination",
        "type": "key"
      },
      {
        "name": "key",
        "type": "key",
        "multiple": true
      }
    ],
    "since": "1.0.0",
    "group": "set"
  },
  "SELECT": {
    "summary": "选择新数据库",
    "arguments": [
      {
        "name": "index",
        "type": "integer"
      }
    ],
    "since": "1.0.0",
    "group": "connection"
  },
  "SET": {
    "summary": "设置一个key的value值",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "value",
        "type": "string"
      },
      {
        "command": "EX",
        "name": "seconds",
        "type": "integer",
        "optional": true
      },
      {
        "command": "PX",
        "name": "milliseconds",
        "type": "integer",
        "optional": true
      },
      {
        "name": "condition",
        "type": "enum",
        "enum": ["NX", "XX"],
        "optional": true
      }
    ],
    "since": "1.0.0",
    "group": "string"
  },
  "SETBIT": {
    "summary": "Sets or clears the bit at offset in the string value stored at key",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "offset",
        "type": "integer"
      },
      {
        "name": "value",
        "type": "string"
      }
    ],
    "since": "2.2.0",
    "group": "string"
  },
  "SETEX": {
    "summary": "设置key-value并设置过期时间（单位：秒）",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "seconds",
        "type": "integer"
      },
      {
        "name": "value",
        "type": "string"
      }
    ],
    "since": "2.0.0",
    "group": "string"
  },
  "SETNX": {
    "summary": "设置的一个关键的价值，只有当该键不存在",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "value",
        "type": "string"
      }
    ],
    "since": "1.0.0",
    "group": "string"
  },
  "SETRANGE": {
    "summary": "Overwrite part of a string at key starting at the specified offset",
    "complexity": "O(1), not counting the time taken to copy the new string in place. Usually, this string is very small so the amortized complexity is O(1). Otherwise, complexity is O(M) with M being the length of the value argument.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "offset",
        "type": "integer"
      },
      {
        "name": "value",
        "type": "string"
      }
    ],
    "since": "2.2.0",
    "group": "string"
  },
  "SHUTDOWN": {
    "summary": "关闭服务",
    "arguments": [
      {
        "name": "NOSAVE",
        "type": "enum",
        "enum": ["NOSAVE"],
        "optional": true
      },
      {
        "name": "SAVE",
        "type": "enum",
        "enum": ["SAVE"],
        "optional": true
      }
    ],
    "since": "1.0.0",
    "group": "server"
  },
  "SINTER": {
    "summary": "获得两个集合的交集",
    "complexity": "O(N*M) worst case where N is the cardinality of the smallest set and M is the number of sets.",
    "arguments": [
      {
        "name": "key",
        "type": "key",
        "multiple": true
      }
    ],
    "since": "1.0.0",
    "group": "set"
  },
  "SINTERSTORE": {
    "summary": "获得两个集合的交集，并存储在一个关键的结果集",
    "complexity": "O(N*M) worst case where N is the cardinality of the smallest set and M is the number of sets.",
    "arguments": [
      {
        "name": "destination",
        "type": "key"
      },
      {
        "name": "key",
        "type": "key",
        "multiple": true
      }
    ],
    "since": "1.0.0",
    "group": "set"
  },
  "SISMEMBER": {
    "summary": "确定一个给定的值是一个集合的成员",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "member",
        "type": "string"
      }
    ],
    "since": "1.0.0",
    "group": "set"
  },
  "SLAVEOF": {
    "summary": "指定当前服务器的主服务器",
    "arguments": [
      {
        "name": "host",
        "type": "string"
      },
      {
        "name": "port",
        "type": "string"
      }
    ],
    "since": "1.0.0",
    "group": "server"
  },
  "REPLICAOF": {
    "summary": "Make the server a replica of another instance, or promote it as master.",
    "arguments": [
      {
        "name": "host",
        "type": "string"
      },
      {
        "name": "port",
        "type": "string"
      }
    ],
    "since": "5.0.0",
    "group": "server"
  },
  "SLOWLOG": {
    "summary": "管理再分配的慢查询日志",
    "arguments": [
      {
        "name": "subcommand",
        "type": "string"
      },
      {
        "name": "argument",
        "type": "string",
        "optional": true
      }
    ],
    "since": "2.2.12",
    "group": "server"
  },
  "SMEMBERS": {
    "summary": "获取集合里面的所有key",
    "complexity": "O(N) where N is the set cardinality.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "1.0.0",
    "group": "set"
  },
  "SMOVE": {
    "summary": "移动集合里面的一个key到另一个集合",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "source",
        "type": "key"
      },
      {
        "name": "destination",
        "type": "key"
      },
      {
        "name": "member",
        "type": "string"
      }
    ],
    "since": "1.0.0",
    "group": "set"
  },
  "SORT": {
    "summary": "对队列、集合、有序集合排序",
    "complexity": "O(N+M*log(M)) where N is the number of elements in the list or set to sort, and M the number of returned elements. When the elements are not sorted, complexity is currently O(N) as there is a copy step that will be avoided in next releases.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "command": "BY",
        "name": "pattern",
        "type": "pattern",
        "optional": true
      },
      {
        "command": "LIMIT",
        "name": ["offset", "count"],
        "type": ["integer", "integer"],
        "optional": true
      },
      {
        "command": "GET",
        "name": "pattern",
        "type": "string",
        "optional": true,
        "multiple": true
      },
      {
        "name": "order",
        "type": "enum",
        "enum": ["ASC", "DESC"],
        "optional": true
      },
      {
        "name": "sorting",
        "type": "enum",
        "enum": ["ALPHA"],
        "optional": true
      },
      {
        "command": "STORE",
        "name": "destination",
        "type": "key",
        "optional": true
      }
    ],
    "since": "1.0.0",
    "group": "generic"
  },
  "SPOP": {
    "summary": "删除并获取一个集合里面的元素",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "count",
        "type": "integer",
        "optional": true
      }
    ],
    "since": "1.0.0",
    "group": "set"
  },
  "SRANDMEMBER": {
    "summary": "从集合里面随机获取一个key",
    "complexity": "Without the count argument O(1), otherwise O(N) where N is the absolute value of the passed count.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "count",
        "type": "integer",
        "optional": true
      }
    ],
    "since": "1.0.0",
    "group": "set"
  },
  "SREM": {
    "summary": "从集合里删除一个或多个key",
    "complexity": "O(N) where N is the number of members to be removed.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "member",
        "type": "string",
        "multiple": true
      }
    ],
    "since": "1.0.0",
    "group": "set"
  },
  "STRLEN": {
    "summary": "获取指定key值的长度",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "2.2.0",
    "group": "string"
  },
  "SUBSCRIBE": {
    "summary": "监听频道发布的消息",
    "complexity": "O(N) where N is the number of channels to subscribe to.",
    "arguments": [
      {
        "name": ["channel"],
        "type": ["string"],
        "multiple": true
      }
    ],
    "since": "2.0.0",
    "group": "pubsub"
  },
  "SUNION": {
    "summary": "添加多个set元素",
    "complexity": "O(N) where N is the total number of elements in all given sets.",
    "arguments": [
      {
        "name": "key",
        "type": "key",
        "multiple": true
      }
    ],
    "since": "1.0.0",
    "group": "set"
  },
  "SUNIONSTORE": {
    "summary": "合并set元素，并将结果存入新的set里面",
    "complexity": "O(N) where N is the total number of elements in all given sets.",
    "arguments": [
      {
        "name": "destination",
        "type": "key"
      },
      {
        "name": "key",
        "type": "key",
        "multiple": true
      }
    ],
    "since": "1.0.0",
    "group": "set"
  },
  "SWAPDB": {
    "summary": "Swaps two Redis databases",
    "arguments": [
      {
        "name": "index",
        "type": "integer"
      },
      {
        "name": "index",
        "type": "integer"
      }
    ],
    "since": "4.0.0",
    "group": "connection"
  },
  "SYNC": {
    "summary": "用于复制的内部命令",
    "since": "1.0.0",
    "group": "server"
  },
  "TIME": {
    "summary": "返回当前服务器时间",
    "complexity": "O(1)",
    "since": "2.6.0",
    "group": "server"
  },
  "TOUCH": {
    "summary": "Alters the last access time of a key(s). Returns the number of existing keys specified.",
    "complexity": "O(N) where N is the number of keys that will be touched.",
    "arguments": [
      {
        "name": "key",
        "type": "key",
        "multiple": true
      }
    ],
    "since": "3.2.1",
    "group": "generic"
  },
  "TTL": {
    "summary": "获取key的有效时间（单位：秒）",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "1.0.0",
    "group": "generic"
  },
  "TYPE": {
    "summary": "获取key的存储类型",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "1.0.0",
    "group": "generic"
  },
  "UNSUBSCRIBE": {
    "summary": "停止频道监听",
    "complexity": "O(N) where N is the number of clients already subscribed to a channel.",
    "arguments": [
      {
        "name": "channel",
        "type": "string",
        "optional": true,
        "multiple": true
      }
    ],
    "since": "2.0.0",
    "group": "pubsub"
  },
  "UNLINK": {
    "summary": "Delete a key asynchronously in another thread. Otherwise it is just as DEL, but non blocking.",
    "complexity": "O(1) for each key removed regardless of its size. Then the command does O(N) work in a different thread in order to reclaim memory, where N is the number of allocations the deleted objects where composed of.",
    "arguments": [
      {
        "name": "key",
        "type": "key",
        "multiple": true
      }
    ],
    "since": "4.0.0",
    "group": "generic"
  },
  "UNWATCH": {
    "summary": "取消事务",
    "complexity": "O(1)",
    "since": "2.2.0",
    "group": "transactions"
  },
  "WAIT": {
    "summary": "Wait for the synchronous replication of all the write commands sent in the context of the current connection",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "numslaves",
        "type": "integer"
      },
      {
        "name": "timeout",
        "type": "integer"
      }
    ],
    "since": "3.0.0",
    "group": "generic"
  },
  "WATCH": {
    "summary": "锁定key直到执行了 MULTI/EXEC 命令",
    "complexity": "O(1) for every key.",
    "arguments": [
      {
        "name": "key",
        "type": "key",
        "multiple": true
      }
    ],
    "since": "2.2.0",
    "group": "transactions"
  },
  "ZADD": {
    "summary": "添加到有序set的一个或多个成员，或更新的分数，如果它已经存在",
    "complexity": "O(log(N)) for each item added, where N is the number of elements in the sorted set.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "condition",
        "type": "enum",
        "enum": ["NX","XX"],
        "optional": true
      },
      {
        "name": "change",
        "type": "enum",
        "enum": ["CH"],
        "optional": true
      },
      {
        "name": "increment",
        "type": "enum",
        "enum": ["INCR"],
        "optional": true
      },
      {
        "name": ["score", "member"],
        "type": ["double", "string"],
        "multiple": true
      }
    ],
    "since": "1.2.0",
    "group": "sorted_set"
  },
  "ZCARD": {
    "summary": "获取一个排序的集合中的成员数量",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "1.2.0",
    "group": "sorted_set"
  },
  "ZCOUNT": {
    "summary": "给定值范围内的成员数与分数排序",
    "complexity": "O(log(N)) with N being the number of elements in the sorted set.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "min",
        "type": "double"
      },
      {
        "name": "max",
        "type": "double"
      }
    ],
    "since": "2.0.0",
    "group": "sorted_set"
  },
  "ZINCRBY": {
    "summary": "增量的一名成员在排序设置的评分",
    "complexity": "O(log(N)) where N is the number of elements in the sorted set.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "increment",
        "type": "integer"
      },
      {
        "name": "member",
        "type": "string"
      }
    ],
    "since": "1.2.0",
    "group": "sorted_set"
  },
  "ZINTERSTORE": {
    "summary": "相交多个排序集，导致排序的设置存储在一个新的关键",
    "complexity": "O(N*K)+O(M*log(M)) worst case with N being the smallest input sorted set, K being the number of input sorted sets and M being the number of elements in the resulting sorted set.",
    "arguments": [
      {
        "name": "destination",
        "type": "key"
      },
      {
        "name": "numkeys",
        "type": "integer"
      },
      {
        "name": "key",
        "type": "key",
        "multiple": true
      },
      {
        "command": "WEIGHTS",
        "name": "weight",
        "type": "integer",
        "variadic": true,
        "optional": true
      },
      {
        "command": "AGGREGATE",
        "name": "aggregate",
        "type": "enum",
        "enum": ["SUM", "MIN", "MAX"],
        "optional": true
      }
    ],
    "since": "2.0.0",
    "group": "sorted_set"
  },
  "ZLEXCOUNT": {
    "summary": "Count the number of members in a sorted set between a given lexicographical range",
    "complexity": "O(log(N)) with N being the number of elements in the sorted set.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "min",
        "type": "string"
      },
      {
        "name": "max",
        "type": "string"
      }
    ],
    "since": "2.8.9",
    "group": "sorted_set"
  },
  "ZPOPMAX": {
    "summary": "Remove and return members with the highest scores in a sorted set",
    "complexity": "O(log(N)*M) with N being the number of elements in the sorted set, and M being the number of elements popped.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "count",
        "type": "integer",
        "optional": true
      }
    ],
    "since": "5.0.0",
    "group": "sorted_set"
  },
  "ZPOPMIN": {
    "summary": "Remove and return members with the lowest scores in a sorted set",
    "complexity": "O(log(N)*M) with N being the number of elements in the sorted set, and M being the number of elements popped.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "count",
        "type": "integer",
        "optional": true
      }
    ],
    "since": "5.0.0",
    "group": "sorted_set"
  },
  "ZRANGE": {
    "summary": "根据指定的index返回，返回sorted set的成员列表",
    "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "start",
        "type": "integer"
      },
      {
        "name": "stop",
        "type": "integer"
      },
      {
        "name": "withscores",
        "type": "enum",
        "enum": ["WITHSCORES"],
        "optional": true
      }
    ],
    "since": "1.2.0",
    "group": "sorted_set"
  },
  "ZRANGEBYLEX": {
    "summary": "Return a range of members in a sorted set, by lexicographical range",
    "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "min",
        "type": "string"
      },
      {
        "name": "max",
        "type": "string"
      },
      {
        "command": "LIMIT",
        "name": ["offset", "count"],
        "type": ["integer", "integer"],
        "optional": true
      }
    ],
    "since": "2.8.9",
    "group": "sorted_set"
  },
  "ZREVRANGEBYLEX": {
    "summary": "Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.",
    "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "max",
        "type": "string"
      },
      {
        "name": "min",
        "type": "string"
      },
      {
        "command": "LIMIT",
        "name": ["offset", "count"],
        "type": ["integer", "integer"],
        "optional": true
      }
    ],
    "since": "2.8.9",
    "group": "sorted_set"
  },
  "ZRANGEBYSCORE": {
    "summary": "根据指定的score返回，返回sorted set的成员列表",
    "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "min",
        "type": "double"
      },
      {
        "name": "max",
        "type": "double"
      },
      {
        "name": "withscores",
        "type": "enum",
        "enum": ["WITHSCORES"],
        "optional": true
      },
      {
        "command": "LIMIT",
        "name": ["offset", "count"],
        "type": ["integer", "integer"],
        "optional": true
      }
    ],
    "since": "1.0.5",
    "group": "sorted_set"
  },
  "ZRANK": {
    "summary": "确定在排序集合成员的索引",
    "complexity": "O(log(N))",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "member",
        "type": "string"
      }
    ],
    "since": "2.0.0",
    "group": "sorted_set"
  },
  "ZREM": {
    "summary": "从排序的集合中删除一个或多个成员",
    "complexity": "O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "member",
        "type": "string",
        "multiple": true
      }
    ],
    "since": "1.2.0",
    "group": "sorted_set"
  },
  "ZREMRANGEBYLEX": {
    "summary": "Remove all members in a sorted set between the given lexicographical range",
    "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements removed by the operation.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "min",
        "type": "string"
      },
      {
        "name": "max",
        "type": "string"
      }
    ],
    "since": "2.8.9",
    "group": "sorted_set"
  },
  "ZREMRANGEBYRANK": {
    "summary": "在排序设置的所有成员在给定的索引中删除",
    "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements removed by the operation.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "start",
        "type": "integer"
      },
      {
        "name": "stop",
        "type": "integer"
      }
    ],
    "since": "2.0.0",
    "group": "sorted_set"
  },
  "ZREMRANGEBYSCORE": {
    "summary": "删除一个排序的设置在给定的分数所有成员",
    "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements removed by the operation.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "min",
        "type": "double"
      },
      {
        "name": "max",
        "type": "double"
      }
    ],
    "since": "1.2.0",
    "group": "sorted_set"
  },
  "ZREVRANGE": {
    "summary": "在排序的设置返回的成员范围，通过索引，下令从分数高到低",
    "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "start",
        "type": "integer"
      },
      {
        "name": "stop",
        "type": "integer"
      },
      {
        "name": "withscores",
        "type": "enum",
        "enum": ["WITHSCORES"],
        "optional": true
      }
    ],
    "since": "1.2.0",
    "group": "sorted_set"
  },
  "ZREVRANGEBYSCORE": {
    "summary": "返回的成员在排序设置的范围，由得分，下令从分数高到低",
    "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "max",
        "type": "double"
      },
      {
        "name": "min",
        "type": "double"
      },
      {
        "name": "withscores",
        "type": "enum",
        "enum": ["WITHSCORES"],
        "optional": true
      },
      {
        "command": "LIMIT",
        "name": ["offset", "count"],
        "type": ["integer", "integer"],
        "optional": true
      }
    ],
    "since": "2.2.0",
    "group": "sorted_set"
  },
  "ZREVRANK": {
    "summary": "确定指数在排序集的成员，下令从分数高到低",
    "complexity": "O(log(N))",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "member",
        "type": "string"
      }
    ],
    "since": "2.0.0",
    "group": "sorted_set"
  },
  "ZSCORE": {
    "summary": "获取成员在排序设置相关的比分",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "member",
        "type": "string"
      }
    ],
    "since": "1.2.0",
    "group": "sorted_set"
  },
  "ZUNIONSTORE": {
    "summary": "添加多个排序集和导致排序的设置存储在一个新的关键",
    "complexity": "O(N)+O(M log(M)) with N being the sum of the sizes of the input sorted sets, and M being the number of elements in the resulting sorted set.",
    "arguments": [
      {
        "name": "destination",
        "type": "key"
      },
      {
        "name": "numkeys",
        "type": "integer"
      },
      {
        "name": "key",
        "type": "key",
        "multiple": true
      },
      {
        "command": "WEIGHTS",
        "name": "weight",
        "type": "integer",
        "variadic": true,
        "optional": true
      },
      {
        "command": "AGGREGATE",
        "name": "aggregate",
        "type": "enum",
        "enum": ["SUM", "MIN", "MAX"],
        "optional": true
      }
    ],
    "since": "2.0.0",
    "group": "sorted_set"
  },
  "SCAN": {
    "summary": "增量迭代key",
    "complexity": "O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection.",
    "arguments": [
      {
        "name": "cursor",
        "type": "integer"
      },
      {
        "command": "MATCH",
        "name": "pattern",
        "type": "pattern",
        "optional": true
      },
      {
        "command": "COUNT",
        "name": "count",
        "type": "integer",
        "optional": true
      }
    ],
    "since": "2.8.0",
    "group": "generic"
  },
  "SSCAN": {
    "summary": "迭代set里面的元素",
    "complexity": "O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection..",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "cursor",
        "type": "integer"
      },
      {
        "command": "MATCH",
        "name": "pattern",
        "type": "pattern",
        "optional": true
      },
      {
        "command": "COUNT",
        "name": "count",
        "type": "integer",
        "optional": true
      }
    ],
    "since": "2.8.0",
    "group": "set"
  },
  "HSCAN": {
    "summary": "迭代hash里面的元素",
    "complexity": "O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection..",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "cursor",
        "type": "integer"
      },
      {
        "command": "MATCH",
        "name": "pattern",
        "type": "pattern",
        "optional": true
      },
      {
        "command": "COUNT",
        "name": "count",
        "type": "integer",
        "optional": true
      }
    ],
    "since": "2.8.0",
    "group": "hash"
  },
  "ZSCAN": {
    "summary": "迭代sorted sets里面的元素",
    "complexity": "O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection..",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "cursor",
        "type": "integer"
      },
      {
        "command": "MATCH",
        "name": "pattern",
        "type": "pattern",
        "optional": true
      },
      {
        "command": "COUNT",
        "name": "count",
        "type": "integer",
        "optional": true
      }
    ],
    "since": "2.8.0",
    "group": "sorted_set"
  },
  "XINFO": {
    "summary": "Get information on streams and consumer groups",
    "complexity": "O(N) with N being the number of returned items for the subcommands CONSUMERS and GROUPS. The STREAM subcommand is O(log N) with N being the number of items in the stream.",
    "arguments": [
      {
        "command": "CONSUMERS",
        "name": ["key", "groupname"],
        "type": ["key", "string"],
        "optional": true
      },
      {
        "command": "GROUPS",
        "name": "key",
        "type": "key",
        "optional": true
      },
      {
        "command": "STREAM",
        "name": "key",
        "type": "key",
        "optional": true
      },
      {
        "name": "help",
        "type": "enum",
        "enum": ["HELP"],
        "optional": true
      }
    ],
    "since": "5.0.0",
    "group": "stream"
  },
  "XADD": {
    "summary": "Appends a new entry to a stream",
    "complexity": "O(log(N)) with N being the number of items already into the stream.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "ID",
        "type": "string"
      },
      {
        "name": ["field", "string"],
        "type": ["value", "string"],
        "multiple": true
      }
    ],
    "since": "5.0.0",
    "group": "stream"
  },
  "XTRIM": {
    "summary": "Trims the stream to (approximately if '~' is passed) a certain size",
    "complexity": "O(log(N)) + M, with N being the number of entries in the stream prior to trim, and M being the number of evicted entries. M constant times are very small however, since entries are organized in macro nodes containing multiple entries that can be released with a single deallocation.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "strategy",
        "type": "enum",
        "enum": ["MAXLEN"]
      },
      {
        "name": "approx",
        "type": "enum",
        "enum": ["~"],
        "optional": true
      },
      {
        "name": "count",
        "type": "integer"
      }
    ],
    "since": "5.0.0",
    "group": "stream"
  },
  "XDEL": {
    "summary": "Removes the specified entries from the stream. Returns the number of items actually deleted, that may be different from the number of IDs passed in case certain IDs do not exist.",
    "complexity": "O(log(N)) with N being the number of items in the stream.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "ID",
        "type": "string",
        "multiple": "true"
      }
    ],
    "since": "5.0.0",
    "group": "stream"
  },
  "XRANGE": {
    "summary": "Return a range of elements in a stream, with IDs matching the specified IDs interval",
    "complexity": "O(log(N)+M) with N being the number of elements in the stream and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with COUNT), you can consider it O(log(N)).",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "start",
        "type": "string"
      },
      {
        "name": "end",
        "type": "string"
      },
      {
        "command": "COUNT",
        "name": "count",
        "type": "integer",
        "optional": true
      }
    ],
    "since": "5.0.0",
    "group": "stream"
  },
  "XREVRANGE": {
    "summary": "Return a range of elements in a stream, with IDs matching the specified IDs interval, in reverse order (from greater to smaller IDs) compared to XRANGE",
    "complexity": "O(log(N)+M) with N being the number of elements in the stream and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with COUNT), you can consider it O(log(N)).",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "end",
        "type": "string"
      },
      {
        "name": "start",
        "type": "string"
      },
      {
        "command": "COUNT",
        "name": "count",
        "type": "integer",
        "optional": true
      }
    ],
    "since": "5.0.0",
    "group": "stream"
  },
  "XLEN": {
    "summary": "Return the number of entires in a stream",
    "complexity": "O(1)",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      }
    ],
    "since": "5.0.0",
    "group": "stream"
  },
  "XREAD": {
    "summary": "Return never seen elements in multiple streams, with IDs greater than the ones reported by the caller for each stream. Can block.",
    "complexity": "For each stream mentioned: O(log(N)+M) with N being the number of elements in the stream and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with COUNT), you can consider it O(log(N)). On the other side, XADD will pay the O(N) time in order to serve the N clients blocked on the stream getting new data.",
    "arguments": [
      {
        "command": "COUNT",
        "name": "count",
        "type": "integer",
        "optional": true
      },
      {
        "command": "BLOCK",
        "name": "milliseconds",
        "type": "integer",
        "optional": true
      },
      {
        "name": "streams",
        "type": "enum",
        "enum": ["STREAMS"]
      },
      {
        "name": "key",
        "type": "key",
        "multiple": true
      },
      {
        "name": "ID",
        "type": "string",
        "multiple": true
      }
    ],
    "since": "5.0.0",
    "group": "stream"
  },
  "XGROUP": {
    "summary": "Create, destroy, and manage consumer groups.",
    "complexity": "O(log N) for all the subcommands, with N being the number of consumer groups registered in the stream, with the exception of the DESTROY subcommand which takes an additional O(M) time in order to delete the M entries inside the consumer group pending entries list (PEL).",
    "arguments": [
      {
        "command": "CREATE",
        "name": ["key", "groupname", "id-or-$"],
        "type": ["key", "string", "string"],
        "optional": true
      },
      {
        "command": "SETID",
        "name": ["key", "id-or-$"],
        "type": ["key", "string"],
        "optional": true
      },
      {
        "command": "DESTROY",
        "name": ["key", "groupname"],
        "type": ["key", "string"],
        "optional": true
      },
      {
        "command": "DELCONSUMER",
        "name": ["key", "groupname", "consumername"],
        "type": ["key", "string", "string"],
        "optional": true
      }
    ],
    "since": "5.0.0",
    "group": "stream"
  },
  "XREADGROUP": {
    "summary": "Return new entries from a stream using a consumer group, or access the history of the pending entries for a given consumer. Can block.",
    "complexity": "For each stream mentioned: O(log(N)+M) with N being the number of elements in the stream and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with COUNT), you can consider it O(log(N)). On the other side, XADD will pay the O(N) time in order to serve the N clients blocked on the stream getting new data.",
    "arguments": [
      {
        "command": "GROUP",
        "name": ["group", "consumer"],
        "type": ["string", "string"]
      },
      {
        "command": "COUNT",
        "name": "count",
        "type": "integer",
        "optional": true
      },
      {
        "command": "BLOCK",
        "name": "milliseconds",
        "type": "integer",
        "optional": true
      },
      {
        "name": "streams",
        "type": "enum",
        "enum": ["STREAMS"]
      },
      {
        "name": "key",
        "type": "key",
        "multiple": true
      },
      {
        "name": "ID",
        "type": "string",
        "multiple": true
      }
    ],
    "since": "5.0.0",
    "group": "stream"
  },
  "XACK": {
    "summary": "Marks a pending message as correctly processed, effectively removing it from the pending entries list of the consumer group. Return value of the command is the number of messages successfully acknowledged, that is, the IDs we were actually able to resolve in the PEL.",
    "complexity": "O(log N) for each message ID processed.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "group",
        "type": "string"
      },
      {
        "name": "ID",
        "type": "string",
        "multiple": true
      }
    ],
    "since": "5.0.0",
    "group": "stream"
  },
  "XCLAIM": {
    "summary": "Changes (or acquires) ownership of a message in a consumer group, as if the message was delivered to the specified consumer.",
    "complexity": "O(log N) with N being the number of messages in the PEL of the consumer group.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "group",
        "type": "string"
      },
      {
        "name": "consumer",
        "type": "string"
      },
      {
        "name": "min-idle-time",
        "type": "string"
      },
      {
        "name": "ID",
        "type": "string",
        "multiple": true
      },
      {
        "command": "IDLE",
        "name": "ms",
        "type": "integer",
        "optional": true
      },
      {
        "command": "TIME",
        "name": "ms-unix-time",
        "type": "integer",
        "optional": true
      },
      {
        "command": "RETRYCOUNT",
        "name": "count",
        "type": "integer",
        "optional": true
      },
      {
        "name": "force",
        "enum": ["FORCE"],
        "optional": true
      },
      {
        "name": "justid",
        "enum": ["JUSTID"],
        "optional": true
      }
    ],
    "since": "5.0.0",
    "group": "stream"
  },
  "XPENDING": {
    "summary": "Return information and entries from a stream consumer group pending entries list, that are messages fetched but never acknowledged.",
    "complexity": "O(log(N)+M) with N being the number of elements in the consumer group pending entries list, and M the number of elements being returned. When the command returns just the summary it runs in O(1) time assuming the list of consumers is small, otherwise there is additional O(N) time needed to iterate every consumer.",
    "arguments": [
      {
        "name": "key",
        "type": "key"
      },
      {
        "name": "group",
        "type": "string"
      },
      {
        "name": ["start", "end", "count"],
        "type": ["string", "string", "integer"],
        "optional": true
      },
      {
        "name": "consumer",
        "type": "string",
        "optional": true
      }
    ],
    "since": "5.0.0",
    "group": "stream"
  }
};

function isArray(obj) {      
      return Object.prototype.toString.call(obj) === '[object Array]';       
}

var curCommand=''; 

$(document).ready(function(){
  var curUrl = window.location.href;
	var curCmd = curUrl.substring(curUrl.lastIndexOf("/")+1,curUrl.lastIndexOf("."));
	curCommand = curCmd.toUpperCase();
	curCommand = curCommand.replace("-"," ");
	
	var commandName = $('.command .name');
	if(commandName) commandName.html(curCommand);
	
	var commandArg = $('.command .arg');
	if(commandArg) commandArg.html(getCommandArgs(rediscn_commands[curCommand]));
	
	var metadata = $('.metadata');
	if(metadata){
		metadata.html(getMetadata(rediscn_commands[curCommand]));
	}
});

function getCommandArgs(command)
{
	var returnArgs = "";
	
	if(command && command.arguments){
		for(var i=0;i<command.arguments.length;i++){
			var argItem = command.arguments[i];
			
			if(argItem.type == 'key'){
				if(argItem.multiple){
					if(returnArgs==""){
						returnArgs += argItem.name + " ["+argItem.name+" ...]";
					}else{
						returnArgs += " " + argItem.name + " ["+argItem.name+" ...]";
					}
				}else{
					if(returnArgs==""){
						returnArgs += argItem.name;
					}else{
						returnArgs += " " + argItem.name;
					}
				}
			}else if(argItem.enum){
				var enumStr = "";
				for(var j=0;j<argItem.enum.length;j++){
					if(j>0){
						enumStr += "|";
					}
					enumStr += argItem.enum[j];
				}
				if(argItem.optional === true){
					returnArgs += " [" + enumStr + "]";
				}else{
					returnArgs += " " + enumStr + "";
				}
			}else if(argItem.command){ 
				var enumStr = argItem.command;
				if(argItem.name){
					if(isArray(argItem.name)){ // 如果是数组
						for(var j=0;j<argItem.name.length;j++){
							enumStr += " " +argItem.name[j];
						}
					}else{
						enumStr += " " +argItem.name;
					}
				}
				
				if(argItem.optional === true){
					returnArgs += " [" + enumStr + "]";
				}else{
					returnArgs += " " + enumStr + "";
				}
			}else{
				var enumStr = "";
				if(argItem.name){
					if(isArray(argItem.name)){ // 如果是数组
						for(var j=0;j<argItem.name.length;j++){
							if(j>0){
								enumStr += " ";
							}
							enumStr += argItem.name[j];
						}
				  }else{
				  	enumStr += argItem.name;
				  }
				  
				  if(argItem.multiple){ // 重复
				  	enumStr = enumStr + " ["+enumStr+" ...]";
				  }
				}
				if(argItem.optional === true){
					returnArgs += " [" + enumStr + "]";
				}else{
					returnArgs += " " + enumStr + "";
				}
			}
		}
	}
	
	return returnArgs;
}

// <p><strong>Available since 1.2.0.</strong></p>
// <p><strong>Time complexity:</strong> O(log(N)) for each item added, where N is the number of elements in the sorted set.</p>
                
function getMetadata(command)
{
	var metaDataHtml = "";
	
	if(command.since){
		metaDataHtml+="<p><strong>起始版本："+command.since+"</strong></p>";
	}
	if(command.complexity){
		metaDataHtml+="<p><strong>时间复杂度：</strong>"+command.complexity+"</p>";
	}
	
	return metaDataHtml;
}

// 标记当前命令加粗
function markBold(){
	var curUrl = document.location.href;
	var lastIndex = curUrl.lastIndexOf("/");
	var commandFix = curUrl.substr(lastIndex);
	debugLog('commandFix:'+commandFix);
	
	$('.article-aside a').each(function(){
		var hrefTag = $(this).attr('href');
		var commandIndex = hrefTag.indexOf(commandFix);
		//debugLog('hrefTag:'+hrefTag+',commandIndex='+commandIndex);
		
		if(commandIndex>0){
			$(this).css('font-weight','bold');
		}
	});
}

$(document).ready(function(){ 
	if($('.article-aside').length){
		markBold();
	}
});
