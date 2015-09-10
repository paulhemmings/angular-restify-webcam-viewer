'use strict';

var Promise = require('node-promise').Promise;
var fs = require('fs');

exports.name = 'VideoService';

// Store data
// http://codewinds.com/blog/2013-08-19-nodejs-writable-streams.html

exports.storeData = function(data, filename, callback) {
    var fullPath = __dirname + '/../images/' + filename;
    console.log('storing recording to ', fullPath);
    var wstream = fs.createWriteStream(fullPath);
    // Node.js 0.10+ emits finish when complete
    wstream.on('finish', callback);
    wstream.write(data);
    wstream.end();
}

exports.getData = function(filename, callback) {
    var fullPath = __dirname + '/../images/' + filename;
    fs.readFile(fullPath, function (err, data) {
        callback(data);
    });
}
