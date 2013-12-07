var crypto = require('crypto');

/**
 *
 */

exports.hash = function hash(str) {
    return crypto.createHash('sha1').update(str).digest('hex');
};
