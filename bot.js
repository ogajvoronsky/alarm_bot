const TelegramBot = require('node-telegram-bot-api');
const allowed_chat_id =  require('./allowed_chat_id');  // check chat_id
var alarm = require('./alarm');  // communication with alarm system
var token = require('./token'); // return telegram token
var express = require('express');
var http = require('http');
var url = require('url');
var app = express();
const post_chat_id = '-319395610';
const cam_picture_url = 'http://admin:m607Remeniv@192.168.44.190/Streaming/channels/101/picture';



// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true} );


var alarm_options = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Поставити на охорону', callback_data: 'ON' }],
      [{ text: 'Зняти з охорони', callback_data: 'OFF' }],
    ]
  })
};

bot.onText(/alarm (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const cmd = match[1]; 

  if ( allowed_chat_id(msg.chat.id) ) {
    alarm.send_cmd(cmd, function(validation_result) {
      if ( validation_result === false ) {
        bot.sendMessage(msg.chat.id, 'Доступні дії:', alarm_options);
       } 
    });
     
  };
});

bot.on('callback_query', function(msg) {
  console.log(msg);
  
  if ( allowed_chat_id(msg.message.chat.id) ) {
        alarm.send_cmd(msg.data, (validation_result) => {});
        bot.sendMessage(msg.message.chat.id, msg.from.first_name + " виконує дію:");
  }
});

// Recieve web-hook from CCTV
app.get('/motion-web-hook', function (req, res) {
  

  if sent_time 
  //send picture to chat

  http.get(url.parse(cam_picture_url), function(res) {
    var data = [];

    res.on('data', function(chunk) {
        data.push(chunk);
    }).on('end', function() {
        //at this point data is an array of Buffers
        //so Buffer.concat() can make us a new Buffer
        //of all of them together
        var picture = Buffer.concat(data);
        bot.sendPhoto(post_chat_id, picture);
        sent_time = new Date();

      });
  });

  res.send('Picture sent to chat..');
});


app.listen(8880);




