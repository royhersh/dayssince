const mongoose = require('mongoose');
const ItemSchema = require('./items');
const { Schema } = mongoose;

const UserSchema = new Schema({
  googleId: String,
  items: [ItemSchema],
});

const User = mongoose.model('users', UserSchema);
module.exports = User;
