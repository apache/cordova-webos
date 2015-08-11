<!--
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#  KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#
-->
Cordova webOS
=====================================================
Cordova webOS is a skeleton webOS application, along with JavaScript wrapper libraries, which allow a developer to build an application for an LG webOS device using web technologies. This same code can be built for iPhone, BlackBerry, Symbian, and more to come ...


Pre-requisites
-----------------------------------------------------
You should have the [webOS TV SDK](http://developer.lge.com/webOSTV/sdk/web-sdk/) installed, which installs the ares-sdk-tools which are used for packaging and device installation. For a detailed step-by-step installation and setup guide, see [here](http://developer.lge.com/webOSTV/sdk/web-sdk/sdk-installation/).


Project Management with Cordova webOS
-----------------------------------------------------
This cordova-webos template tool includes 3 main commands to create and manage your cordova projects. Open a terminal, and navigate to the root Cordova webOS folder (where this readme.md file is located). If you don't see the node_modules folder, run `npm install .`, and now you all ready to use the commands:

   - `bin/check_reqs` - Checks to verify your system is configured for webOS build environment tools
   - `bin/create <path> <appid> <appname>` - Creates a new Cordova webOS project at the path you specify
   - `bin/update <path>` - Updates an existing project to current version of Cordova and cordova-webos utilities while leaving your code intact


Cordova Project Utilities
-----------------------------------------------------
Included with each generated Cordova webOS project template are a set of useful tools.

   - `cordova/build` - Packages the application into a .ipk file (The options --debug and --no-minify will skip any minification process)
   - `cordova/emulate` - Starts up the webOS emulator bundled in the LG TV SDK or any other known webOS emulator
   - `cordova/run` - Installs and run the latest built webOS .ipk for your application on to any connected device or active emulator
   - `cordova/version` - Displays the version of cordova-webos that created your project template


Developing Cordova Apps
-----------------------------------------------------
Just open the project in your favourite editor, build your web app, and run the appropriate make command indicated above. Edit appinfo.json to set your app version, etc.

Cordova-webOS fires a `deviceready` that guarantees all the Cordova APIs are in place. You can run your code at `deviceready` like so:

    document.addEventListener('deviceready', function() {
        // do cool Cordova things
    }, false);

The rest is just like any other webapp, with the benefit of  Cordova's standardized [APIs](http://cordova.apache.org/docs/en/edge/index.html) available to use.


Helpful Links
-----------------------------------------------------
  - Apache Cordova website		[cordova.apache.org](http://cordova.apache.org/)
  - LG webOS developer website: 	[developer.lge.com/webOSTV](http://developer.lge.com/webOSTV/)
