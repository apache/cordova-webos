/*
 * This class provides access to device compass data.
 * @constructor
 */
function Compass() {
  /*
	 * The last known heading.
	 */
	this.lastHeading = null;
};

/*
 * Asynchronously aquires the current compass heading.
 * @param {Function} successCallback The function to call when the compass
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the compass data.
 * @param {CompassOptions} options The options for getting the compass data
 * such as timeout.
 */

Compass.prototype.getCurrentHeading = function(successCallback, errorCallback, options) {

    var referenceTime = 0;
    if (this.lastHeading)
        referenceTime = this.lastHeading.timestamp;
    else
        this.start();
 
    var timeout = 20000;
    var interval = 500;
    if (typeof(options) == 'object' && options.interval)
        interval = options.interval;
 
    if (typeof(successCallback) != 'function')
        successCallback = function() {};
    if (typeof(errorCallback) != 'function')
        errorCallback = function() {};
 
    var dis = this;
    var delay = 0;
    var timer = setInterval(function() {
        delay += interval;
 
		//if we have a new compass heading, call success and cancel the timer
        if (typeof(dis.lastHeading) == 'object' && dis.lastHeading != null && dis.lastHeading.timestamp > referenceTime) {
            successCallback(dis.lastHeading.magHeading);
            clearInterval(timer);
        } else if (delay >= timeout) { //else if timeout has occured then call error and cancel the timer
            errorCallback();
            clearInterval(timer);
        }
		//else the interval gets called again
    }, interval);
};


/*
 * Asynchronously aquires the compass heading repeatedly at a given interval.
 * @param {Function} successCallback The function to call each time the acceleration
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the compass data.
 * @param {CompassOptions} options The options for getting the compass data
 * such as timeout.
 */

Compass.prototype.watchHeading = function(successCallback, errorCallback, options) {
	this.getCurrentHeading(successCallback, errorCallback, options);
	// TODO: add the interval id to a list so we can clear all watches
 	var frequency = (options != undefined)? options.frequency : 10000;
	var that = this;
	return setInterval(function() {
		that.getCurrentHeading(successCallback, errorCallback, options);
	}, frequency);
};

/*
 * Clears the specified heading watch.
 * @param {String} watchId The ID of the watch returned from #watchHeading.
 */
Compass.prototype.clearWatch = function(watchId) {
	clearInterval(watchId);
};

/*
 * Starts the native compass listener.
 */

Compass.prototype.start = function() {
	var that = this;
	//Mojo.Event.listen(document, "acceleration", function(event) {
	document.addEventListener("compass", function(event) {
		var heading={};
    heading.trueHeading=event.trueHeading;
    heading.magHeading=event.magHeading;
    heading.timestamp = new Date().getTime();
		that.lastHeading = heading;
	});
};

if (typeof navigator.compass == "undefined") navigator.compass = new Compass();
