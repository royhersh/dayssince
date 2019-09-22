const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

const keys = require('../config/keys');
const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  console.log('serial', user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('deserial', id);
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
    console.log({ accessToken, refreshToken, profile });
    const existingUser = await User.findOne({ googleId: profile.id });
    console.log('existing user', existingUser);
    if (existingUser) {
      done(null, existingUser);
    } else {
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
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
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(googleLogin);
passport.use(jwtLogin);
