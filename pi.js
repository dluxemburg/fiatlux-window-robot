var fiatlux = require('./lib/fiatlux')

global.controllerOpts = {
	tryFirst:'ttyACM0'
}

fiatlux.clock.start(function(){
	fiatlux.listen(80)	
})

