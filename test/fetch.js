var should = require('should');

var fetch = require('../lib/fetch');

describe('fetch#processRequest', function () {
    var body = '<div><a href="foo.gif">foo</a></div>';
    var site = {
        url: 'http://stephentudor.com',
        selector: 'a[href$=".gif"]'
    };

    it('should return an array', function () {
        var links = fetch.processRequest(site, body);
        links.should.be.an.Array;
        links.length.should.eql(1);
    });

    it('should return an array of properly formatted link objects', function () {
        var link = fetch.processRequest(site, body)[0];
        // link.id.should.be.ok;
        link.url.should.equal('http://cdn.imgg.es/stephentudor.com_foo.gif');
        link.data.should.be.ok;
        link.data.domain.should.equal('stephentudor.com');
        link.data.name.should.equal('foo.gif');
        link.data.origUrl.should.equal('http://stephentudor.com/foo.gif');
    });
});
