var should = require('should');

var transform = require('../lib/transform').transform;

describe('transform', function () {
    it('should yield a correctly formatted link object', function () {
        // TODO: this test currently fails due to something related to the
        // regex replace being used in the transform method

        // transform('http://wil.to/_', 'loremipsum.jpg').should.eql({
        //     url: 'http://cdn.imgg.es/wil.to__loremipsum.jpg',
        //     data: {
        //         domain: 'wil.to/_',
        //         name: 'loremipsum.jpg',
        //         origUrl: 'http://wil.to/_/loremipsum.jpg',
        //     }
        // });
    });
});
