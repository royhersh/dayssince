const mongoose = require('mongoose');
const { Schema } = mongoose;

const ItemSchema = new Schema({
  date: Date,
  title: String,
});

mongoose.model('items', ItemSchema);
