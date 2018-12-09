const TelegramBot = require('node-telegram-bot-api');
const allowed_chat_id =  require('./allowed_chat_id');  // check chat_id
var alarm = require('./alarm');  // communication with alarm system
var token = require('./token'); // return telegram token

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
  if ( allowed_chat_id(msg.message.chat.id) ) {
        alarm.send_cmd(msg.data, (validation_result) => {})
  }
});
