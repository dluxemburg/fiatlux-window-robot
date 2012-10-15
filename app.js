var fiatlux = require('./lib/fiatlux')

fiatlux.clock.start(function(){
	fiatlux.listen(8080)	
})

