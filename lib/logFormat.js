/**
 * Created by cgspine on 16/9/3.
 */

var helper = require('./helper'),
    path = require('path')

var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
var stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;
var toString = Object.prototype.toString

var format = '{{timestamp}} <{{level}}> {{file}}:{{line}} ({{tag}}) {{message}}'
var rFormat = /\{\{\s*(\w+)\s*}}/g


function formatLog(data) {
    return format.replace(rFormat, function (format, name) {
        if(name && data.hasOwnProperty(name)){
            return data[name]
        }
    })
}

/**
 *
 * @param {string} level
 * @param {string} tag
 * @param {Array} content
 * @returns {string}
 */
module.exports = function (level, tag, content) {
    var data = {
        timestamp: helper.transformDateString('yyyy-MM-dd', new Date()),
        level: level,
        tag: tag,
    }
    content = Array.isArray(content) ? content : [content]
    var messages = []
    content.forEach(function (msg) {
        if (toString.call(msg).toLowerCase() === '[object object]') {
            messages.push(JSON.stringify(msg))
        } else if(msg instanceof Error) {
            messages.push(msg.stack)
        } else {
            messages.push(msg)
        }
    })
    data.message = messages.join('\n')

    var stackList = (new Error()).stack.split('\n').slice(7); // 框架中总共调用了7层
    var stack = stackList[0]
    var caller = stackReg.exec(stack) || stackReg2.exec(stack)
    if(caller && caller.length === 5) {
        data.file = path.basename(caller[2])
        data.line = caller[3]
        data.pos = caller[4]
    }
    return formatLog(data)
}