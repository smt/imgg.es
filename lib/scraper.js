var async = require('async'),
    cheerio = require('cheerio'),
    crypto = require('crypto'),
    execTime = require('exec-time'),
    fs = require('fs'),
    request = require('request');

var protocol = 'http://';
var sites = [
    'bukk.it',
    'wil.to/_',
    'misatkes.com',
    'meyerweb.com/bkkt'
];

var profiler = new execTime('processing sites');

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

var outputFile = exports.outputFile = function outputFile(str, filepath) {
    fs.writeFile(filepath, str);
    profiler.step('done');
};

var parallelDone = exports.parallelDone = function parallelDone(err, results) {
    if (err || !results || !results.length) return console.log('async.parallel: %s - %s', err, results);
    var images;
    images = flattenResults(results).sort(compareItems);
    console.log('Processed ' + images.length + ' images');
    return outputFile(serializeResults(images), 'images.json');
};

var mapDone = exports.mapDone = function mapDone(err, results) {
    if (err || !results || !results.length) return console.log('async.map: %s - %s', err, results);
    return async.parallel(results, parallelDone);
};

var createHash = exports.createHash = function createHash(str) {
    return crypto.createHash('md5').update(str).digest('hex');
};

var createLink = exports.createLink = function createLink(origin, name) {
    var url = protocol + origin + '/' + name;
    return {
        id: createHash(url),
        url: url,
        name: name,
        origin: origin
    };
};

var harvestElements = exports.harvestElements = function harvestElements(selector, body) {
    var $ = cheerio.load(body);
    return $(selector);
};

var processRequest = exports.processRequest = function processRequest(origin, body) {
    var links = [];
    var selector = 'a[href$=".gif"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"]';
    var elements = harvestElements(selector, body);
    elements.each(function () {
        var link = createLink(origin, this.attr('href'));
        links.push(link);
    });
    return links;
};

var requestSite = exports.requestSite = function requestSite(origin, callback) {
    return callback(null, function (parallelCallback) {
        return request(protocol + origin, function (err, res, body) {
            return parallelCallback(null, processRequest(origin, body));
        });
    });
};

var start = exports.start = function start() {
    profiler.beginProfiling();
    async.map(sites, requestSite, mapDone);
};
