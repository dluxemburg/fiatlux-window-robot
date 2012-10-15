/*
 * fiatlux
 *
 * Copyright (c) 2012 Daniel Luxemburg
 * Licensed under the MIT license.
 */

var app = require('./server')()

var controller = app.controller = require('./controller.js').createController()

var clock = app.clock = require('./clock.js').createClock()

app.get('/',function(req,res){
	controller.stopBlink()
	res.render('index.ejs')
})


app.post('/set-to-off',function(req,res){
	controller.servosOn()
	res.json({ok:true})
})

app.post('/set-to-on',function(req,res){
	controller.servosOff()
	res.json({ok:true})
})

app.post('/do-sweep',function(req,res){
	controller.servosOff()
	setTimeout(function(){
		controller.servosOn()	
		res.json({ok:true})
	},2000)
})

app.get('/next',function(req,res){
	clock.check(function(err,next){
		res.json({next:next})
	})
})

app.get('/blink',function(req,res){
	controller.blink()
	res.send('blinking...')
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