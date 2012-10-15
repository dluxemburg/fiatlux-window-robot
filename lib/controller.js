var arduino = require('duino')

exports.blink = function(){
	var board = new arduino.Board({
	  debug: true
	})

	var led = new arduino.Led({
	  board: board,
	  pin: 13
	})
	led.blink()
}

var Controller = function(){
	var self = this
	var board = this.board = new arduino.Board({
		debug:true
	})
}

Controller.prototype.servosOn = function(){
	this.board.write("!7100000.")
}

Controller.prototype.servosOff = function(){
	this.board.write("!8100000.")
}

Controller.prototype.servosStop = function(){
	this.board.write("!6100000.")
}



Controller.prototype.blink = function(){
	this.led.blink()
}

Controller.prototype.setPosition = function(degrees){
	this.servo1.write(degrees)
}

Controller.prototype.getPosition = function(fn){
	this.servo1.once('read',fn)
	this.servo1.read()
}


Controller.prototype.sweepTest = function(){
  this.servo1.on('read', function(err, pos) {
    console.log(pos);
  });

  this.servo1.on('detached', function(err) {
    console.log('detached');
  });

  this.servo1.on('aftersweep', function(err) {
    this.read();
    this.detach();
  });

  this.servo1.sweep();
}

exports.createController = function(){
	return new Controller();
}