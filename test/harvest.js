var should = require('should');

var harvest = require('../lib/harvest').harvest;

describe('harvest', function () {
    var body = '<div><span>foo</span><span>bar</span><span>baz</span></div>';
    it('should return an array-like object of DOM elements, simple selector', function () {
        var harvested = harvest(body, 'span')
        harvested.should.be.an.Object;
        harvested.length.should.eql(3);
    });
    it('should return an array-like object of DOM elements, complex selector', function () {
        var harvested = harvest(body, 'div > span:nth-child(2)')
        harvested.should.be.an.Object;
        harvested.length.should.eql(1);
        harvested.eq(0).text().should.eql('bar');
    });
});

