var arduino = require('duino')

var events = require('events'),
    child  = require('child_process'),
    util   = require('util'),
    colors = require('colors'),
    serial = require('serialport')

var tryFirst;
tryFirst = 'ttyACM0';


arduino.Board.prototype.detect = function (callback) {
  this.log('info', 'attempting to find Arduino board');
  var self = this;
  child.exec('ls /dev | grep usb', function(err, stdout, stderr){
    var usb = stdout.slice(0, -1).split('\n'),
        found = false,
        err = null,
        possible, temp;

    if(tryFirst) usb.push(tryFirst);

    while ( usb.length ) {
      possible = usb.pop();

      if (possible.slice(0, 2) !== 'cu') {
        try {
          self.log('info','trying /dev/' + possible)
          temp = new serial.SerialPort('/dev/' + possible, {
            baudrate: 115200,
            parser: serial.parsers.readline('\n')
          });
        } catch (e) {
          err = e;
        }
        if (!err) {
          found = temp;
          self.log('info', 'found board on device: ' + '/dev/' + possible);
          self.log('info', 'found board at port: ' + temp.port);
          break;
        } else {
          err = new Error('Could not find Arduino');
        }
      }
    }

    callback(err, found);
  });
}

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
	
	this.stopBlink()

	var led = this.led = new arduino.Led({
	  board: this.board,
	  pin: 13
	})

	this.blinker =  setInterval(function(){
	    if (led.bright) {
	      led.off()
	    } else {
	      led.on();
	    }
	}, 1000);

}

Controller.prototype.stopBlink = function(){
	if(this.blinker){
		clearInterval(this.blinker)
		this.blinker = null
	}
	this.led = null
}

Controller.prototype.setPosition = function(degrees){
	this.servo1.write(degrees)
}

Controller.prototype.getPosition = function(fn){
	this.servo1.once('read',fn)
	this.servo1.read()
}

exports.createController = function(){
	return new Controller();
}