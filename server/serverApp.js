const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const keys = require('./config/keys');

require('./models/users.js');
require('./models/items.js');
require('./services/passport');

const authRoutes = require('./routes/authRoutes');
const daysSinceRoutes = require('./routes/daysSinceRoutes');

mongoose.set('useNewUrlParser', true);
if (process.env.NODE_ENV !== 'test') {
  console.log('connecto to:', keys.mongoURI);
  mongoose.connect(keys.mongoURI).catch(err => {
    console.log('ERROR - ', err);
    process.exit(1);
  });
}

const app = express();

app.use(bodyParser.json());
app.use(passport.initialize());

authRoutes(app);
app.use('/dayssince/api', daysSinceRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

module.exports = app;
