'use strict';
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var nunjucks = require('nunjucks');
var db = require('./models').db;
var authorRouter = require('./routes/authors');
var bookRouter = require('./routes/books');

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
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
var env = nunjucks.configure('views', {noCache: true});
require('./filters')(env);
var AutoEscapeExtension = require("nunjucks-autoescape")(nunjucks);
env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));


//Routing

app.use('/authors', authorRouter);
app.use('/books', bookRouter);

//rendering templates:
app.get('/', function(req, res) {
    res.render('index');
});

//Error handling specifically for a page that isn't found
app.use(function(req, res, next) {
    var err = new Error('Page not found.');
    err.status = 404;
    next(err);
});
//Error handling for all other errors: final landing point for all errors
app.use(function(err, req, res, next) {
    console.log("THERE'S BEEN AN ERROR");
    console.error(err.stack);
    res.status( err.status || 500);
    res.render('errors', {
        message: err.message,
        error: err
    })
})
//sync with db and listen on server
db.sync({force: false})
.then(function() {
    console.log('db is synched')
    app.listen(3000, function() {
        console.log('App listening on port 3000');
    })
})
