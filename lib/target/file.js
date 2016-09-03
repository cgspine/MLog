/**
 * Created by cgspine on 16/8/28.
 */
var path = require('path'),
    levels = require('../level'),
    DateRollFileStream = require('../stream/DateRollFileStream'),
    logFormat = require('../logFormat')

/**
 * 
 * @param options
 * - level {info | warn | debug | error}
 * - logDir
 * - filename
 * - lopUp 是否记录大于this.level的所有level
 * @constructor
 */
function File(options) {
    options = options || {}
    this.level = options.level ? levels[options.level] : levels.info
    this.logDir = options.logDir
    this.filename = options.filename
    if(!this.logDir || !this.filename) {
        throw new Error('need logDir and filename')
    }
    this.logUp = options.logUp || true
    var logPath = path.resolve(this.logDir, this.filename)
    this.filestream = new DateRollFileStream(logPath, options)
    var self = this
    process.on('exit', safeExit)
    // process.on('SIGINT', safeExit)

    function safeExit() {
        self.close()
    }
}

File.prototype = {
    constructor: File,

    log: function (tag,level, content) {
        var oLevel = levels[level]
        if ((this.logUp && oLevel.value >= this.level.value) ||  oLevel.value === this.level.value) {
            content = Array.isArray(content) ? content : [content]
            var log = logFormat(oLevel.show, tag, content) + '\n'
            this.filestream.write(log,'utf-8')
        }
    },
    close: function () {
        this.filestream.close()
    },
    name: 'file'
}



module.exports = File