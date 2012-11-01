$('a.action').live('click',function(ev){
	ev.preventDefault()
	var payload = {}
	payload[this.id.replace(/-/g,'')] = true
	$.post('/'+this.id,payload,function(response){
		console.log(response)
	})
})





var FiatLux = function(){
	this.$h1 = $('h1')
	this.$h6 = $('h6')
	this.$setTime = $('#set-time')
	var self = this;
	this.$setTime.on('click',function(ev){
		ev.preventDefault()
		ev.stopPropagation()
		self.showPicker()
	})
}

FiatLux.prototype.initialize = function(){
	var self = this
	this.getNext(function(){
		self.picker()
		$('.add-on').hide()
		self.setupTicker()
		self.populate()
	})
}

FiatLux.prototype.bindForIPhone = function(){
	this.$picker = $('.timepicker-default')
	this.$picker.val(this.next.format('hh:mm A'))
	this.$picker.on('change',function(){
		alert($(this).val())
	});
}

FiatLux.prototype.render = function(fn){
	var self = this
	this.getNext(function(){
		self.populate()
		if(fn) fn()
	})
}

FiatLux.prototype.newValue = function(){
	var newVal = this.$picker.val()
	console.log(newVal)
	var newStamp = getNextFromInputString(newVal)
	console.log(newStamp)
	var newMoment = moment(newStamp)
	console.log(newMoment)
	return newStamp
} 

FiatLux.prototype.update = function(){
	var self = this
	$.post('/next',{next:this.newValue()},function(result){
		self.render()
	});
}

FiatLux.prototype.picker = function(){
	var self = this
	this.$picker = $('.timepicker-default')
	this.$picker.val(this.next.format('hh:mm A'))
	this.$picker.timepicker({
		template:'modal',
		defaultTime:'value',
		disableFocus:true,
		showInputs:false,
		minuteStep:5
	})
	this.$picker.on('hide',function(){
		self.render()
	})
	this.$picker.hide()
	$('.add-on').hide()
}

FiatLux.prototype.showPicker = function(){
	repositionModal();
	this.render(function(){
		$('.add-on').trigger('click')	
	})
}

FiatLux.prototype.populate = function(){
	this.$picker.val(this.next.format('hh:mm A'))
	this.$h1.text(this.next.format('hh:mm A'))
}

FiatLux.prototype.updateTicker = function(){
	this.$h6.text(this.next.fromNow())
	if(this.next.valueOf() < Date.now()) this.render()
}

FiatLux.prototype.setupTicker = function(){
	var ticker = this.updateTicker.bind(this)
	this.updateTicker()
	setInterval(ticker,1000)
}

FiatLux.prototype.getNext = function(fn){
	var self = this
	$.get('/next',function(data){
		self.nextRaw = data.next
		self.next = moment(data.next)
		fn()
	});	
}

var repositionModal = function(){
	var bodyWidth = $('body').width()
	if(bodyWidth < 812){
		$('.bootstrap-timepicker').css('margin-left',Math.round((bodyWidth-200)/2))
	} else {
		$('.bootstrap-timepicker').css('margin-left',-100)
	}
}

var getDayTimeStringForInput = function(timeString){
	return Number(getDayTimeStringPieces(timeString).join(''))
}

var getDayTimeStringPieces = function(timeString){
	var now = new Date()
	var timeStringArr = timeString.split(' ')
	var meridian = timeStringArr[1]
	var timeStringSubArr = timeStringArr[0].split(':')
	var hours = Number(timeStringSubArr[0])
	if(meridian == 'PM'){
		if(hours < 12) hours = hours + 12
	} else {
		if(hours == 12) hours = 0
	}
	var minutes = timeStringSubArr[1]
	return [hours,minutes]
}

var setDayFromInput = function(day,timeString) {
	var pieces = getDayTimeStringPieces(timeString)
	day.setHours(pieces[0])
	day.setMinutes(pieces[1])
	return day
}

var getDayTimeStringForNow = function(){
	var now = new Date()
	return Number(now.getHours()+''+now.getMinutes())
}

var isTimeForTomorrow = function(timeString){
	return getDayTimeStringForNow() > getDayTimeStringForInput(timeString)
}

var nullDay = function(day){
	day.setHours(0)
	day.setMinutes(0)
	day.setSeconds(0)
	return day;
}

var today = function(){
	return nullDay(new Date())
}

var tomorrow = function(){
	var t = today().valueOf() + 1000 * 60 * 60 * 24
	var d = new Date(t)
	return nullDay(d)
}

var getNextFromInputString = function(str){
	var day = isTimeForTomorrow(str) ? tomorrow() : today()
	setDayFromInput(day,str)
	return day.valueOf()

}

var app = new FiatLux()
app.initialize()