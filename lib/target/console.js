/**
 * Created by cgspine on 16/8/27.
 */

var levels = require('../level'),
    logFormat = require('../logFormat')

/**
 * 
 * @param options
 *  - level {info | warn | debug | error}
 *  - lopUp 是否记录大于this.level的所有level
 * @constructor
 */
function Console(options) {
    options = options || {}
    this.level = options.level? levels[options.level] : levels.info
    this.logUp = options.logUp || true
}

Console.prototype = {
    constructor: Console,

    log: function (tag,level, content) {
        var oLevel = levels[level]
        if ((this.logUp && oLevel.value >= this.level.value) ||  oLevel.value === this.level.value) {
            console.log(logFormat(oLevel.show, tag, content))
        }
        
    },
    name: 'console'
}



module.exports = Console