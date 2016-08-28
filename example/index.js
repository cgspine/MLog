/**
 * Created by cgspine on 16/8/28.
 */

var MLog = require('../lib')

var logger = MLog.get()
var fileTarget = new MLog.File({
    logDir: __dirname,
    filename: 'log'
})
logger.addTarget(fileTarget)

for(var i=0;i<100;i++) {
    logger.i('demo','haha')
}