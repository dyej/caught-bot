require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});
const fs = require('fs');

let cache = [];
let chatId = null;

function checkForDeletes() {
  cache.forEach((msg) => {
    bot.forwardMessage("@catchersmitt", chatId, msg.message_id)
      .then(res => {})
      .catch(err => {
        console.log(err);
        if (err.response.body.error_code != 429) {
          bot.sendMessage(chatId, "DELETED BY " + msg.from.first_name + ": " + msg.text);
        }
        cache = [];
      });
  });
}

(function loop () {
  setTimeout(function () {
    checkForDeletes();
    loop();
  }, 16000);
})();



bot.onText(/\/hello/, (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Deleters beware.");
});

bot.onText(/.*/, (msg, match) => {
  chatId = msg.chat.id;
  checkForDeletes();

  cache.push(msg);
  if (cache.length > 4) {
    cache.reverse();
    cache.pop();
    cache.reverse();
  }
  // console.log(cache[0].text);
});
