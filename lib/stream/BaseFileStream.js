/**
 * Created by cgspine on 16/8/28.
 */

var fs = require('fs'),
    debug = require('debug')('BaseFileStream'),
    Writable = require('stream').Writable,
    util = require('util'),
    helper = require('../helper')

module.exports = BaseFileStream

function BaseFileStream(filename, options) {
    if(!this instanceof BaseFileStream){
        return new BaseFileStream(filename, options)
    }
    if (!filename) {
        throw new Error("You must specify a filename");
    }
    this.opts = options || {}
    this.opts.encoding = this.opts.encoding || 'utf8';
    this.opts.mode = this.opts.mode || parseInt('0644', 8);
    this.opts.flags = this.opts.flags || 'a';

    Writable.call(this, this.opts)

    this.filename = filename;
    
    if(fs.existsSync(filename)){
        var stat = fs.statSync(filename);
        this.fileCreateTime = stat.ctime
        this.size = stat.size
    }else{
        this.fileCreateTime = new Date()
        this.size = 0
    }
    this.open()
}

util.inherits(BaseFileStream, Writable)

BaseFileStream.prototype.open = function(cb){
    this.stream = fs.createWriteStream(this.filename, this.opts)
    if(cb){
        this.stream.on('open', cb)
    }
};

BaseFileStream.prototype.close = function(cb){
    this.stream.end(cb);
};

BaseFileStream.prototype.shouldRoll = function(){
    return false;
};

BaseFileStream.prototype.roll = function(filename, cb){
    cb();
};

BaseFileStream.prototype._write = function(chunk, encoding, callback){
    var self = this;

    function writeTheChunk(){
        self.size += chunk.length;
        try{
            self.stream.write(chunk,encoding,callback);
        }catch(e){
            debug(e);
            callback();
        }
    }

    if(self.shouldRoll()){
        self.size = 0;
        self.roll(self.filename,writeTheChunk);
    }else{
        writeTheChunk();
    }
};
