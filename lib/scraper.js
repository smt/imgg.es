var async = require('async'),
    cheerio = require('cheerio'),
    crypto = require('crypto'),
    execTime = require('exec-time'),
    fs = require('fs'),
    request = require('request');

var sites = [
    { url: 'http://bukk.it',           selector: 'a[href$=".gif"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"]' },
    { url: 'http://wil.to/_',          selector: 'a[href$=".gif"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"]' },
    { url: 'http://misatkes.com',      selector: 'a[href$=".gif"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"]' },
    { url: 'http://meyerweb.com/bkkt', selector: 'a[href$=".gif"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"]' }
];

var profiler = new execTime('Processing sites...');

var compareItems = exports.compareItems = function compareItems(a, b) {
    if (typeof a !== 'object' || typeof b !== 'object' || !a.hasOwnProperty('name') || !b.hasOwnProperty('name'))
        throw new Error('compareItems expects two objects, each with a name property');
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
};

var flattenResults = exports.flattenResults = function flattenResults(results) {
    if (typeof results !== 'object' || results.length < 1)
        throw new Error('flattenResults expects an array of arrays');
    return Array.prototype.concat.apply([], results);
};

var serializeResults = exports.serializeResults = function serializeResults(obj) {
    if (typeof obj === 'undefined') throw new Error();
    return JSON.stringify(obj);
};

var outputFile = exports.outputFile = function outputFile(str, filepath, callback) {
    if (!str || typeof str !== 'string') throw new Error();
    if (!filepath || typeof filepath !== 'string') throw new Error();
    if (!callback || typeof callback !== 'function') throw new Error();
    fs.writeFile(filepath, str, callback);
};

var parallelDone = exports.parallelDone = function parallelDone(err, results) {
    if (err || !results || !results.length) return console.log('async.parallel: %s - %s', err, results);
    var images;
    images = flattenResults(results).sort(compareItems);
    console.log('Processed ' + images.length + ' images');
    return outputFile(serializeResults(images), 'images.json', function (err) {
        if (err) throw err;
        profiler.step('Done');
    });
};

var mapDone = exports.mapDone = function mapDone(err, results) {
    if (err || !results || !results.length) return console.log('async.map: %s - %s', err, results);
    return async.parallel(results, parallelDone);
};

var createHash = exports.createHash = function createHash(str) {
    return crypto.createHash('sha1').update(str).digest('hex');
};

var createLink = exports.createLink = function createLink(domain, href) {
    var url = domain + '/' + href;
    return {
        id: createHash(url),
        url: url,
        name: href,
        domain: domain.split('//')[1]
    };
};

var harvestElements = exports.harvestElements = function harvestElements(body, selector) {
    var $ = cheerio.load(body);
    return $(selector);
};

var processRequest = exports.processRequest = function processRequest(site, body) {
    var links = [];
    var elements = harvestElements(body, site.selector);
    elements.each(function () {
        var link = createLink(site.url, this.attr('href'));
        links.push(link);
    });
    return links;
};

var requestSite = exports.requestSite = function requestSite(site, callback) {
    return callback(null, function (parallelCallback) {
        return request(site.url, function (err, res, body) {
            return parallelCallback(null, processRequest(site, body));
        });
    });
};

var start = exports.start = function start() {
    profiler.beginProfiling();
    async.map(sites, requestSite, mapDone);
};
