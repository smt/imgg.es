var resourceModel = require('./../lib/resourceModel');

/*
 * GET url to forward via shorturl hash
 */

var find = exports.find = function find(hash, callback, errorHandler) {
    resourceModel.retrieve(hash).then(callback, errorHandler);
};

exports.redirect = function redirect(req, res){
    var hash = req.path[0] === '/' ? req.path.slice(1, req.path.length) : req.path;

    find(hash, function (result) {
        if (result && result.url) return res.redirect(302, result.url);
        res.send(404, '<h1>Sorry, we cannot find that!</h1>');
    }, function (error) {
        if (error) {
            res.redirect('/');
            // res.send(500, '<h1>' + error + '</h1>');
            console.log(error);
        }
    });
};
