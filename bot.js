const TelegramBot = require('node-telegram-bot-api');
const allowed_chat_id =  require('./utils/allowed_chat_id');  // check chat_id
var alarm = require('./utils/alarm');  // communication with alarm system
var token = require('./utils/token'); // return telegram token
var GetPicFromCam = require('./utils/get_pic_from_cam');
var express = require('express');
var app = express();
// var http = require('http');
// var url = require('url');
var sent_pictures_count = 0;
var pics_buffer =  [];
const send_timegap = 1200000; //ms = 20minutes
const send_max_count = 10; // max pictures in timegap
const telegram_chat_id = '-319395610';
const cam_picture_url = 'http://admin:m607Remeniv@192.168.44.190/Streaming/channels/101/picture';



// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true} );


var SendTelegramPic = function(cam_picture_url, telegram_chat_id) {
  GetPicFromCam(cam_picture_url, function(picture) {
    bot.sendPhoto(telegram_chat_id, picture);
  });
};

var reset_pic_counter = function() {
  sent_pictures_count = 0;
};

var alarm_options = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Поставити на охорону', callback_data: 'ON' }],
      [{ text: 'Зняти з охорони', callback_data: 'OFF' }],
      [{ text: 'Отримати фото з камери', callback_data: 'CAM1_SHOT' }]
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

bot.onText(/c/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const cmd = match[1]; 
  if ( allowed_chat_id(msg.chat.id) ) {
    SendTelegramPic(cam_picture_url, telegram_chat_id);
  }; 
});
     

bot.on('callback_query', function(msg) {
  console.log(msg);
  
  if ( allowed_chat_id(msg.message.chat.id) ) {
    if (msg.data == 'CAM1_SHOT') { 
      SendTelegramPic();
      return; 
    };
        alarm.send_cmd(msg.data, (validation_result) => {});
        bot.sendMessage(msg.message.chat.id, msg.from.first_name + " виконує дію:");
  }
});

// Notify telegram chat
app.get('/send_telegram', function (req, res) {
  console.log(req.query.user);
  res.send(req.query.message);
});


// web-hook from CCTV
app.get('/motion-web-hook', function (req, res) {
  if (sent_pictures_count == 0) {
    setTimeout(reset_pic_counter, send_timegap);
  };
  if (sent_pictures_count < send_max_count) {
    sent_pictures_count = sent_pictures_count + 1;
    SendTelegramPic();
  };
    
  res.send('Picture sent to chat..');
});  

app.listen(8880);




