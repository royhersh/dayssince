const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const app = require('../serverApp');
const tokenForUser = require('../services/genToken');
const User = require('../models/users');
const Item = require('../models/items');

const MONGO_URL = 'mongodb://localhost/users_test';

let userId, token;

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
  const john = new User({
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
        expect(body).to.be.an('array');
        expect(body.length).to.equal(1);
        expect(body[0].title).to.equal('sample Title');

        done();
      });
  });
});
