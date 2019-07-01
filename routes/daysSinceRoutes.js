// dayssince/api
const router = require('express').Router();
const passport = require('passport');
const mongoose = require('mongoose');

const keys = require('../config/keys');
const Item = mongoose.model('items');

const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/version', requireAuth, (req, res) => {
  res.send({ version: 'develop' });
});

// Create item(s)
router.post('/items', requireAuth, (req, res) => {});

// Read Items
router.post('/items', requireAuth, (req, res) => {});

// Update Item
router.put('/item/:id', requireAuth, (req, res) => {});

// Delete Item
router.delete('/item/:id', requireAuth, (req, res) => {});

module.exports = router;
