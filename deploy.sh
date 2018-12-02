scp bot.js ubuntu@34.212.22.18:node/
scp package.json ubuntu@34.212.22.18:node/
scp ecosystem.config.js ubuntu@34.212.22.18:node/
ssh ubuntu@34.212.22.18 "cd node && npm install"
ssh ubuntu@34.212.22.18 "pm2 delete all"
ssh ubuntu@34.212.22.18 "cd node && pm2 start ecosystem.config.js"
