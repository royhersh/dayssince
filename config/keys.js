// keys.js
if (process.env.NODE_ENV === 'production') {
  console.log('Using Prod Keys');
  module.exports = require('./prod');
} else {
  console.log('Using Dev Keys');
  module.exports = require('./dev');
}
