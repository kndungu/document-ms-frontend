(function() {
  'use strict';

  var app = require('../../server/index.js'),
    should = require('should'),
    request = require('supertest');

  describe('Home', function() {

    describe('Returns expected objected for home route', function() {
      it('responds with html text', function(done) {
        request(app)
          .get('/')
          .set('Accept', 'application/json')
          .end(function(error, res) {
            res.status.should.equal(200);
            (res.text).should.be.ok
            done();
          });
      });
    });
  });
})();
