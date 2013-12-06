var request = require('request'),
    should = require('should'),
    sites = require('../config.js').sites;

describe('Sites are accessible', function() {
    var urls = sites.map(function (site) {
                         return site.url;
                     }).filter(function (url) {
                         return (typeof url === 'string' && url);
                     });

    urls.forEach(function (url) {
        it(url + ' should be online', function () {
            request(url + '/', function(error, result, body) {
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
});
