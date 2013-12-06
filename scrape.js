var scraper = require('./lib/scraper'),
    sites = require('./config.js').sites;

scraper.start(sites);
