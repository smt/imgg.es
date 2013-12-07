/**
 * @model Resource
 */

var options,
    ResourceSchema,
    mongoose = require('mongoose'),
    wrapper = require('./Model.js'),
    Schema = mongoose.Schema;
    ObjectId = Schema.ObjectId;

options = { 
    versionKey : false
};

ResourceSchema = new Schema({
    id         : { type : ObjectId },
    url        : { type : String, unique: true },
    hash       : { type : String, unique: true },
    hits       : { type : Number, default: 0 },
    data       : { type : Schema.Types.Mixed },
    created_at : { type : Date, default: Date.now },
}, options);

exports.Resource = new wrapper.Model(mongoose.model('Resource', ResourceSchema));
