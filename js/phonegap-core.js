if (typeof(DeviceInfo) != 'object')
    DeviceInfo = {};

function PhoneGap() {
	ready = true;
	available = true;
	sceneController = null;	
}; 

PhoneGap.exec = function(win, fail, clazz, action, args) {

 setTimeout(function() { 
	 PhoneGap.plugins[clazz].execute(action, args, win, fail); 
   }, 0);

}

// translates the action into an API call
notifications = {
 execute: function(action, args, win, fail) {
		var actionFound = false;
		switch(action) {
			case 'alert':
				navigator.notification.alert(args);
				actionFound = true; 
				break;
			case 'showBanner':
				navigator.notification.showBanner(args);
				actionFound = true;
				break;
			case 'newDashboard':
			    navigator.notification.newDashboard();
			    break;
			case 'removeBannerMessage':
			    navigator.notification.removeBannerMessage();
			    break;
			case 'clearBannerMessage':
			    navigator.notification.clearBannerMessage();
			    break;
			case 'vibrate':            
			    navigator.notification.vibrate();
			    break;
			case 'beep':               
			    navigator.notification.beep();
			    break;   		
		}

		if (actionFound)
			win(args);
		else
			fail('action not found');
   }
}

// this mapping acts as a shim to the webOS APIs
PhoneGap.plugins = {};
PhoneGap.plugins['navigator.notification'] = notifications;

document.addEventListener('DOMContentLoaded', function () {
    window.phonegap = new PhoneGap();
    navigator.device.deviceReady();
});
