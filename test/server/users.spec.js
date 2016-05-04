(function() {
  'use strict';

  var app = require('../../app');
  var should = require('should');
  var request = require('supertest');
  var loginHelper = require('./helpers/login');

  var adminToken, adminId;

  describe('Users', function() {
    // Uncomment when ready
    // before(function(done) {
    //   loginHelper.admin(function(error, res) {
    //     if (error) {
    //       throw error;
    //     } else {
    //       adminToken = res.body.token;
    //       adminId = res.body.id;
    //     }
    //     done();
    //   });
    // });
    describe('Returns all users', function() {
      it('responds with an array of all users', function(done) {
        request(app)
          .get('/users')
          .set('x-access-token', adminToken)
          .set('Accept', 'application/json')
          .end(function(error, res) {
            should.not.exist(error);
            res.body.should.be.an.Array;
            should(res.body.length).be.exactly(2);
            done();
          });
      });
    });
    describe('Creates a new user', function() {
      it('successfully creates a new user', function(done) {
        request(app)
          .post('/users')
          .send({
            email: 'new@user.com',
            username: 'newuser',
            firstName: 'New',
            lastName: 'User',
            password: 'newPass',
            role: 'user'
          })
          .set('Accept', 'application/json')
          .end(function(error, res) {
            should.not.exist(error);
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            (res.body.message).should.containEql('created successfully');
            done();
          });
      });
      it('requires an email to be provided', function(done) {
        request(app)
          .post('/users')
          .send({
            username: 'uniquename',
            firstName: 'Unique',
            lastName: 'Name',
            password: 'uniquePass',
            role: 'user'
          })
          .set('Accept', 'application/json')
          .end(function(error, res) {
            should.not.exist(error);
            res.status.should.equal(400);
            (res.body.success).should.equal(false);
            (res.body.message).should.containEql('Email must be provided');
            done();
          });
      });
      it('requires a username to be provided', function(done) {
        request(app)
          .post('/users')
          .send({
            email: 'unique@email.com',
            firstName: 'Unique',
            lastName: 'Name',
            password: 'uniquePass',
            role: 'user'
          })
          .set('Accept', 'application/json')
          .end(function(error, res) {
            should.not.exist(error);
            res.status.should.equal(400);
            (res.body.success).should.equal(false);
            (res.body.message).should.containEql('Username must be provided');
            done();
          });
      });
      it('requires a unique email', function(done) {
        request(app)
          .post('/users')
          .send({
            email: 'new@user.com',
            username: 'uniquename',
            firstName: 'Unique',
            lastName: 'Name',
            password: 'uniquePass',
            role: 'user'
          })
          .set('Accept', 'application/json')
          .end(function(error, res) {
            should.not.exist(error);
            res.status.should.equal(409);
            (res.body.success).should.equal(false);
            (res.body.message).should.containEql('provide another email');
            done();
          });
      });
      it('requires a unique username', function(done) {
        request(app)
          .post('/users')
          .send({
            email: 'unique@email.com',
            username: 'newUser',
            firstName: 'Unique',
            lastName: 'Name',
            password: 'uniquePass',
            role: 'user'
          })
          .set('Accept', 'application/json')
          .end(function(error, res) {
            should.not.exist(error);
            res.status.should.equal(409);
            (res.body.success).should.equal(false);
            (res.body.message).should.containEql('provide another username');
            done();
          });
      });
      it('requires first name to be provided', function(done) {
        request(app)
          .post('/users')
          .send({
            email: 'unique@email.com',
            username: 'uniquename',
            lastName: 'Name',
            password: 'uniquePass',
            role: 'user'
          })
          .set('Accept', 'application/json')
          .end(function(error, res) {
            should.not.exist(error);
            res.status.should.equal(400);
            (res.body.success).should.equal(false);
            (res.body.message).should.containEql('First name must be provided');
            done();
          });
      });
      it('requires last name to be provided', function(done) {
        request(app)
          .post('/users')
          .send({
            email: 'unique@email.com',
            username: 'uniquename',
            firstName: 'Unique',
            password: 'uniquePass',
            role: 'user'
          })
          .set('Accept', 'application/json')
          .end(function(error, res) {
            should.not.exist(error);
            res.status.should.equal(400);
            (res.body.success).should.equal(false);
            (res.body.message).should.containEql('Last name must be provided');
            done();
          });
      });
      it('requires a role to be provided', function(done) {
        request(app)
          .post('/users')
          .send({
            email: 'unique@email.com',
            username: 'uniquename',
            firstName: 'Unique',
            lastName: 'Name',
            password: 'uniquePass'
          })
          .set('Accept', 'application/json')
          .end(function(error, res) {
            should.not.exist(error);
            res.status.should.equal(400);
            (res.body.success).should.equal(false);
            (res.body.message).should.containEql('Role must be provided');
            done();
          });
      });
    });
    describe('Returns all documents created by a user', function() {
      it('responds with an array of all user\'s documents', function(done) {
        request(app)
          .get('/users/adminId/documents')
          .set('x-access-token', adminToken)
          .set('Accept', 'application/json')
          .end(function(error, res) {
            should.not.exist(error);
            (res.body).should.be.an.Array;
            should(res.body.length).be.exactly(3);
            done();
          });
      });
    });
  });
})();
