const TelegramBot = require('node-telegram-bot-api');
const allowed_chat_id =  require('./utils/allowed_chat_id.js');  // check chat_id
const alarm = require('./utils/alarm.js');  // communication with alarm system
const token = require('./utils/token.js'); // return telegram token
// const GetPicFromCam = require('./utils/get_pic_from_cam.js');
var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var sent_pictures_count = 0;
var pics_buffer =  [];
const send_timegap = 1200000; //ms = 20minutes
const send_max_count = 10; // max pictures in timegap
const telegram_chat_id = '-319395610';
const cam_picture_url = 'http://admin:m607Remeniv@192.168.44.190/Streaming/channels/101/picture';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true} );

var reset_pic_counter = function() {
  sent_pictures_count = 0;
};

var SendTelegramPic = function(telegram_chat_id) {
  http.get(url.parse(cam_picture_url), function(res) {
    var data = [];

    res.on('data', function(chunk) {
        data.push(chunk);
    }).on('end', function() {
        //at this point data is an array of Buffers
        //so Buffer.concat() can make us a new Buffer
        //of all of them together
        picture = Buffer.concat(data);
        bot.sendPhoto(telegram_chat_id, picture);
    })
  })
}
   


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
  
  const cmd = match[1]; 
  if ( allowed_chat_id(msg.chat.id) ) {
    SendTelegramPic(msg.chat.id);
  }; 
});
     

bot.on('callback_query', function(msg) {
  console.log(msg);
  
  if ( allowed_chat_id(msg.message.chat.id) ) {
    if (msg.data == 'CAM1_SHOT') { 
      SendTelegramPic(msg.chat.id);
      return; 
    };
        alarm.send_cmd(msg.data, (validation_result) => {});
        bot.sendMessage(msg.message.chat.id, msg.from.first_name + " виконує дію:");
  }
});

// Notify telegram chat - not used yet
app.get('/send_telegram', function (req, res) {
  console.log(req.query.user);
  res.send(req.query.message);
});

// web-hook from alarm system
app.get('/voice-notify', function (req, res) {
  console.log(req.query);
  res.send(req.query.message);
});

// web-hook from CCTV
app.get('/motion-web-hook', function (req, res) {
  if (sent_pictures_count == 0) {
    setTimeout(reset_pic_counter, send_timegap);
  };
  if (sent_pictures_count < send_max_count) {
    sent_pictures_count = sent_pictures_count + 1;
    SendTelegramPic(telegram_chat_id);
  };
    
  res.send('Picture sent to chat..');
});  

app.listen(8880);




