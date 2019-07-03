// dayssince/api
const router = require('express').Router();
const passport = require('passport');
const mongoose = require('mongoose');

const keys = require('../config/keys');
const User = mongoose.model('users');
const Item = mongoose.model('items');

const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/version', requireAuth, (req, res) => {
  res.send({ version: 'develop' });
});

// Create item(s)
router.post('/items', requireAuth, (req, res) => {
  const newItem = new Item({
    date: req.body.date,
    title: req.body.title,
  });

  User.findByIdAndUpdate(
    req.user.id,
    {
      $push: {
        items: newItem,
      },
    },
    { new: true },
    (err, _res) => {
      res.send(newItem);
    }
  );
});

// Replace all items
router.post('/items/replace', requireAuth, (req, res) => {
  User.findByIdAndUpdate(
    req.user.id,
    {
      $set: {
        items: req.body,
      },
    },
    { new: true },
    (err, _res) => {
      res.send({ result: 'ok' });
    }
  );
});

// Read Items
router.get('/items', requireAuth, (req, res) => {
  res.send(req.user.items);
});

// Update Item
router.put('/item/:id', requireAuth, (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.user.id,
      'items._id': req.params.id,
    },
    {
      $set: {
        'items.$.title': req.body.title,
        'items.$.date': req.body.date,
      },
    },
    { new: true },
    (err, result) => {
      const updatedItem = result.items.find(item => item._id == req.params.id);
      res.send(updatedItem);
    }
  );
});

// Delete Item
router.delete('/item/:id', requireAuth, async (req, res) => {
  await User.updateOne(
    { _id: req.user.id },
    { $pull: { items: { _id: req.params.id } } }
  );

  res.send({ result: 'ok' });
});

module.exports = router;
