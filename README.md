# MLog

一个小巧的node log库

## Installation

```bashp
  npm install smlog
```

## Usage

简单控制台输出

``` js
  var smlog = require('smlog')

  // 获取默认的logger
  var logger = smlog.get()

  logger.i('tag', 'message')
  logger.w('tag', 'message')
  logger.d('tag', 'message')
  logger.e('tag', 'message')
```

使用自己的logger

``` js
  var logger = smlog.get('custom')
```

添加日志文件(按日期和大小进行回滚)

``` js
  var fileTarget = new smlog.targets.File({
    logDir: __dirname,
    filename: 'log',
    rollIntervals: 24* 60* 60 * 1000,  // 日志回滚日期间隔, 默认7天
    rollMiniSize: 1024 * 50,           // 日志回滚所需最低容量, 默认 60k
    pattern: '.yyyy-MM-dd',            // 日志回滚后缀名
    level: 'info',                     // 记录日志的level, 默认info
    logUp: true                        // ture: 记录>level的所有日志, false: 只记录此level的日志, 默认为true
  })

  // 添加target
  logger.addTarget(fileTarget)

  logger.d('tag', 'message')
```

移除target

``` js
  logger.removeTarget('console')
```

支持打印对象、错误,支持传递多个参数

``` js
    logger.d('tag',{
          a:123,
          b:234,
          c:145
     })

    logger.d('tag', new Error("error"))

    logger.d('tag', 'message1', 'message2', message3)
```