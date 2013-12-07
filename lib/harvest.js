var cheerio = require('cheerio');

/**
 *
 */

exports.harvest = function harvest(body, selector) {
    var $ = cheerio.load(body);
    return $(selector);
};

