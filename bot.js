const TelegramBot = require('node-telegram-bot-api');
const allowed_chat_id =  require('./allowed_chat_id');  // check chat_id
const cam_snapshot = require('./cam_snapshot');
var alarm = require('./alarm');  // communication with alarm system
var token = require('./token'); // return telegram token
var express = require('express');
var url = require('url');
var app = express();
var sent_pictures_count = 0;
var sent_time = 0;

const send_timegap = 120000; // 20min
const send_max_count = 10; // max pictures in timegap
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
        bot.sendMessage(msg.chat.id, 'Сигналка: доступні дії:', alarm_options);
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

// Notify telegram chat
app.get('/send_telegram', function (req, res) {
  console.log(req.query.user);
  res.send(req.query.message);
});


// Receive web-hook from CCTV
app.get('/motion-web-hook', function (req, res) {
    cam_snapshot(bot, cam_picture_url, req, res);
});  

app.listen(8880);




