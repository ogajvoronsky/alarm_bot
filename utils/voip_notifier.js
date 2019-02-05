// https://github.com/pipobscure/NodeJS-AsteriskManager

var ami = new require('asterisk-manager')('5038','10.9.0.2','alarm_notifier','alarmsecret', true);



//module.exports.voip_notify = async function(tel_number) {
    // ami.keepConnected();
    ami.action({
        'action':'originate',
        'channel':'PJSIP/002+380668859258@goip',
        'context':'alarm-remeniv',
        'exten':1234,
        'priority':1,
        'timeout':60000
      }, function(err, res) {
            console.log('RES: ', res)
      });

//};

