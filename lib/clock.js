var fs = require('fs'),
	events = require('events'),
	util = require('util'),
	path = require('path')

var Clock = exports.Clock = function(opts){
	events.EventEmitter.call(this)
	opts || (opts = {})
	opts.path || (opts.path = 'tmp/next')
	this.path = path.join(__dirname,'../'+opts.path)
	// console.log('Using '+this.path+' for clock store')
};

util.inherits(Clock,events.EventEmitter)

Clock.prototype.check = function(fn){
	var self = this;
	fs.readFile(this.path,function(err,data){
		if(err) return fn(err)
		self.next = Number(data)
		fn(null,self.next)
	})
}

Clock.prototype._check = function(fn){
	var self = this;
	fs.readFile(this.path,function(err,data){
		console.log('checking clock setting: '+data)
		if(err) return fn(err)
		if(data == '' || data == null){
			console.log('setting next to null')
			self.next = null
		} else {
			self.next = Number(data)
		}
		fn(null,self.next)
	})
}


Clock.prototype.set = function(fn){
	var self = this
	fs.writeFile(this.path,String(this.next),function(err){
		if(err) return fn(err)
		fn(null,self.next)
	})
}

Clock.prototype.setDefault = function(fn){
	this.next = Date.now() + 24 * 60 * 60 * 1000
	this.set(fn)
}

Clock.prototype.setDefaultIfNecessary = function(fn){
	var self = this
	this._check(function(err,next){
		if(err) return fn(err)
		if(!next) return self.setDefault(fn)
		fn(null,next)
	})
}

Clock.prototype.tick = function(){
	if(Date.now() > this.next) this.alarm()
}

Clock.prototype.alarm = function(){
	this.emit('alarm')
	console.log('ALARM GOES OFF')
	this.next = this.next + 24 * 60 * 60 * 1000
	this.set(function(){})
}

Clock.prototype.start = function(start,fn){
	if(typeof(start) == 'function'){
		fn = start
	} else {
		this.next = start
	}
	var tock = this.tick.bind(this)
	var self = this
	this.setDefaultIfNecessary(function(){
		setInterval(tock,1000)
	})
	fn()
}

exports.createClock = function(){
	return new Clock()
}