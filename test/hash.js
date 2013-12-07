var should = require('should');

var hash = require('../lib/hash').hash;

describe('createHash', function () {
    it('should create a valid SHA-1 hash of the given string', function () {
        hash('http://stephentudor.com').should.equal('3963e9443d53f13393bf314ad514af6b730798e7');
    });
});
