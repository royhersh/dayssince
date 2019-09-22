const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  console.log('NODE_ENV', process.env.NODE_ENV);
  console.log('PLATFORM', process.env.PLATFORM);
  let serverDomain;

  switch (process.env.PLATFORM) {
    case 'docker-compose':
      serverDomain = 'server';
      break;

    default:
      serverDomain = 'localhost';
  }
  app.use(
    proxy(['/api', '/auth/google', '/dayssince/api'], { target: `http://${serverDomain}:5000` }),
  );
};
