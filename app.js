var express = require("express");
var path = require("path");
var http = require("http");
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash 	 = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var port = process.env.PORT || 3000;

mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(express.static(path.join(__dirname, '/')));

app.set('view engine', 'ejs'); // set up ejs for templating

// all environments
app.set('port', port);
app.set('views', path.join(__dirname, '/views'));

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function(req, res, next){
      req.cart = {};
      next();
});

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.listen(port);
console.log('Listening on port ' + port);
