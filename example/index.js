/**
 * Created by cgspine on 16/8/28.
 */

var MLog = require('../lib')

var logger = MLog.get()
var fileTarget = new MLog.File({
    logDir: __dirname,
    filename: 'log',
    rollIntervals: 24*60*60,
    rollMiniSize: 1024
})
logger.removeTarget('console')
logger.addTarget(fileTarget)

for(var i=0;i<100;i++) {
    logger.i('demo','haha')
}