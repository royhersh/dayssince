const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/users.js');
require('./models/items.js');
require('./services/passport');

const authRoutes = require('./routes/authRoutes');
const daysSinceRoutes = require('./routes/daysSinceRoutes');

mongoose.set('useNewUrlParser', true);
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(keys.mongoURI);
}

const app = express();
// app.use(
//   cookieSession({
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     keys: [keys.cookieKey]
//   })
// );
app.use(bodyParser.json());
app.use(passport.initialize());
// app.use(passport.session());

authRoutes(app);
app.use('/dayssince/api', daysSinceRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

module.exports = app;
