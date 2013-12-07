var dbConnection = require('../conf/db').config,
    resourceModel = require('./resourceModel'),
    allOrNone = require('node-promise').allOrNone;

exports.persist = function persist(data) {
    console.log('persist#persist');

    var images = data.images;
    var persistPromise = data.promise;

    console.log('>> connecting to ' + dbConnection.connectionString);

    // connect to mongodb
    resourceModel.connect(dbConnection.connectionString);

    resourceModel.connection.on('error', function(error) {
        throw new Error(error);
    });

    var resourceLoadPromises = [];

    images.forEach(function (image) {
        // promise to generate a shortened URL.
        var resourcePromise = resourceModel.generate(image);

        resourceLoadPromises.push(resourcePromise);

        // gets back the short url document, and then retrieves it
        resourcePromise.then(function(mongodbDoc) {
            // console.log('>> created short URL:');
            // console.log(mongodbDoc);

            // console.log('>> retrieving short URL: %s', mongodbDoc.hash);
            // resourceModel.retrieve(mongodbDoc.hash).then(function(result) {
            //     console.log('>> retrieve result:');
            //     console.log(result);
            //     process.exit(0);
            // }, function(error) {
            //     if (error) {
            //         throw new Error(error);
            //     }
            // });
        }, function (error) {
            if (error) {
                throw new Error(error);
            }
        });
    });

    // resolves after all promises have been resolved - if one fails, they all do
    allOrNone(resourceLoadPromises).then(
        function (result) {
            resourceModel.connection.close();
            persistPromise.resolve(result);
        },
        function (error) {
            if (error) {
                throw new Error(error);
            }
        }
    );

    return persistPromise;
};
