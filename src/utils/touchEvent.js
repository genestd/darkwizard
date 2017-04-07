//for touch and hold, see https://jsfiddle.net/le17i/Pvcpg/10/
var touchEvent = (function() {
	var eventName = null
	, isTouched = false
  , timer = 0

	var getPointTime = function() {
	  var date = new Date();
	 	return date.getTime();
	};

	return {

		startEv: function(event, dir) {
			this.isTouched = true;
      this.timer = window.setInterval( function(){
        this.props.actions.movePlayer(dir)
      }, 250)
  		},

		endEv: function(event) {
			this.isTouched = false;
      window.clearInterval(this.timer)
		},

		getEventName: function() {
			return this.eventName;
		},


	};

})();
export default touchEvent
