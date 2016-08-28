/**
 * Created by cgspine on 16/8/28.
 */

var fs = require('fs'),
    debug = require('debug')('DateRollFileStream'),
    util = require('util'),
    BaseFileStream = require('./BaseFileStream'),
    async = require('async'),
    helper = require('../helper')

module.exports = DateRollFileStream

/**
 *
 * @param filename
 * @param pattern
 * @param options
 *  - alwaysIncludePattern: 当前写入文件名是否需要pattern
 *  - rollIntervals: 开始写入新文件的时间间隔
 *  - rollMiniSize: 开始写入新文件的最小间隔
 * @param now
 * @returns {DateRollFileStream}
 * @constructor
 */
function DateRollFileStream(filename, pattern, options){
    if(!this instanceof DateRollFileStream){
        return new DateRollFileStream(filename, pattern, options)
    }
    if(pattern && typeof pattern === 'object'){
        options = pattern;
        pattern = null;
    }

    this.pattern = pattern || '.yyyy-MM-dd'
    
    this.baseFilename = filename
    this.alwaysIncludePattern = false
    options = options || {}
    if(options.alwaysIncludePattern){
        this.alwaysIncludePattern = true
        filename = this.baseFilename + helper.transformDateString(this.pattern, this.fileCreateTime)
    }

    delete options.alwaysIncludePattern
    
    BaseFileStream.call(this,filename,options)
    this.rollIntervals = options.rollIntervals || 7 * 24 * 60 * 60
    this.rollMiniSize = options.rollMiniSize || 512
}

util.inherits(DateRollFileStream,BaseFileStream);

DateRollFileStream.prototype.shouldRoll = function(){
    if (this.size < this.rollMiniSize) {
        return false
    }
    var fileCreateTime = this.fileCreateTime;
    if(new Date() - fileCreateTime < this.rollIntervals) {
        return false
    }
    return true
}

DateRollFileStream.prototype.roll = function(filename,callback){
    var prevFileCreateTime = this.fileCreateTime
    this.fileCreateTime = new Date()
    if(this.alwaysIncludePattern){
        this.filename = this.baseFilename + helper.transformDateString(this.pattern, this.fileCreateTime)
        async.series([
            this.close.bind(this),
            this.open.bind(this)
        ], callback);
    }else{
        var rollFileName = this.baseFilename + helper.transformDateString(this.pattern, prevFileCreateTime)
        async.series([
            this.close.bind(this),
            deleteAnyExistingFile,
            renameTheCurrentFile,
            this.open.bind(this)
        ], callback);
    }

    function deleteAnyExistingFile(cb) {
        //on windows, you can get a EEXIST error if you rename a file to an existing file
        //so, we'll try to delete the file we're renaming to first
        fs.unlink(rollFileName, function (err) {
            //ignore err: if we could not delete, it's most likely that it doesn't exist
            cb();
        });
    }

    function renameTheCurrentFile(cb) {
        debug("Renaming the " + filename + " -> " + newFilename);
        fs.rename(filename, rollFileName, cb);
    }
};
