const fs = require('fs');

module.exports = function(data) {
  const filename = './logs/' + getLogDate() + '.log'
  fs.appendFile(filename, JSON.stringify(data) + ',\n', function (err) {
    if (err) throw err;
    console.log('Message logged.');
  });
}

function getLogDate() {
  return new Date().toISOString().split('T')[0];
}