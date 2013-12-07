var persist = require('./lib/persist').persist,
    scrape = require('./lib/scrape'),
    sitesConfig = require('./conf/sites').sites;

scrape.start(sitesConfig).then(persist, function (error) {
    if (error) throw new Error(error);
});
