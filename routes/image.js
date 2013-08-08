/*
 * GET images listing.
 */

exports.list = function(req, res){
    res.sendfile('images.json', { maxAge: 86400 });
};
