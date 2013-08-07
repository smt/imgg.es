var async = require('async');
var cheerio = require('cheerio');
var crypto = require('crypto');
var execTime = require('exec-time')
var fs = require('fs');
var request = require('request');

var profiler = new execTime('processing sites');

profiler.beginProfiling();

async.map(['http://bukk.it', 'http://wil.to/_/', 'http://misatkes.com', 'http://meyerweb.com/bkkt/'],
    function (origin, mapCallback) {
        mapCallback(null, function (seriesCallback) {
            request(origin, function (err, res, body) {
                var $ = cheerio.load(body);
                var selector = 'a[href$=".gif"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"]';
                var links = [];
                $(selector).each(function () {
                    var name = $(this).attr('href');
                    var url = origin + '/' + name;
                    links.push({
                        id: crypto.createHash('md5').update(url).digest('hex'),
                        url: url,
                        name: name,
                        origin: origin
                    });
                });
                seriesCallback(null, links);
            });
        });
    },
    function (err, results) {
        if (err || !results || !results.length) return console.log('async.map: %s - %s', err, results);
        var images;
        async.parallel(results, function (err, results) {
            if (err || !results || !results.length) return console.log('async.series: %s - %s', err, results);
            var i, len, args = [];
            for (i = 1, len = results.length; i < len; i++) {
                args.push(results[i]);
            }
            images = Array.prototype.concat.apply(results[0], args).sort(function (a, b) {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
            console.log(images);
            console.log('Processed ' + images.length + ' images');
            images = JSON.stringify(images);
            fs.writeFile('images.json', images);
            profiler.step('done');
        });
    }
);
