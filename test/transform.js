var should = require('should');

var transform = require('../lib/transform').transform;

describe('transform', function () {
    it('should yield a correctly formatted link object', function () {
        transform('http://wil.to/_', 'loremipsum.jpg').should.eql({
            url: 'http://cdn.imgg.es/wil.to___loremipsum.jpg',
            data: {
                domain: 'wil.to/_',
                name: 'loremipsum.jpg',
                origUrl: 'http://wil.to/_/loremipsum.jpg',
            }
        });
    });
});
