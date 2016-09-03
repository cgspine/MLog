/**
 * Created by cgspine on 16/8/27.
 */

require('pkginfo')(module, 'version')

var assign = require('object-assign'),
    Logger = require('./logger')

var MLog = module.exports

var loggers = MLog.loggers = []

MLog.Logger = Logger
MLog.targets  =  {
    Console: require('./target/console'),
    File: require('./target/file')
}

MLog.get = function(name,options){

    if (options === void 0 && typeof name === 'object') {
        options = name
        name = options.name
    }

    name = name || 'default'
    options = options || {}

    var index = Object.keys(loggers).indexOf(name);
    if (index !== -1) {
        var logger = loggers[name];
        assign(logger.options, options)
        return logger
    }

    logger = new Logger(name, options)
    loggers[name] = logger
    return logger
};