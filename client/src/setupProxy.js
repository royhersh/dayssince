const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(proxy(['/api', '/auth/google', '/dayssince/api'], { target: 'http://server:5000' }));
};
