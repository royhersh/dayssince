const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
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
  )
);

// prod: royhersh/ gspNMZh4rq2deHy3
// mongodb+srv://royhersh:gspNMZh4rq2deHy3@cluster0-pobqc.mongodb.net/test?retryWrites=true&w=majority
// mongodb+srv://royhersh:<password>@cluster0-pobqc.mongodb.net/test?retryWrites=true&w=majority
//clientid: 954550048330-k1sa3gbmi9ddp6sthgn9cg8kc5229ceb.apps.googleusercontent.com
// clientSecret: SqkvPWLr9mg0JIC25qqBpshe;
