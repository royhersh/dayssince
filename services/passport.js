const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const keys = require('../config/keys');
const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

const googleLogin = new GoogleStrategy(
  {
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ googleId: profile.id });
    console.log('existing user', existingUser);
    if (existingUser) {
      done(null, existingUser);
    } else {
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
    /*       console.log('accessToken', accessToken);
      console.log('refreshToken', refreshToken);
      console.log('profile', profile); */
  }
);

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: keys.secret,
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) {
      console.log('errr');
      return done(err, false);
    }

    if (user) {
      console.log('Found user with JWT:', user);
      done(null, user);
    } else {
      console.log('JWT: Error - did not find user');

      done(null, false);
    }
  });
});

passport.use(googleLogin);
passport.use(jwtLogin);
