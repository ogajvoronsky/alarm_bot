const TelegramBot = require('node-telegram-bot-api');
var Client = require('node-rest-client').Client;
var token = require('./token');



// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
var client = new Client();
const openhab_item_url = 'http://localhost:8080/rest/items/alarm_mode/state';
const allowed_chat_id =  require('./allowed_chat_id.js')

const cmdON = {
    headers: { "Content-Type": "text/plain",
               "Accept": "application/json"},
    data: "ON"
};

const cmdOFF = {
    headers: { "Content-Type": "text/plain",
               "Accept": "application/json"},
    data: "OFF"
};


bot.onText(/alarm (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; 

  if ( allowed_chat_id(chatId) ) {
    var cmd = resp.trim().toUpperCase()
    if ( cmd === 'ON') {
      client.put(openhab_item_url, cmdON, function(data, response) {
          console.log(data);
          console.log(response);
      });
    }

    if (cmd === 'OFF') {
      client.put(openhab_item_url, cmdOFF, function(data, response) {
          console.log(data);
          console.log(response);
      });
    };
  };
  console.log("ChatID: ", chatId);
});

