// MODULE: hikvision cam
var unirest = require('unirest');
const cam_picture_url = 'http://admin:m607Remeniv@192.168.44.190/Streaming/channels/101/picture';


module.exports.get_picture = async function(picture) {
    // var result = '';
    // await unirest.get(cam_picture_url, ,, (response) => { result = response });
     unirest.get(cam_picture_url);
  };