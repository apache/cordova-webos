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

var shell = require("shelljs"),
    spawn = require("./ares-spawn"),
    Q = require("q"),
    path = require("path"),
    fs = require("fs"),
    ROOT = path.join(__dirname, "..", "..");


/*
 * Builds the project with ares-package.
 * Returns a promise.
 */
module.exports.run = function(build_type) {
    build_type = typeof build_type !== "undefined" ? build_type : "";
    var binDir = path.join(ROOT, "bin");
    if(!fs.existsSync(binDir)) {
        shell.mkdir("-p", binDir);
    }
    var args = ["-o", path.join(ROOT, "bin")];
    if(build_type==="--debug" || build_type==="--no-minify"
            || build_type==="--enyo-debug") {
        args.push("-n");
    }
    args.push(path.join(ROOT, "www"));
    return spawn("ares-package", args);
}

/*
 * Gets the path to the ipk file, if not such file exists then
 * the script will error out.
 */
module.exports.get_ipk = function() {
    var binDir = path.join(ROOT, "bin");
    if (fs.existsSync(binDir)) {
        var candidates = fs.readdirSync(binDir).filter(function(p) {
            // Need to find most recent .ipk.
            return path.extname(p) == ".ipk";
        }).map(function(p) {
            p = path.join(binDir, p);
            return { p: p, t: fs.statSync(p).mtime };
        }).sort(function(a,b) {
            return a.t > b.t ? -1 :
                   a.t < b.t ? 1 : 0;
        });
        if (candidates.length === 0) {
            console.error("ERROR : No .ipk found in " + binDir + " directory");
            process.exit(2);
        }
        console.log("Using ipk: " + candidates[0].p);
        return candidates[0].p;
    } else {
        console.error("ERROR : unable to find project " + binDir + " directory, could not locate .ipk");
        process.exit(2);
    }
}

module.exports.help = function() {
    console.log("Usage: " + path.relative(process.cwd(), path.join(ROOT, 'cordova', 'build')) + " [options]");
    console.log("    '--debug|--no-minify': Will build the project without minification phase");
    process.exit(0);
}
