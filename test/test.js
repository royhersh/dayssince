const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const app = require('../serverApp');
const tokenForUser = require('../services/genToken');
const User = require('../models/users');

const MONGO_URL = 'mongodb://localhost/users_test';

let john, userId, token;

before(done => {
  // Connect to database
  mongoose.set('useFindAndModify', false);
  mongoose.connect(MONGO_URL, { useNewUrlParser: true });
  mongoose.connection.once('open', done).on('error', error => {
    if (error.name === 'MongoNetworkError')
      console.log(
        "WARNING: Can't connect to mongoDB server, Have you started the server?"
      );
    else {
      console.log(error);
    }

    process.exit(1);
  });
});

beforeEach(async () => {
  // Create user for testing
  john = new User({
    googleId: 'someGoogleIdToken',
    items: [
      {
        date: Date.now(),
        title: 'sample Title',
      },
    ],
  });

  const user = await john.save();

  expect(john.isNew).false;
  userId = user.id;
  token = tokenForUser(user);
});

describe('Testing dayssince API', () => {
  it('Check version', async () => {
    const { body } = await request(app)
      .get('/dayssince/api/version')
      .set('Authorization', token)
      .expect(200);

    expect(body.version).to.equal('develop');
  });

  it('POST - Add item', async () => {
    const now = Date.now();
    const { body } = await request(app)
      .post('/dayssince/api/items')
      .set('Authorization', token)
      .send({
        date: now,
        title: 'new title',
      })
      .expect(200);

    expect(body).to.have.property('_id');
    expect(new Date(body.date).getTime()).to.equal(now);
    expect(body.title).to.equal('new title');

    const savedUser = await User.findById(userId);
    const newSavedItem = savedUser.items.find(item => item._id == body._id);
    expect(newSavedItem).to.be.an('object');
  });

  it('POST - Replace all items with new items', async () => {
    const now = Date.now();
    const { body } = await request(app)
      .post('/dayssince/api/items/replace')
      .set('Authorization', token)
      .send([
        {
          _id: 1562163678455,
          date: 1562163678455,
          editMode: false,
          title: 'Hello',
        },
        {
          _id: 1562163673811,
          date: 1562163673811,
          editMode: false,
          title: 'World',
        },
      ])
      .expect(200);

    expect(body.result).to.equal('ok');

    const user = await User.findById(userId);
    expect(user.items.find(item => item.title === 'sample Title')).to.not.exist;
    expect(user.items.find(item => item.title === 'Hello')).to.exist;
    expect(user.items.find(item => item.title === 'World')).to.exist;
  });

  it('POST - Merge database items with new items', async () => {
    const now = Date.now();
    const { body } = await request(app)
      .post('/dayssince/api/items/merge')
      .set('Authorization', token)
      .send([
        {
          _id: 1562163678455,
          date: 1562163678455,
          editMode: false,
          title: 'Hello',
        },
        {
          _id: 1562163673811,
          date: 1562163673811,
          editMode: false,
          title: 'World',
        },
      ])
      .expect(200);
    expect(body).to.be.an('array');

    const user = await User.findById(userId);
    expect(user.items.find(item => item.title === 'sample Title')).to.exist;
    expect(user.items.find(item => item.title === 'Hello')).to.exist;
    expect(user.items.find(item => item.title === 'World')).to.exist;
  });

  it('GET - get user items', async () => {
    const { body } = await request(app)
      .get('/dayssince/api/items')
      .set('Authorization', token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body).to.be.an('array');
    expect(body.length).to.equal(1);
    expect(body[0].title).to.equal('sample Title');
  });

  it('PUT - update item', async () => {
    const itemToUpdateId = john.items[0].id;
    const now = Date.now();

    const { body } = await request(app)
      .put(`/dayssince/api/item/${itemToUpdateId}`)
      .set('Authorization', token)
      .send({
        date: now,
        title: 'updated titile',
      })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body).to.have.property('_id');
    expect(new Date(body.date).getTime()).to.equal(now);
    expect(body.title).to.equal('updated titile');

    const updatedUser = await User.findById(userId);

    const updatedItem = updatedUser.items.find(
      item => item._id == itemToUpdateId
    );
    expect(updatedItem.title).to.equal('updated titile');
    expect(new Date(updatedItem.date).getTime()).to.equal(now);
  });

  it("DELETE - Delete an item from user's items", async () => {
    const userDocument = await User.findById({ _id: userId });
    const itemIdToDelete = userDocument.items[0]._id;

    await request(app)
      .delete(`/dayssince/api/item/${itemIdToDelete}`)
      .set('Authorization', token)
      .expect('Content-Type', /json/)
      .expect(200);

    const updatedUserDocument = await User.findById({ _id: userId });
    itemExistInDoc = updatedUserDocument.items.some(
      item => item.id == itemIdToDelete
    );
    expect(itemExistInDoc).false;
  });
});
