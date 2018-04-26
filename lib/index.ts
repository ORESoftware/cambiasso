#!/usr/bin/env node
'use strict';

import path = require('path');
import util = require('util');
import residence = require('residence');
import async = require('async');
const root = residence.findProjectRoot(process.cwd());
import cp = require("child_process");

let pckJSON;

try {
  pckJSON = require(path.resolve(root + '/package.json'));
}
catch (err) {
  throw new Error('cambiasso could not complete the postinstall routine - missing package.json file.');
}

const map = pckJSON.cambiasso || {};
const keys = Object.keys(map);
const home = String(process.env.HOME || '');


async.eachLimit(keys, 3, function (k, cb) {
  
  const to = path.resolve(`${root}/node_modules/${k}`);
  const from = path.resolve(`${root}/${map[k]}`);
  
  if(String(to).toUpperCase() === String(home).toUpperCase()){
    throw new Error('cambiasso refusing to rimraf home directory.');
  }
  
  const c = cp.spawn('bash');
  c.stdin.end(`rm -rf ${to}; mkdir -p ${to}; ln -s ${from} ${to}/index.js;\n`);
  
  let stderr = '';
  
  c.stderr.on('data', function (d) {
    stderr += String(d);
  });
  c.once('exit', function (code) {
    if (code > 0) {
      cb({to, from, stderr});
    }
    else {
      cb(null);
    }
  });
  
}, function (err) {
  
  if(err){
    console.error(util.inspect(err));
    process.exit(1);
  }


  console.log('cambiasso success.');
});