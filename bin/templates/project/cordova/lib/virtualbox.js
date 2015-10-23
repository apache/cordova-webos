/*
	Copyright © 2012-2014 Azer Koculu. All Rights Reserved. 
	https://github.com/azer/node-virtualbox
	
	Additional contributions by Michael Sanford, Steffen Roegner, Jakub Lekstan, 
	Christopher Najewicz, Cédric Belin, and Jason Robitaille.

	Redistribution and use in source and binary forms, with or without modification, 
	are permitted provided that the following conditions are met:

	1. Redistributions of source code must retain the above copyright notice, 
	this list of conditions and the following disclaimer.

	2. Redistributions in binary form must reproduce the above copyright notice, 
	this list of conditions and the following disclaimer in the documentation and/or 
	other materials provided with the distribution.

	3. The name of the author may not be used to endorse or promote products derived 
	from this software without specific prior written permission.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
	EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES 
	OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT 
	SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, 
	OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE 
	GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER 
	CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
	(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, 
	EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

"use strict";

var exec = require('child_process').exec,
	host_platform = process.platform,
	vBoxManageBinary,
	known_OS_types = {
		WINDOWS: 'windows',
		MAC: 'mac',
		LINUX: 'linux'
	};


// Host operating system
if (/^win/.test(host_platform)) {

	// Path may not contain VBoxManage.exe but it provides this environment variable
	var vBoxInstallPath = process.env.VBOX_INSTALL_PATH || process.env.VBOX_MSI_INSTALL_PATH;
	vBoxManageBinary = '"' + vBoxInstallPath + '\\VBoxManage.exe' + '" ';

} else if (/^darwin/.test(host_platform) || /^linux/.test(host_platform)) {

	// Mac OS X and most Linux use the same binary name, in the path
	vBoxManageBinary = 'vboxmanage ';

} else {

	// Otherwise (e.g., SunOS) hope it's in the path
	vBoxManageBinary = 'vboxmanage ';

}

function command(cmd, callback) {
	exec(cmd, function(err, stdout, stderr) {

		if (!err && stderr && cmd.indexOf("pause") !== -1 && cmd.indexOf("savestate") !== -1) {
			err = new Error(stderr);
		}

		callback(err, stdout);
	});
}

function vboxcontrol(cmd, callback) {
	command('VBoxControl ' + cmd, callback);
}

function vboxmanage(cmd, callback) {
	command(vBoxManageBinary + cmd, callback);
}

function pause(vmname, callback) {
	vboxmanage('controlvm "' + vmname + '" pause', function(error, stdout) {
		callback(error);
	});
}

function list(callback) {
	vboxmanage('list "runningvms"', function(error, stdout) {
		var _list = {};
		var _runningvms = parse_listdata(stdout);
		vboxmanage('list "vms"', function(error, full_stdout) {
			var _all = parse_listdata(full_stdout);
			var _keys = Object.keys(_all);
			for (var _i = 0; _i < _keys.length; _i += 1) {
				var _key = _keys[_i];
				if (_runningvms[_key]) {
					_all[_key].running = true;
				} else {
					_all[_key].running = false;
				}
			}
			callback(_all, error);
		});
	});
}

function parse_listdata(raw_data) {
	var _raw = raw_data.split(/\r?\n/g);
	var _data = {};
	if (_raw.length > 0) {
		for (var _i = 0; _i < _raw.length; _i += 1) {
			var _line = _raw[_i];
			if (_line === '') {
				continue;
			}
			// "centos6" {64ec13bb-5889-4352-aee9-0f1c2a17923d}
			var rePattern = /^"(.+)" \{(.+)\}$/;
			var arrMatches = _line.match(rePattern);
			// {'64ec13bb-5889-4352-aee9-0f1c2a17923d': 'centos6'}
			if (arrMatches && arrMatches.length === 3) {
				_data[arrMatches[2].toString()] = {
					name: arrMatches[1].toString()
				};
			}
		}
	}
	return _data;
}

function info(vmname, callback) {
	vboxmanage('showvminfo "' + vmname + '" --machinereadable', function(error, stdout) {
		var info = {};
		var data = stdout.split(/\r?\n/g);
		for(var i=0; i<data.length; i++) {
			if(data[i].length>0) {
				var index = data[i].indexOf("=");
				if(index>0) {
					var key = parse_infoentry(data[i].substring(0, index));
					var value = parse_infoentry(data[i].substring(index+1));
					info[key] = value;
				}
			}
		}
		callback(info);
	});
}

function parse_infoentry(entry) {
	if(entry.length>1 && entry.charAt(0)=="\"") {
		entry = entry.substring(1);
	}
	if(entry.length>1 && entry.charAt(entry.length-1)=="\"") {
		entry = entry.substring(0, entry.length-1);
	}
	return entry;
}

function reset(vmname, callback) {
	vboxmanage('controlvm "' + vmname + '" reset', function(error, stdout) {
		callback(error);
	});
}

function resume(vmname, callback) {
	vboxmanage('controlvm "' + vmname + '" resume', function(error, stdout) {
		callback(error);
	});
}

function start(vmname, use_gui, callback) {
	var start_opts = ' --type ';
	if ((typeof use_gui) === 'function') {
		callback = use_gui;
		use_gui = false;
	}
	start_opts += (use_gui ? 'gui' : 'headless');

	vboxmanage('-nologo startvm "' + vmname + '"' + start_opts, function(error, stdout) {
		if (error && /VBOX_E_INVALID_OBJECT_STATE/.test(error.message)) {
			error = undefined;
		}
		callback(error);
	});
}

function stop(vmname, callback) {
	vboxmanage('controlvm "' + vmname + '" savestate', function(error, stdout) {
		callback(error);
	});
}

function savestate(vmname, callback) {
	stop(vmname, callback);
}

function poweroff(vmname, callback) {
	vboxmanage('controlvm "' + vmname + '" poweroff', function(error, stdout) {
		callback(error);
	});
}

function acpipowerbutton(vmname, callback) {
	vboxmanage('controlvm "' + vmname + '" acpipowerbutton', function(error, stdout) {
		callback(error);
	});
}

function acpisleepbutton(vmname, callback) {
	vboxmanage('controlvm "' + vmname + '" acpisleepbutton', function(error, stdout) {
		callback(error);
	});
}

function vmExec(options, callback) {
	var vm = options.vm || options.name || options.vmname || options.title,
		username = options.user || options.username || 'Guest',
		password = options.pass || options.passwd || options.password,
		path = options.path || options.cmd || options.command || options.exec || options.execute || options.run,
		cmd,
		params = options.params || options.parameters || options.args;

	if (Array.isArray(params)) {
		params = params.join(" ");
	}

	if (params === undefined) {
		params = "";
	}

	guestproperty.os(vm, getOSTypeCb);

	function getOSTypeCb(os_type) {
		var cmd = 'guestcontrol "' + vm + '"';

		switch (os_type) {
			case known_OS_types.WINDOWS:
				path = path.replace(/\\/g, '\\\\');
				cmd += ' execute	--image "cmd.exe" --username ' + username + (password ? ' --password ' + password : '') + ' -- "/c" "' + path + '" "' + params + '"';
				break;
			case known_OS_types.MAC:
				cmd += ' execute	--image "/usr/bin/open -a" --username ' + username + (password ? ' --password ' + password : '') + ' -- "/c" "' + path + '" "' + params + '"';
				break;
			case known_OS_types.LINUX:
				cmd += ' execute	--image "/bin/sh" --username ' + username + (password ? ' --password ' + password : '') + ' -- "/c" "' + path + '" "' + params + '"';
				break;
			default:
				break;
		}

		vboxmanage(cmd, function(error, stdout) {
			callback(error);
		});
	}

}

function vmKill(options, callback) {
	options = options || {};
	var vm = options.vm || options.name || options.vmname || options.title,
		path = options.path || options.cmd || options.command || options.exec || options.execute || options.run,
		image_name = options.image_name || path,
		cmd = 'guestcontrol "' + vm + '" process kill';

	guestproperty.os(vm, function(os_type) {
		switch (os_type) {
			case known_OS_types.WINDOWS:
				vmExec({
					vm: vm,
					user: options.user,
					password: options.password,
					path: 'C:\\Windows\\System32\\taskkill.exe /im ',
					params: image_name
				}, callback);
				break;
			case known_OS_types.MAC:
			case known_OS_types.LINUX:
				vmExec({
					vm: vm,
					user: options.user,
					password: options.password,
					path: 'sudo killall ',
					params: image_name
				}, callback);
				break;
		}
	});

}

var guestproperty = {
	get: function(options, callback) {
		var vm = options.vm || options.name || options.vmname || options.title,
			key = options.key,
			value = options.defaultValue || options.value;

		guestproperty.os(vm, getOSTypeCallback);

		function getOSTypeCallback(os_type) {
			var cmd = 'guestproperty get "' + vm + '" ' + key;
			vboxmanage(cmd, function(error, stdout) {
				if (error) {
					throw error;
				}
				var value = stdout.substr(stdout.indexOf(':') + 1).trim();
				if (value === 'No value set!') {
					value = undefined;
				}
				callback(value);
			});
		}

	},

	os_type: null, // cached

	os: function(vmname, callback) {
		function getOSTypeCallback(error, stdout, stderr) {
			if (error) {
				throw error;
			}

			// The ostype is matched against the ID attribute of 'vboxmanage list ostypes'
			if (stdout.indexOf('ostype="Windows') !== -1) {
				guestproperty.os_type = known_OS_types.WINDOWS;
			} else if (stdout.indexOf('ostype="MacOS') !== -1) {
				guestproperty.os_type = known_OS_types.MAC;
			} else {
				guestproperty.os_type = known_OS_types.LINUX;
			}
			callback(guestproperty.os_type);
		}

		if (guestproperty.os_type) {
			return callback(guestproperty.os_type);
		}

		try {
			exec(vBoxManageBinary + 'showvminfo -machinereadable "' + vmname + '"', getOSTypeCallback);
		} catch (e) {
			console.error('Could not showvminfo for ' + vmname);
		}
	}

};

module.exports = {
	'exec': vmExec,
	'kill': vmKill,
	'list': list,
	'info': info,
	'pause': pause,
	'reset': reset,
	'resume': resume,
	'start': start,
	'stop': stop,
	'savestate': savestate,
	'poweroff': poweroff,
	'acpisleepbutton': acpisleepbutton,
	'acpipowerbutton': acpipowerbutton,
	'guestproperty': guestproperty
};