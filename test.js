var http = require('http');
var url = require('url');
var date = require('date-and-time');

const cam_picture_url = 'http://admin:m607Remeniv@192.168.44.190/Streaming/channels/101/picture';

var sent_pictures_count = 0;
var sent_time;
date.locale('uk');


now = new Date();

sent_time = date.addSeconds(now, 1);

console.log(now - sent_time);



// http.get(url.parse(cam_picture_url), function(res) {
//     var data = [];

//     res.on('data', function(chunk) {
//         data.push(chunk);
//     }).on('end', function() {
//         //at this point data is an array of Buffers
//         //so Buffer.concat() can make us a new Buffer
//         //of all of them together
//         var buffer = Buffer.concat(data);
//         console.log(buffer.toString('base64'));
//     });
// });


