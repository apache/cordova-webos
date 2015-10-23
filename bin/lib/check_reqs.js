#!/usr/bin/env node

/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements. See the NOTICE file
distributed with this work for additional information
regarding copyright ownership. The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied. See the License for the
specific language governing permissions and limitations
under the License.
*/

var child_process = require("child_process"),
    Q = require("q");

// Returns a promise.
module.exports.check_ares_package = function() {
    var d = Q.defer();
    child_process.exec("ares-package" + " -V", function(err, stdout, stderr) {
        if (err) d.reject(new Error("ERROR : executing command \"ares-package" + "\", make sure you have ares-webos-sdk installed and added to your path."));
        else d.resolve();
    });
    return d.promise;
}

// Returns a promise.
module.exports.check_ares_install = function() {
    var d = Q.defer();
    child_process.exec("ares-install" + " -V", function(err, stdout, stderr) {
        if (err) d.reject(new Error("ERROR : executing command \"ares-install" + "\", make sure you have ares-webos-sdk installed and added to your path."));
        else d.resolve();
    });
    return d.promise;
}

// Returns a promise.
module.exports.check_ares_launch = function() {
    var d = Q.defer();
    child_process.exec("ares-launch" + " -V", function(err, stdout, stderr) {
        if (err) d.reject(new Error("ERROR : executing command \"ares-launch" + "\", make sure you have ares-webos-sdk installed and added to your path."));
        else d.resolve();
    });
    return d.promise;
}

// Returns a promise.
module.exports.run = function() {
    return Q.all([this.check_ares_package(), this.check_ares_install(), this.check_ares_launch()]);
}
