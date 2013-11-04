var request = require('request'),
    should = require('should');

describe('Sites are accessible', function() {
    it('bukk.it should be online', function() {
        request('http://bukk.it/', function(error, result, body) {
            if (error) {
                console.log(error);
                return false;
            }
            else {
                result.statusCode.should.be.equal(200);
                should.exist(body);
            }
        });
    });

    it('wil.to should be online', function() {
        request('http://wil.to/_/', function(error, result, body) {
            if (error) {
                console.log(error);
                return false;
            }
            else {
                result.statusCode.should.be.equal(200);
                should.exist(body);
            }
        });
    });

    it('misatkes should be online', function() {
        request('http://misatkes.com/', function(error, result, body) {
            if (error) {
                console.log(error);
                return false;
            }
            else {
                result.statusCode.should.be.equal(200);
                should.exist(body);
            }
        });
    });

    it('meyerweb should be online', function() {
        request('http://meyerweb.com/bkkt/', function(error, result, body) {
            if (error) {
                console.log(error);
                return false;
            }
            else {
                result.statusCode.should.be.equal(200);
                should.exist(body);
            }
        });
    });
});
