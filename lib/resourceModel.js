/**
 * @list dependencies
 */

var ID = require('short-id'),
    mongoose = require('mongoose'),
    Promise = require('node-promise').Promise,
    Resource = require('../models/Resource').Resource;

/**
 * @configure short-id
 */

ID.configure({
    length: 6,
    algorithm: 'sha1',
    salt: Math.random
});

/**
 * @method connect
 * @param {String} mongdb Mongo DB String to connect to
 */

exports.connect = function(mongodb) {
    mongoose.connect(mongodb);
    exports.connection = mongoose.connection;
};

/**
 * @method generate
 * @param {Object} options Must at least include a `url` attribute
 */

exports.generate = function(document) {
    var generatePromise
        , promise = new Promise()
        , generatedHash = ID.store(document.url)
        , query = { url : document.url };
    document['hash'] = generatedHash;
    document['data'] = (document.data) ? document.data : null;
    generatePromise = Resource.findOrCreate(query, document, {});
    generatePromise.then(function(ResourceObject) {
        promise.resolve(ResourceObject);
    }, function(error) {
        promise.reject(error, true);
    });
    return promise;
};

/**
 * @method retrieve
 * @param {Object} options Must at least include a `hash` attribute
 */

exports.retrieve = function(hash) {
    var promise = new Promise();
    var query = { hash : hash } 
        , update = { $inc: { hits: 1 } }
        , options = { multi: true };
    var retrievePromise = Resource.findOne(query);
    Resource.update( query, update , options , function (){ } );
    retrievePromise.then(function(ResourceObject) {
        if (ResourceObject && ResourceObject !== null) {
            promise.resolve(ResourceObject);
        } else {
            promise.reject(new Error('MongoDB - Cannot find Document'), true);
        };
    }, function(error) {
        promise.reject(error, true);
    });
    return promise;
};

/**
 * @method hits
 * @param {Object} options Must at least include a `hash` attribute
 */

exports.hits = function(hash) {
    var promise = new Promise();
    var query = { hash : hash } 
        , options = { multi: true };
    var retrievePromise = Resource.findOne(query);
    Resource.update(query, update, options, function(){ });
    retrievePromise.then(function(ResourceObject) {
        if (ResourceObject && ResourceObject !== null) {
            promise.resolve(ResourceObject.hits);
        } else {
            promise.reject(new Error('MongoDB - Cannot find Document'), true);
        };
    }, function(error) {
        promise.reject(error, true);
    });
    return promise;
};

/**
 * @method list
 * @description List all Resources
 */

exports.list = function() {
    var promise = new Promise();
    var listPromise = Resource.find({});
    listPromise.then(function(ResourceObjects) {
        promise.resolve(ResourceObjects);
    }, function(error) {
        promise.reject(error, true);
    });
    return promise;
};
