/**
 * Created by cgspine on 16/8/28.
 */
var fs = require('fs')

/**
 * 补0
 * @param n
 * @param width
 * @returns {string}
 */
module.exports.pad = function (n,width) {
    width = width || 2;
    var str = n+'';

    while (str.length < width) {
        str = "0" + str;
    }

    return str;
};

/**
 * 获取文件大小,如果文件不存在,返回0
 * @param file
 * @returns {number}
 */
module.exports.fileSize = function(file){
    var fileSize = 0;
    try {
        fileSize = fs.statSync(file).size;
    } catch (e) {
        // file does not exist
    }
    return fileSize;
};

module.exports.ISO8601_FORMAT = "yyyy-MM-dd hh:mm:ss.SSS";
module.exports.ISO8601_WITH_TZ_OFFSET_FORMAT = "yyyy-MM-ddThh:mm:ssO";
module.exports.DATETIME_FORMAT = "dd MM yyyy hh:mm:ss.SSS";
module.exports.ABSOLUTETIME_FORMAT = "hh:mm:ss.SSS";

/**
 *
 * @param format
 * @param date
 * @param timezoneOffset:如果当地时间早于UTC时间(在UTC时区以东，例如亚洲地区)，则返回值为负；如果当地时间晚于UTC时间(在UTC时区以西，例如美洲地区)，则返回值为正
 * @returns {string}
 */
module.exports.transformDateString = function(format, date, timezoneOffset) {
    if(typeof format !== 'string'){
        timezoneOffset = date;
        date = format;
        format = null;
    }
    format = format || exports.ISO8601_FORMAT;

    // make the date independent of the system timezone by working with UTC
    if (timezoneOffset === undefined) {
        timezoneOffset = date.getTimezoneOffset();
    }
    date.setUTCMinutes(date.getUTCMinutes() - timezoneOffset);
    var vDay = pad(date.getUTCDate());
    var vMonth = pad(date.getUTCMonth()+1);
    var vYearLong = pad(date.getUTCFullYear());
    var vYearShort = pad(date.getUTCFullYear().toString().substring(2,4));
    var vYear = (format.indexOf("yyyy") > -1 ? vYearLong : vYearShort);
    var vHour  = pad(date.getUTCHours());
    var vMinute = pad(date.getUTCMinutes());
    var vSecond = pad(date.getUTCSeconds());
    var vMillisecond = pad(date.getUTCMilliseconds(), 3);
    var vTimeZone = offset(timezoneOffset);
    date.setUTCMinutes(date.getUTCMinutes() + timezoneOffset);
    var formatted = format
        .replace(/dd/g, vDay)
        .replace(/MM/g, vMonth)
        .replace(/y{1,4}/g, vYear)
        .replace(/hh/g, vHour)
        .replace(/mm/g, vMinute)
        .replace(/ss/g, vSecond)
        .replace(/SSS/g, vMillisecond)
        .replace(/O/g, vTimeZone);
    return formatted;

};


/**
 * Formats the TimeOffest
 * Thanks to http://www.svendtofte.com/code/date_format/
 * @private
 */
function offset(timezoneOffset) {
    // Difference to Greenwich time (GMT) in hours
    var os = Math.abs(timezoneOffset);
    var h = String(Math.floor(os/60));
    var m = String(os%60);
    if (h.length == 1) {
        h = "0" + h;
    }
    if (m.length == 1) {
        m = "0" + m;
    }
    return timezoneOffset < 0 ? "+"+h+m : "-"+h+m;
}