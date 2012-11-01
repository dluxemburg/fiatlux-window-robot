/*
 * fiatlux
 *
 * Copyright (c) 2012 Daniel Luxemburg
 * Licensed under the MIT license.
 */



var app = require('./server')()

var controllerOpts = {}
if(global.controllerOpts) controllerOpts = global.controllerOpts
var controller = app.controller = require('./controller.js').createController(controllerOpts);

var clock = app.clock = require('./clock.js').createClock()

clock.on('alarm',function(){
	controller.relaysOff();
});

app.get('/',function(req,res){
	res.locals.useragent = null
	res.render('index.ejs',{useragent:null})
})

app.get('/agent',function(req,res){
	res.send(req.useragent)
})


app.post('/set-to-off',function(req,res){
	console.log('set-to-off')
	controller.relaysOff()
	res.json({ok:true})
})

app.post('/set-to-on',function(req,res){
	console.log('set-to-on')
	controller.relaysOn()
	res.json({ok:true})
})

app.get('/next',function(req,res){
	clock.check(function(err,next){
		res.json({next:next})
	})
})

app.post('/next',function(req,res){
	console.log('setting next: '+req.body.next)
	clock.next = req.body.next
	clock.set(function(){
		clock.check(function(err,next){
			res.json({next:next})
		})
	})
})


module.exports = app