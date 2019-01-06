var http = require('http');
var url = require('url');

module.exports = function(bot, cam_url, req, res){
    http.get(url.parse(cam_url), function(res) {
        var data = [];

        res.on('data', function(chunk) {
            data.push(chunk);
        }).on('end', function() {
            //at this point data is an array of Buffers
            //so Buffer.concat() can make us a new Buffer
            //of all of them together
            var picture = Buffer.concat(data);
            bot.sendPhoto(post_chat_id, picture);
            });
        });  
    res.send('Picture sent to chat..');
};