/*
 * fiatlux
 *
 * Copyright (c) 2012 Daniel Luxemburg
 * Licensed under the MIT license.
 */

var app = require('./server')()

var controller = app.controller = require('./controller.js').createController()


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

module.exports = app