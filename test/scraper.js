var scraper = require('../lib/scraper'),
    should = require('should'),
    fs = require('fs');

describe('compareItems', function () {
    it('should throw error if A is not the expected type', function () {
        scraper.compareItems.bind(scraper, 'abc', { name: 'def' }).should.throw();
    });
    it('should throw error if B is not the expected type', function () {
        scraper.compareItems.bind(scraper, { name: 'abc' }, 'def').should.throw();
    });
    it('should throw error if A and B are not the expected type', function () {
        scraper.compareItems.bind(scraper, 'abc', 'def').should.throw();
    });
    it('should throw error if A and B are undefined', function () {
        scraper.compareItems.should.throw();
    });
    it('should return -1 if A.name < B.name', function () {
        scraper.compareItems({ name: 'abc' }, { name: 'def' }).should.be.equal(-1);
    });
    it('should return 1 if A.name > B.name', function () {
        scraper.compareItems({ name: 'def' }, { name: 'abc' }).should.be.equal(1);
    });
    it('should return 0 if A.name == B.name', function () {
        scraper.compareItems({ name: 'abc' }, { name: 'abc' }).should.be.equal(0);
    });
    it('should correctly sort an array of objects', function () {
        [
            { name: 'john' },
            { name: 'stephen' },
            { name: 'abe' },
            { name: 'chris' },
            { name: 'matt' },
            { name: 'ashton' },
            { name: 'scott' },
            { name: 'peter' },
            { name: 'mingma' },
            { name: 'ryan' }
        ].sort(scraper.compareItems).should.eql([
            { name: 'abe' },
            { name: 'ashton' },
            { name: 'chris' },
            { name: 'john' },
            { name: 'matt' },
            { name: 'mingma' },
            { name: 'peter' },
            { name: 'ryan' },
            { name: 'scott' },
            { name: 'stephen' }
        ]);
    });
});

describe('flattenResults', function () {
    it('should throw error if a param is passed of an unexpected type', function () {
        scraper.flattenResults.bind(scraper, 'abc').should.throw();
    });
    it('should throw error if no param is passed', function () {
        scraper.flattenResults.bind(scraper).should.throw();
    });
    it('should throw error if the param passed an empty array', function () {
        scraper.flattenResults.bind(scraper, []).should.throw();
    });
    it('should return a flattened array', function () {
        var flattened = scraper.flattenResults([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
        flattened.should.eql([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
});

describe('serializeResults', function () {
    it('should output valid JSON', function () {
        var obj = [{
            id: 'foo',
            name: 'bar'
        }, {
            id: 'baz',
            name: 'foobar'
        }];
        scraper.serializeResults(obj).should.equal('[{"id":"foo","name":"bar"},{"id":"baz","name":"foobar"}]');
    });
});

describe('outputFile', function () {
    var str = '{"foo":"bar"}';
    var filepath = 'test.json';

    it('should write a JSON file to disk without error', function (done) {
        scraper.outputFile(str, filepath, function (err) {
            if (err) return done(err);
            fs.readFile(filepath, { encoding: 'utf8' }, function (err, data) {
                if (err) return done(err);
                data.should.equal(str);
                fs.unlink(filepath, done);
            });
        });
    });

    it('should throw error if arguments are invalid', function () {
        scraper.outputFile.bind(scraper, '', filepath).should.throw();
        scraper.outputFile.bind(scraper, null, filepath).should.throw();
        scraper.outputFile.bind(scraper, undefined, filepath).should.throw();
        scraper.outputFile.bind(scraper, {}, filepath).should.throw();
        scraper.outputFile.bind(scraper, str, '').should.throw();
        scraper.outputFile.bind(scraper, str, null).should.throw();
        scraper.outputFile.bind(scraper, str, undefined).should.throw();
        scraper.outputFile.bind(scraper, str, {}).should.throw();
        scraper.outputFile.bind(scraper, str, filepath, 'durr').should.throw();
        scraper.outputFile.bind(scraper, str, filepath, null).should.throw();
        scraper.outputFile.bind(scraper, str, filepath, {}).should.throw();
        scraper.outputFile.bind(scraper, str, filepath).should.throw();
    });
});

describe('createHash', function () {
    it('should create a valid MD5 hash of the given string', function () {
        scraper.createHash('http://stephentudor.com').should.equal('0288d1f083e5fef2c5a53d85d87e6aa5');
    });
});

describe('createLink', function () {
    it('should create a correctly formatted link object', function () {
        scraper.createLink('http://stephentudor.com', 'loremipsum.jpg').should.eql({
            id: '49bffec8347b63c8c219eb069addd18d',
            url: 'http://stephentudor.com/loremipsum.jpg',
            name: 'loremipsum.jpg',
            domain: 'stephentudor.com'
        });
    });
});

describe('harvestElements', function () {
    var body = '<div><span>foo</span><span>bar</span><span>baz</span></div>';
    it('should return an array-like object of DOM elements, simple selector', function () {
        var harvested = scraper.harvestElements(body, 'span')
        harvested.should.be.an.Object;
        harvested.length.should.eql(3);
    });
    it('should return an array-like object of DOM elements, complex selector', function () {
        var harvested = scraper.harvestElements(body, 'div > span:nth-child(2)')
        harvested.should.be.an.Object;
        harvested.length.should.eql(1);
        harvested.eq(0).text().should.eql('bar');
    });
});

describe('processRequest', function () {
    var body = '<div><a href="foo.gif">foo</a></div>';
    var site = {
        url: 'http://stephentudor.com',
        selector: 'a[href$=".gif"]'
    };

    it('should return an array', function () {
        var links = scraper.processRequest(site, body);
        links.should.be.an.Array;
        links.length.should.eql(1);
    });

    it('should return an array of properly formatted link objects', function () {
        var link = scraper.processRequest(site, body)[0];
        link.id.should.be.ok;
        link.url.should.equal('http://stephentudor.com/foo.gif');
        link.name.should.equal('foo.gif');
        link.domain.should.equal('stephentudor.com');
    });
});

