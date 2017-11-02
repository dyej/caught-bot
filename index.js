require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});
const fs = require('fs');
const log = require('./log');

let cache = [];
let chatId = null;

function checkForDeletes() {
  cache.forEach((msg) => {
    bot.forwardMessage("@catchersmitt", chatId, msg.message_id)
      .then(res => {})
      .catch(err => {
        log(err.response);
        if (err.response.body.error_code != 429) {
          bot.sendMessage(chatId, "**Deleted by " + msg.from.first_name + "**:\n" + msg.text);
        }
        cache = [];
      });
  });
}


bot.onText(/\/hello/, (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Deleters beware.");
});

bot.onText(/.*/, (msg, match) => {
  log(msg);
  chatId = msg.chat.id;

  cache.push(msg);
  if (cache.length > 5) {
    cache.reverse();
    cache.pop();
    cache.reverse();
  }
});


(function loop () {
  setTimeout(function () {
    checkForDeletes();
    loop();
  }, 15000);
})();
