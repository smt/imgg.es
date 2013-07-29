var express = require('express');
var app = express();

app.set('title', 'bukwiltk.es');

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.listen(3000);
