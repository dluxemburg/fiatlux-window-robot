global.controllerOpts = {
	tryFirst:'ttyACM0'
}

var fiatlux = require('./lib/fiatlux')

fiatlux.clock.start(function(){
	fiatlux.listen(80)	
})

