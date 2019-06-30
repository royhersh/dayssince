const passport = require('passport');
const jwt = require('jwt-simple');
const config = require('../config/keys');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res, next) => {
      console.log('Google Authenticated');
      console.log(req.user);
      res.send({ token: tokenForUser(req.user) });
    },
    (_req, res) => {
      res.redirect('/survey');
    }
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res, next) => {
    res.send(req.user);
  });

  app.get('/api/jwt', requireAuth, (req, res, next) => {
    res.send(req.user);
  });
};
