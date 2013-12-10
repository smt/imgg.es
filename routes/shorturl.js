var dbConnection = require('../conf/db').config,
    resourceModel = require('../lib/resourceModel');

/*
 * GET url to forward via shorturl hash
 */

exports.find = function(req, res){
    var hash = req.path[0] === '/' ? req.path.slice(1, req.path.length) : req.path;

    console.log('>> connecting to ' + dbConnection.connectionString);

    // connect to mongodb
    resourceModel.connect(dbConnection.connectionString);

    resourceModel.connection.on('error', function(error) {
        throw new Error(error);
    });

    resourceModel.retrieve(hash).then(function (result) {
        resourceModel.connection.close();
        if (result && result.url) return res.redirect(302, result.url);
        res.send(404, '<h1>Sorry, we cannot find that!</h1>');
    }, function (error) {
        resourceModel.connection.close();
        if (error) {
            res.send(404, '<h1>Sorry, we cannot find that!</h1>');
            // res.send(500, 'Something messed up...');
            console.log(error);
        }
    });
};
