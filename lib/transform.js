/**
 *
 */

exports.transform = function transform(domain, href) {
    var origUrl = domain + '/' + href;
    domain = domain.split('//')[1];
    var permalink = origUrl.split('//')[1].replace(/\//g, '_');
    var url = 'http://cdn.imgg.es/' + permalink;
    return {
        url: url,
        data: {
            domain: domain,
            name: href,
            origUrl: origUrl
        }
    };
};
