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
## Release Notes for Cordova webos ##

### 3.7.0 ###

* CB-8965 Copy cordova-js-src directory to platform folder during create. This closes #4
* made version consistant and added node_modules to git
* Relocated built cordova.js to the more common cordova-lib directory for easier organization
* Include the proper current cordova.js rather than the stale version that slipped through the cracks
* Updated readme for current times/standards
* Updated dependency locations
* Removed unneeded hard-included dependencies
* Initial gitignore
* Removed depreciated code
* Simplified and added improved non-webOS fallback
* Updated with refactorization
* Initial package.json
* Updated Cordova.js
* Updated components for current version
* Modernized build format to use the current check_reqs/create/update format for Cordova platforms
* New template with build, emulate, run, and version commands
* Removed unneeded components
* CB-8417 moved platform specific js into platform
* CB-6818 Add license for CONTRIBUTING.md
* CB-6491 add CONTRIBUTING.md
* updated to latest 2.6.0rc1 tagged cordova-js libs
* update index.html to 2.6.0
* update cordova.js libs to 2.6.0
* update makefile to read cordova version from version file
* update cordova-js libs to the 2.5.0 tagged versions
* update webos cordova-js files to latest versions 2.5.0
* [CB-2323] verify that webOS config uses <widget>; update inline comments to state that config.xml not used by cordova-webos
* update webOS to 2.5.0
* update to 2.5.0 version of cordova.js
* update to latest version of files in hello world app
* update to 2.4.0 cordova-js libs
* update cordova-js libs to 2.4.0
* update version to 2.4.0
* accidently merged file to wrong repository
* Added support for the back-gesture (mapped to backbutton)
* merging changes to webos platform.js
* accidently merged file to wrong repository
* merging changes to webos platform.js
* update cordova-js libs to 2.4.0
* update version to 2.4.0
* updated 2.3.0 updates to cordova-js libs
* updates to cordova.js - added pause/resume document events to sysmgr calls, online/offline document events mapped to network connection service. switched from strings to constants in connection for connection type
* update version to 2.3.0
* merge pull request with cordova-js changes
* update webOS to 2.2.0
* update hello world app to 2.2.0
* update hello world example app for 2.1
* update to 2.1.0rc1
* CB-1096 hello cordova app for webOS
* update version to 2.0.0
* update to version 1.8.1
* CB-899 use org.apache.cordova namespace
* update version to 1.9.0
* CB-897 update webos apache headers / license headers
* CB-899 use org.apache.cordova namespace
* updated Notice file
* added Apache license header
* update to 1.8.0
* CB-557 make sure Makefile works on Win & OSX
* modifications to OS checking in Makefile
* modify Makefile to work with windows
* update version to 1.7.0
* update to 1.6.1
* get compass api to pass mobile spec tests
* added network connection type api
* added network connection api
* update cordova splash / app icon; CB-237
* replace phonegap links with apache cordova links CB-404
* update README
* add LICENSE & NOTICE file, CB-356
* updatd to 1.5.0
* changes for https://issues.apache.org/jira/browse/CB-231
* updatd to 1.5.0
* get compass api to pass mobile spec tests
* added network connection type api
* added network connection api
* update cordova splash / app icon; CB-237
* replace phonegap links with apache cordova links CB-404
* update README
* add LICENSE & NOTICE file, CB-356
* changes for https://issues.apache.org/jira/browse/CB-231
* updatd to 1.5.0
* added HP copyright notice
* update sample application to demo compass api
* Added mapping for compassAPI
* Added compassAPI function
* Added initial compass support
* removed uncessary files
* update version file
* updated version to 1.3.0
* updated version to 1.3.0rc2
* update version file to 1.4.0
* updated version file
* updated version to 1.1.0
* added LICENSE file
* added version file & change log
* add the thumbs.js lib to the repo
* added version file
* phonegap-webos issue # 7
* updated README.md
* added touch events
* added changes.txt
* updated device apis to set name and platform on device ready
* remove unneccessary Mojo object check
* removed unnecessary navigator.device.deviceReady call
* modified so that instantiating phonegap is no longer required
* README updates
* fire deviceready after DOMContentLoaded
* update readme to use phonegap-webos instead of phonegap-palm
* added SQLite example in demo app
* Changed Palm to HP :)
* Added webOS 3.0 compatibility property.
* Changed DOCTYPE to HTML5
* added Alert and GetCurrentOrientation demos
* updated inline code comments, removed commented out code
* initial commit
