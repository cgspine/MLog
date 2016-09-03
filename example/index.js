/**
 * Created by cgspine on 16/8/28.
 */

var MLog = require('../lib')

var logger = MLog.get()
var fileTarget = new MLog.targets.File({
    logDir: __dirname,
    filename: 'log',
    rollIntervals: 24*60*60 * 1000,
    rollMiniSize: 1024 * 50
})
// logger.removeTarget('console')
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
