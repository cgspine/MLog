/**
 * Created by cgspine on 16/8/28.
 */
var path = require('path'),
    levels = require('../level'),
    DateRollFileStream = require('../stream/DateRollFileStream')

function File(options) {
    this.options = options || {}
    this.level = this.options.level || levels.info.value
    this.logDir = this.options.logDir
    this.filename = this.options.filename
    if(!this.logDir || !this.filename) {
        throw new Error('need logDir and filename')
    }
    var logPath = path.resolve(this.logDir, this.filename)
    this.filestream = new DateRollFileStream(logPath, this.options)
    this.logs = []
    var self = this
    process.on('exit', function () {
        self.log('process', info, ' process exit')
        self.close()
    })
    this.doWrite()
}

File.prototype = {
    constructor: File,

    log: function (tag,level, content) {
        var oLevel = levels[level]
        var log = '[' + oLevel.show +'] ' + tag + ': ' + content
        this.logs.push(log)
    },
    /**
     * 每次run loop结束后执行写入
     */
    doWrite: function(){
        var self = this;
        function write(){
            if(self.logs.length>0){
                var log;
                while(log = self.logs.shift()){
                    self.filestream.write(log,'utf-8')
                }
            }
            setImmediate(write);//不能用process.nextTick,因为process.nextTick总是在当前"执行栈"一次执行完
        }
        process.nextTick(write); //当前"执行栈"尾部触发
    },
    /**
     * 强制写入
     */
    enforceWrite: function () {
        var log;
        while(log = self.logs.shift()){
            self.filestream.write(log,'utf-8')
        }
    },
    close: function () {
        this.enforceWrite()
        this.filestream.close()
    },
    name: 'file'
}



module.exports = File