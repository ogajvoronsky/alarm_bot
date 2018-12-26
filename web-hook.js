var express = require('express');
var app = express();

// Web-hook from CCTV
app.get('/video-web-hook', function (req, res) {
  
    res.send('Hello World!');
});
