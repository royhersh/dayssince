const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const app = require('../serverApp');
const tokenForUser = require('../services/genToken');
const User = require('../models/users');
const Item = require('../models/items');

const MONGO_URL = 'mongodb://localhost/users_test';

let john, userId, token;

before(done => {
  // Connect to database
  mongoose.set('useFindAndModify', false);
  mongoose.connect(MONGO_URL, { useNewUrlParser: true });
  mongoose.connection.once('open', done).on('error', error => {
    console.log('WARNING:', error.name);
    process.exit(1);
  });
});

beforeEach(done => {
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

  john.save().then(user => {
    expect(john.isNew).false;
    userId = user.id;
    token = tokenForUser(user);
    // console.log(tokenForUser(user));
    done();
  });
});

beforeEach(done => {
  done();
});

describe('Testing dayssince API', () => {
  it('Check version', done => {
    request(app)
      .get('/dayssince/api/version')
      .set('Authorization', token)
      .expect(200)
      .end((err, { body }) => {
        expect(body.version).to.equal('develop');
        done();
      });
  });

  it('POST - Add item', done => {
    const now = Date.now();
    request(app)
      .post('/dayssince/api/items')
      .set('Authorization', token)
      .send({
        date: now,
        title: 'new title',
      })
      .expect(200)
      .end((err, { body }) => {
        if (err) return done(err);
        expect(body).to.have.property('_id');
        expect(new Date(body.date).getTime()).to.equal(now);
        expect(body.title).to.equal('new title');

        User.findById(userId).then(savedUser => {
          expect(savedUser.items.find(item => item._id == body._id)).to.be.an(
            'object'
          );
          done();
        });
      });
  });

  it('GET - get user items', done => {
    request(app)
      .get('/dayssince/api/items')
      .set('Authorization', token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        if (err) return done(err);
        expect(body).to.be.an('array');
        expect(body.length).to.equal(1);
        expect(body[0].title).to.equal('sample Title');

        done();
      });
  });

  it('PUT - update item', done => {
    const itemToUpdateId = john.items[0].id;
    const now = Date.now();

    request(app)
      .put(`/dayssince/api/item/${itemToUpdateId}`)
      .set('Authorization', token)
      .send({
        date: now,
        title: 'updated titile',
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, response) => {
        const { body } = response;
        if (err) return done(err);
        expect(body).to.have.property('_id');
        expect(new Date(body.date).getTime()).to.equal(now);
        expect(body.title).to.equal('updated titile');

        User.findById(userId).then(updatedUser => {
          const updatedItem = updatedUser.items.find(
            item => item._id == itemToUpdateId
          );
          expect(updatedItem.title).to.equal('updated titile');
          expect(new Date(updatedItem.date).getTime()).to.equal(now);

          done();
        });
      });
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
