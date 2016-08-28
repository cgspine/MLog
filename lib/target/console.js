/**
 * Created by cgspine on 16/8/27.
 */

var levels = require('../level')

function Console(options) {
    this.options = options || {}
    this.level = this.options.level || levels.info.value
}

Console.prototype = {
    constructor: Console,

    log: function (tag,level, content) {
        var oLevel = levels[level]
        console.log('[' + oLevel.show +'] ' + tag + ': ' + content)
    },
    name: 'console'
}



module.exports = Console