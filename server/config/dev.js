// dev.js
const mongoHost =
  process.env.PLATFORM === 'docker-compose' ? 'mongo' : 'localhost';
module.exports = {
  googleClientID:
    '175541050165-2lhk2ue8pidc5i1p5vof782huf0p1lg5.apps.googleusercontent.com', // Dev Client ID
  googleClientSecret: 'KA2waEhNd2jHGyXs2tBkWRYM', // Dev Client Secret
  mongoURI: `mongodb://${mongoHost}:27017/dayssince`,
  cookieKey: 'sdkhjasduhsdkjhksdfhj8wj',
  secret: 'top-sectet',
};
