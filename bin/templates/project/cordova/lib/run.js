#!/usr/bin/env node

/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
*/

var path  = require("path"),
    fs = require("fs"),
    build = require("./build"),
    spawn = require("./ares-spawn"),
    emu = require("./emulator"),
    Q = require("q"),
    ROOT = path.join(__dirname, "..", "..");



/*
 * Runs the application
 * Returns a promise.
 */
module.exports.run = function(args) {
  var build_type;
  var install_target;

  for (var i=2; i<args.length; i++) {
      if (args[i] == "--debug" || args[i] == "--no-minify" || args[i] == "--enyo-debug") {
          build_type = "--debug";
      } else if (args[i] == "--emulator") {
          install_target = "emulator";
      } else if (args[i].substring(0, 9) == "--target=") {
          install_target = args[i].substring(9, args[i].length);
      }
  }

  var launchEmulatorIfNeeded = function() {
    var d = Q.defer();
    if(install_target==="emulator") {
      emu.start_emulator(function(err1) {
        if(err1) {
          d.reject(err1);
        } else {
          emu.wait_for_emulator(function(err2) {
            if(err2) {
              d.reject(err2);
            } else {
              d.resolve();
            }
          });
        }
      });
    } else {
      d.resolve();
    }
    return d.promise;
  }

  return build.run(build_type).then(launchEmulatorIfNeeded).then(function() {
      var installArgs = [];
      if(install_target) {
          installArgs.push("-d", install_target);
      }
      installArgs.push(build.get_ipk());
      return spawn("ares-install", installArgs).then(function() {
          var appinfoPath = path.join(ROOT, "www", "appinfo.json");
          if(fs.existsSync(appinfoPath)) {
              try {
                  var appinfo = JSON.parse(fs.readFileSync(appinfoPath));
                  return module.exports.launch(appinfo.id);
              } catch(e) {
                  console.error("ERROR : Unable to read \"appinfo.json\"; cannot determine appID to launch.");
                  process.exit(2);
              }
            }
      });
  });
};

/*
 * Runs the application
 * Returns a promise.
 */
module.exports.launch = function(appID) {
  var doLaunch = function() {
      return spawn("ares-launch", [appID]);
  };
  // close application if it's open, then launch
  return spawn("ares-launch", ["-c", appID], "ignore").then(doLaunch, doLaunch);
};

module.exports.help = function() {
    console.log("Usage: " + path.relative(process.cwd(), path.join(ROOT, 'cordova', 'run')) + " [options]");
    console.log("Build options :");
    console.log("    --debug|--no-minify : Builds project without minification");
    console.log("    --emulator : Will deploy the built project to an emulator if one exists");
    console.log("    --target=<target_id> : Installs to the target with the specified id.");
    process.exit(0);
};
