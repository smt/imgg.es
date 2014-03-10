/**
 * @list dependencies
 */

var harvest = require('./harvest').harvest,
    request = require('request'),
    transform = require('./transform').transform;

/**
 *
 */

var processRequest = exports.processRequest = function processRequest(site, body) {
    // console.log('fetch#processRequest - ' + site.url);
    var links = [];
    var elements = harvest(body, site.selector);
    elements.each(function () {
        var link = transform(site.url, this.attr('href'));
        links.push(link);
    });
    return links;
};

/**
 *
 */

var fetch = exports.fetch = function fetch(site, callback) {
    // console.log('fetch#fetch - ' + site.url);
    return callback(null, function (parallelCallback) {
        // console.log('fetch#fetch :: making request - ' + site.url);
        return request(site.url, function (err, res, body) {
            // console.log('fetch#fetch :: response received - ' + site.url);
            return parallelCallback(err, processRequest(site, body));
        });
    });
};

