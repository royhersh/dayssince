const passport = require('passport');
const tokenForUser = require('../services/genToken');

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
    (req, res) => {
      console.log('Google Authenticated');
      console.log(req.user);
      res.redirect(`/?token=${tokenForUser(req.user)}`);
    }
  );

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });

  app.get('/api/jwt', requireAuth, (req, res) => {
    res.send(req.user);
  });
};
