var express = require('express')

var app = express()

app.use(express.static(__dirname + '/static'))

app.use(express.bodyParser());

app.set('views', __dirname + '/views')

app.get('/',function(req,res){
	res.render('index.ejs')
})

module.exports = function(){
	return app;
}