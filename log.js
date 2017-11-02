const fs = require('fs');

module.exports = function(data) {
  fs.appendFile('messages.log', JSON.stringify(data) + ',\n', function (err) {
    if (err) throw err;
    console.log('Message logged.');
  });
}