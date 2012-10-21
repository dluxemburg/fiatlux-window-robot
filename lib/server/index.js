var express = require('express'),
	useragent = require('express-useragent')

var app = express()

app.use(express.static(__dirname + '/static'))

app.use(express.bodyParser());

app.use(useragent.express())

app.set('views', __dirname + '/views')

module.exports = function(){
	return app;
}