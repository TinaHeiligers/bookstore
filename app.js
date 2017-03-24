'use strict';
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var nunjucks = require('nunjucks');
//INSTANCE OF APP
var app = express();

//MIDDLEWARE
//logging requests, responses, status, errors
app.use(morgan('dev'));

//parsing json and url
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//serving static files:
app.use(express.static(path.join(__dirname, '/public')));

//templating for front end:
nunjucks.configure('views', {noCache: true});
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status( err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    })
})
//sync with db and listen on server
app.listen(3000, function() {
    console.log('App listening on port 3000');
})
