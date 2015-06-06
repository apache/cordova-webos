#!/usr/bin/env node

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
var fs = require('fs'),
    shjs = require('shelljs'),
    args = process.argv,
    path = require('path'),
    ROOT    = path.join(__dirname, '..', '..'),
    check_reqs = require('./check_reqs');

exports.createProject = function(project_path,project_id,project_name){
    var VERSION = fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf-8');
    
    // Set default values for path, package and name
    project_path = typeof project_path !== 'undefined' ? project_path : "CordovaExample";
    project_id = typeof project_id !== 'undefined' ? project_id : 'org.apache.cordova.example';
    project_name = typeof project_name !== 'undefined' ? project_name : 'CordovaExample';

    // Check if project already exists
    if(fs.existsSync(project_path)) {
        console.error('Project already exists! Delete and recreate');
        process.exit(2);
    }
    
    // Check that requirements are met and proper targets are installed
    check_reqs.run().done(
        function success() {
            console.log('Creating webOS project');
            console.log('Project Path: '+ path.relative(process.cwd(),project_path));
            console.log('Project ID: '+ project_id);
            console.log('Project Name: '+ project_name);

            //copy template folder
            shjs.cp('-r', path.join(ROOT, 'bin', 'templates', 'project', 'www'), project_path);

            // update appinfo.json
            try {
                var appInfoPath = path.join(project_path, 'www', 'appinfo.json');
                var appInfo = JSON.parse(fs.readFileSync(appInfoPath, {encoding:"utf8"}));
                appInfo.id = project_id;
                appInfo.title = project_name;
                fs.writeFileSync(appInfoPath, JSON.stringify(appInfo, null, "\t"));
            } catch(e) {
                console.warn('AppInfo initialization failed: ' + e);
            }
            
            //copy cordova js file
            shjs.cp(path.join(ROOT, 'cordova-lib', 'cordova.js'), path.join(project_path,'www'));  

            //copy cordova folder
            shjs.cp('-r', path.join(ROOT, 'bin', 'templates', 'project', 'cordova'), project_path);
            shjs.cp('-r', path.join(ROOT, 'node_modules'), path.join(project_path,'cordova'));

            // copy check_reqs
            shjs.cp(path.join(ROOT, 'bin', 'check_reqs.bat'), path.join(project_path, 'cordova', 'check_reqs.bat'));
            shjs.cp(path.join(ROOT, 'bin', 'check_reqs'), path.join(project_path, 'cordova', 'check_reqs'));
            shjs.cp(path.join(ROOT, 'bin', 'lib', 'check_reqs.js'), path.join(project_path, 'cordova', 'lib', 'check_reqs.js'));

            // update permissions
            shjs.find(path.join(project_path, 'cordova')).forEach(function(entry) {
                shjs.chmod(755, entry);
            });
            console.log('Project successfully created.');
        }, function fail(err) {
            console.error('Please make sure you meet the software requirements in order to build a webOS Cordova project');
            process.exit(2);
        }
    );
}
