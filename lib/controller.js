var arduino = require('duino')

var events = require('events'),
    child  = require('child_process'),
    util   = require('util'),
    colors = require('colors'),
    serial = require('serialport')

var detect = arduino.Board.prototype.detect = function (tryFirst,callback) {
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

var Controller = function(opts){
	opts || (opts = {});
	this.tryFirst = opts.tryFirst
	this.getSerialConnection()
}

Controller.prototype.getSerialConnection = function(){
	var self = this
	detect.call(this,this.tryFirst,function(err,serial){
		if(err){
			console.error('Failed to connect to board')
			console.error(err.message)
			return
		}
		self.serial = serial
		self.serial.on('data', function(data){
        	console.log('received: '+data)
        	// self.emit('data', data)
      	})
	})
}

Controller.prototype.log = console.log

Controller.prototype.relaysOn = function(){
	this.serial.write('1')
}

Controller.prototype.relaysOff = function(){
	this.serial.write('5')
}

exports.createController = function(opts){
	return new Controller(opts);
}