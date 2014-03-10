/**
 * @list dependencies
 */

var async = require('async'),
    execTime = require('exec-time'),
    fetch = require('./fetch').fetch,
    fs = require('fs'),
    resourceModel = require('./resourceModel'),
    Promise = require('node-promise').Promise;

var profiler = new execTime('Processing sites...');

var scrapePromise = new Promise();

/**
 *
 */

var start = exports.start = function start(sites) {
    // console.log('scrape#start');
    if (!(typeof sites === 'object' && sites && sites.length >>> 0)) throw new TypeError();
    profiler.beginProfiling();
    async.map(sites, fetch, mapDone);
    return scrapePromise;
};

/**
 *
 */

var compareItems = exports.compareItems = function compareItems(a, b) {
    if ((typeof a !== 'object' || typeof b !== 'object') ||
        (!a.hasOwnProperty('data') || !b.hasOwnProperty('data')) ||
        (!a.data.hasOwnProperty('name') || !b.data.hasOwnProperty('name')))
        throw new Error('compareItems expects two objects, each with a name property');
    if (a.data.name < b.data.name) return -1;
    if (a.data.name > b.data.name) return 1;
    return 0;
};

/**
 *
 */

var flattenResults = exports.flattenResults = function flattenResults(results) {
    // console.log('scrape#flattenResults');
    if (typeof results !== 'object' || results.length < 1)
        throw new Error('flattenResults expects an array of arrays');
    return Array.prototype.concat.apply([], results);
};

/**
 *
 */

var serializeResults = exports.serializeResults = function serializeResults(obj) {
    // console.log('scrape#serializeResults');
    if (typeof obj === 'undefined') throw new Error();
    return JSON.stringify(obj);
};

/**
 *
 */

var outputFile = exports.outputFile = function outputFile(str, filepath, callback) {
    // console.log('scrape#outputFile');
    if ((!str || typeof str !== 'string') ||
        (!filepath || typeof filepath !== 'string') ||
        (!callback || typeof callback !== 'function')) throw new Error();

    fs.writeFile(filepath, str, callback);
};

/**
 *
 */

var parallelDone = exports.parallelDone = function parallelDone(err, results) {
    // console.log('scrape#parallelDone');
    if (err || !results || !results.length) return console.log('async.parallel: %s - %s', err, results);
    var images = flattenResults(results).sort(compareItems);
    // console.dir(images);
    console.log('Processed ' + images.length + ' images');

    var persistPromise = new Promise();

    scrapePromise.resolve({
        images: images,
        promise: persistPromise
    });

    persistPromise.then(
        function (result) {
            profiler.step('Images saved to database');
            outputFile(serializeResults(result), 'images.json', function (err) {
                if (err) throw err;
                profiler.step('Images JSON file saved');
            });
        },
        function (error) {if (error) throw new Error(error);}
    );
};

/**
 *
 */

var mapDone = exports.mapDone = function mapDone(err, results) {
    // console.log('scrape#mapDone');
    if (err || !results || !results.length) return console.log('async.map: %s - %s', err, results);
    return async.parallel(results, parallelDone);
};

