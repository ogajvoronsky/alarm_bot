var http = require('http');
var url = require('url');


module.exports =  function(cam_pitcure_url, cd) {
    http.get(url.parse(cam_picture_url), function(res) {
      var data = [];
  
      res.on('data', function(chunk) {
          data.push(chunk);
      }).on('end', function() {
          //at this point data is an array of Buffers
          //so Buffer.concat() can make us a new Buffer
          //of all of them together
          cb(Buffer.concat(data));
      })
    })
}