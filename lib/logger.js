/**
 * Created by cgspine on 16/8/27.
 */
var Console = require('./target/console')
var levels = require('./level')

function Logger(name, options) {
    this.name = name
    this.options = options || {}
    this.targets = Array.isArray(this.options.targets) ? this.options.targets : [(this.options.targets || new Console())]
}

var fn = Logger.prototype = {
    constructor: Logger,
    
    log: function (tag, level) {
        if(arguments.length <= 2){
            throw new Error("arguments err: please use format log(tag, level, arg1, arg2, ...)")
        }
        var content = [].slice.call(arguments, 2)
        content = content.join('\n')
        var targets = this.targets;
        targets.forEach(function (target) {
            if(target.level >= levels[level].value) {
                target.log(tag, level, content)
            }
        })
    },
    addTarget: function (target) {
        if(target && target.log && target.name) {
            if (this.getTarget(target.name)) {
                throw new Error('target exist!!!')
            }
            this.targets.push(target)
        } else {
            throw new Error('error target')
        }
    },
    getTarget: function (name) {
        for (var i =0; i < this.targets.length; i++) {
            var target = this.targets[i]
            if (target.name === name) {
               return target 
            }
        }
        return null
    }
}

Object.keys(levels).forEach(function (n) {
    var val = levels[n]
    fn[n] =fn[val.short] = function (tag) {
        var args = [].slice.apply(arguments)
        args.splice(1,0,n)
        this.log.apply(this,args)
    }
})

module.exports = Logger