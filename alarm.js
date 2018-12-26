// MODULE: openhab rest communication
var unirest = require('unirest');
const openhab_item_url = "http://localhost:8080/rest/items/alarm_mode/state";

module.exports.send_cmd = async function(cmd, cb) {

    const put_headers = { 'Accept': 'application/json', 'Content-Type': 'text/plain' }
    var result = false;
    var command = cmd.trim().toUpperCase();
    if ( command === 'ON' || command === 'OFF' ) {
          await unirest.put(openhab_item_url, put_headers, command, (response) => {})
          result = true
    }
    cb(result) 
  };