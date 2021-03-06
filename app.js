/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    image = require('./routes/image'),
    images = require('./images.json'),
    mongodb = require('./conf/db').dbURI,
    resourceModel = require('./lib/resourceModel'),
    shorturl = require('./routes/shorturl'),
    http = require('http'),
    path = require('path'),
    app = express();

// all environments
app.set('title', 'imgg.es');
app.set('images', images);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

// connect to db
resourceModel.connect(mongodb);

// define routes
app.get(/^\/[0-9a-f]{6}/, shorturl.redirect);
app.get('/images.json', image.list);
app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
