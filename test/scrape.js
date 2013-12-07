var should = require('should');

var fs = require('fs');
var scrape = require('../lib/scrape');

describe('compareItems', function () {
    it('should throw error if A and B are undefined', function () {
        scrape.compareItems.should.throw();
    });
    it('should throw error if A or B are not the expected type', function () {
        scrape.compareItems.bind(scrape, 'abc', { data: { name: 'def' } }).should.throw();
        scrape.compareItems.bind(scrape, { data: { name: 'abc' } }, 'def').should.throw();
    });
    it('should throw error if A and B are not the expected type', function () {
        scrape.compareItems.bind(scrape, 'abc', 'def').should.throw();
    });
    it('should throw error if A or B does not have the data property', function () {
        scrape.compareItems.bind(scrape, { name: 'abc' }, { data: { name: 'def' } }).should.throw();
        scrape.compareItems.bind(scrape, { data: { name: 'abc' } }, { name: 'def' }).should.throw();
    });
    it('should throw error if A and B do not have the data property', function () {
        scrape.compareItems.bind(scrape, { name: 'abc' }, { name: 'def' }).should.throw();
    });
    it('should throw error if A or B does not have the name property', function () {
        scrape.compareItems.bind(scrape, { data: { foo: 'abc' } }, { data: { name: 'def' } }).should.throw();
        scrape.compareItems.bind(scrape, { data: { name: 'abc' } }, { data: { foo: 'def' } }).should.throw();
    });
    it('should throw error if A and B do not have the name property', function () {
        scrape.compareItems.bind(scrape, { data: { foo: 'abc' } }, { data: { foo: 'def' } }).should.throw();
    });
    it('should return -1 if A.name < B.name', function () {
        scrape.compareItems({ data: { name: 'abc' } }, { data: { name: 'def' } }).should.be.equal(-1);
    });
    it('should return 1 if A.name > B.name', function () {
        scrape.compareItems({ data: { name: 'def' } }, { data: { name: 'abc' } }).should.be.equal(1);
    });
    it('should return 0 if A.name == B.name', function () {
        scrape.compareItems({ data: { name: 'abc' } }, { data: { name: 'abc' } }).should.be.equal(0);
    });
    it('should correctly sort an array of valid objects', function () {
        [
            { data: { name: 'jeanmichel' } },
            { data: { name: 'kiril1' } },
            { data: { name: 'quidmonkey' } },
            { data: { name: 'chronicles' } },
            { data: { name: 'brophdawg' } },
            { data: { name: 'trashton' } },
            { data: { name: 'kiril0' } },
            { data: { name: 'tim' } },
            { data: { name: 'huntaur' } },
            { data: { name: 'tudes' } },
            { data: { name: 'ryan' } }
        ].sort(scrape.compareItems).should.eql([
            { data: { name: 'brophdawg' } },
            { data: { name: 'chronicles' } },
            { data: { name: 'huntaur' } },
            { data: { name: 'jeanmichel' } },
            { data: { name: 'kiril0' } },
            { data: { name: 'kiril1' } },
            { data: { name: 'quidmonkey' } },
            { data: { name: 'ryan' } },
            { data: { name: 'tim' } },
            { data: { name: 'trashton' } },
            { data: { name: 'tudes' } }
        ]);
    });
});

describe('flattenResults', function () {
    it('should throw error if a param is passed of an unexpected type', function () {
        scrape.flattenResults.bind(scrape, 'abc').should.throw();
    });
    it('should throw error if no param is passed', function () {
        scrape.flattenResults.bind(scrape).should.throw();
    });
    it('should throw error if the param passed an empty array', function () {
        scrape.flattenResults.bind(scrape, []).should.throw();
    });
    it('should return a flattened array', function () {
        var flattened = scrape.flattenResults([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
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
        scrape.serializeResults(obj).should.equal('[{"id":"foo","name":"bar"},{"id":"baz","name":"foobar"}]');
    });
});

describe('outputFile', function () {
    var str = '{"foo":"bar"}';
    var filepath = 'test.json';

    it('should write a JSON file to disk without error', function (done) {
        scrape.outputFile(str, filepath, function (err) {
            if (err) return done(err);
            fs.readFile(filepath, { encoding: 'utf8' }, function (err, data) {
                if (err) return done(err);
                data.should.equal(str);
                fs.unlink(filepath, done);
            });
        });
    });

    it('should throw error if arguments are invalid', function () {
        scrape.outputFile.bind(scrape, '', filepath).should.throw();
        scrape.outputFile.bind(scrape, null, filepath).should.throw();
        scrape.outputFile.bind(scrape, undefined, filepath).should.throw();
        scrape.outputFile.bind(scrape, {}, filepath).should.throw();
        scrape.outputFile.bind(scrape, str, '').should.throw();
        scrape.outputFile.bind(scrape, str, null).should.throw();
        scrape.outputFile.bind(scrape, str, undefined).should.throw();
        scrape.outputFile.bind(scrape, str, {}).should.throw();
        scrape.outputFile.bind(scrape, str, filepath, 'durr').should.throw();
        scrape.outputFile.bind(scrape, str, filepath, null).should.throw();
        scrape.outputFile.bind(scrape, str, filepath, {}).should.throw();
        scrape.outputFile.bind(scrape, str, filepath).should.throw();
    });
});

