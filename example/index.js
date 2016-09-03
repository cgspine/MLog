/**
 * Created by cgspine on 16/8/28.
 */

var MLog = require('../lib')

var logger = MLog.get()
var fileTarget = new MLog.targets.File({
    logDir: __dirname,
    filename: 'log.log',
    rollIntervals: 24* 60* 60 * 1000,  // 日志回滚日期间隔, 默认7天
    rollMiniSize: 1024 * 50,           // 日志回滚所需最低容量, 默认 60k
    pattern: '.yyyy-MM-dd',            // 日志回滚后缀名
    level: 'info',                     // 记录日志的level, 默认info
    logUp: true                        // ture: 记录>level的所有日志, false: 只记录此level的日志, 默认为true
})

// 添加target
logger.addTarget(fileTarget)
for(var i=0;i<10;i++) {
    logger.d('demo','haha')
}

logger.d('demo',{
    a:123,
    b:234,
    c:145
},{
    a:123,
    b:234,
    c:145
})
logger.d('haha', new Error("error"))
