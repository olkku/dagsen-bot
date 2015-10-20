var fs = require('fs');
var token = require(process.env.HOME + '/.dagsen-bot-token.js');

var request = require('request');
var Telegram = require('telegram-bot');
var tg = new Telegram(token);

tg.on('message', function(msg) {
  if (!msg.text) return;

  if (!msg.text.indexOf('/mat')) {
    console.log('retreiving menu...');

    request('http://api.teknolog.fi/taffa/sv/today', function(err, res, body) {
      tg.sendMessage({
        text: body,
        chat_id: msg.chat.id
      });
    });
  } else if (!msg.text.indexOf('/ute')) {
    console.log('retreiving weather...');
    request('http://outside.aalto.fi/data.txt', function(err, res, body) {
      outside = JSON.parse(body);

      message = 'Temperatur: ' + Number(outside['gent-outside-t']).toFixed(1).replace('.', ',') + ' \xB0C\n';
      message += 'Luftfuktighet: ' + Number(outside['gent-outside-h']).toFixed(0).replace('.', ',') + ' RH%\n';
      message += 'Lufttryck: ' + Number(outside['gent-outside-b']).toFixed(0).replace('.', ',') + ' hPa\n';
      message += 'Illuminans: '  + Number(outside['gent-outside-l']).toFixed(0).replace('.', ',') + ' lx\n';

      tg.sendMessage({
        text: message,
        chat_id: msg.chat.id
      });
    });
  } else if (!msg.text.indexOf('/fredag')) {
    tg.sendMessage({
      text: new Date().getDay() === 5 ? 'IT\'S FRIDAY!' : 'Nope.',
      chat_id: msg.chat.id
    });
  } else if (!msg.text.indexOf('/onsdag') || !msg.text.indexOf('/tulttan')) {
    tg.sendMessage({
      text: new Date().getDay() === 3 ? 'Ja, det är onsdag.' : 'Nope.',
      chat_id: msg.chat.id
    });
  } else if (!msg.text.indexOf('/music')) {
    try {
      fs.readFile(process.env.HOME + '/.dagsen-bot-music.json', function(err, songs) {
        if (err) {
          console.log(err);
          return;
        }

        songs = JSON.parse(songs);
        var r = Math.floor(Math.random() * songs.length); // choose a random item from the URL list

        tg.sendMessage({
          text: songs[r],
          chat_id: msg.chat.id
        });
      });
    } catch(e) {
      console.log('no music list found! add one to ~/.dagsen-bot-music.json');
    }
  }
});

tg.start();
