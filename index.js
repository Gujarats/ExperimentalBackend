var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var mongoose    = require('mongoose');
var config = require('./config/databaseConfig.js');



var connect_database = mongoose.connect(config.database);;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
  console.log("database is Opened");
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all('/*', function(req, res, next) {
// CORS headers
	res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	// Set custom headers for CORS
	res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');

	if (req.method == 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed

app.all('/api/v1/*', [require('./middlewares/validateRequest2')]);
app.use('/', require('./routes'));

// If no route is matched by now, it must be a 404
app.use(function (req, res, next) {
	var err = new Error('Not Found brow gk ada hahah');
	err.status = 404;
	res.send(err);
	next(err);
});

// Start the server
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + server.address().port);
});
