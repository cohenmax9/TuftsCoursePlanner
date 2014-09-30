var express = require("express");
var logfmt = require("logfmt");
var path = require("path");
var http = require("http");

// main app
var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/views'));


app.use(logfmt.requestLogger());
app.use(express.static(path.join(__dirname, '/')));

app.get('/', function (req, res) {
	res.sendfile(__dirname, '/', path.basename("index.html"));
	res.render('index.html');
	res.send("Hello there Fionish!");
});

app.get('/schedule', function (req, res) {
	res.render('schedule.html');
});

app.get('/courses.json', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

res.send("Hello there Fionish!");
});

app.get('/about', function (req, res) {
	res.render('about.html');
});


main.listen(3000);

//my IP Address:  192.168.1.2
