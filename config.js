/**
 * Use the following object signature for a site configuration:
 *
 *    {
 *      "url":      "http://example.com",
 *      "selector": "a[href$='.gif']"
 *    }
 */

exports.sites = [
    { "url": "http://bukk.it",           "selector": "a[href$='.gif'], a[href$='.jpg'], a[href$='.jpeg'], a[href$='.png']" },
    { "url": "http://wil.to/_",          "selector": "a[href$='.gif'], a[href$='.jpg'], a[href$='.jpeg'], a[href$='.png']" },
    { "url": "http://misatkes.com",      "selector": "a[href$='.gif'], a[href$='.jpg'], a[href$='.jpeg'], a[href$='.png']" },
    { "url": "http://meyerweb.com/bkkt", "selector": "a[href$='.gif'], a[href$='.jpg'], a[href$='.jpeg'], a[href$='.png']" }
];
