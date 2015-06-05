var virtualbox = require('./virtualbox.js');
var exec = require('child_process').exec;

var timeout = {id:undefined};

module.exports = {
	is_running: function(callback) {
		module.exports.active_emulator(function(vm) {
			callback(vm!==undefined);
		});
	},
	active_emulator: function(callback) {
		virtualbox.list(function(allVMs) {
			var runningVMs = [];
			// look for active webOS VMs
			for(var x in allVMs) {
				if(allVMs[x].running && allVMs[x].name) {
					var name = allVMs[x].name.toLowerCase();
					allVMs[x].id = x;
					if(name.indexOf("webos")>-1) {
						callback(allVMs[x]);
						return;
					} else {
						runningVMs.push(allVMs[x]);
					}
				}
			}
			// check for legacy emulator VMs
			var checkVM = function(status) {
				if(status || runningVMs.length===0) {
					callback(status);
				} else {
					var curr = runningVMs.pop();
					virtualbox.info(curr.id, function(info) {
						if(info["Forwarding(0)"] && info["Forwarding(0)"].indexOf("palm")>-1) {
							checkVM(curr);
						} else {
							checkVM();
						}
					});
				}
			};
			checkVM();
		});
	},
	wait_for_emulator: function(callback) {
		var count = 0;
		var TIMECAP = 20000;

		var nextTimeout = function(funct) {
			if(count>=TIMECAP) {
				callback(new Error("Emulator connection timeout"));
			} else {
				count+= 2000;
				setTimeout(funct, 2000);
			}
		};
		var wait = function() {
			module.exports.active_emulator(function(vm) {
				if(vm) {
					callback();
				} else {
					nextTimeout(wait);
				}
			});
		}
		setTimeout(wait, 5000);
	},
	webos_images: function(callback) {
		virtualbox.list(function(availableVMs) {
			var webOS_VMs = {};
			for(var x in availableVMs) {
				if(availableVMs[x] && availableVMs[x].name) {
					var name = availableVMs[x].name.toLowerCase();
					if(name.indexOf("webos")>-1) {
						webOS_VMs[x] = availableVMs[x];
					}
				}
			}
			callback(webOS_VMs);
		});
	},
	legacy_emulator: function(callback) {
		exec("palm-emulator", function (err, stdout, stderr) {
			callback(err);
		});
	},
	start_emulator: function(callback) {
		module.exports.webos_images(function(webOS_VMs) {
			var vm;
			for(var x in webOS_VMs) {
				vm = x;
				if(webOS_VMs[x].name==="LG webOS TV Emulator") {
					// ideal default VM name for SmartTV SDK-installed VM
					break;
				}
			}
			var emu_started = function(err) {
				if(err) {
					console.error("Unable to start emulator");
				};
				callback(err);
			}
			if(vm) {
				virtualbox.start(vm, true, emu_started);
			} else {
				module.exports.legacy_emulator(emu_started);
			}
		});
		
	},
	stop_emulator: function(callback) {
		module.exports.active_emulator(function(active) {
			if(active) {
				virtualbox.poweroff(active.id, function(err) {
					if(err) {
						console.error("Unable to poweroff emulator");
					};
					callback(err);
				});
			} else {
				callback();
			}
		})
	}
};
