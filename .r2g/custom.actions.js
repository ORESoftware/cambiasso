'use strict';

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

exports.inCopyBeforeInstall = [




];

exports.inCopyAfterInstall = [




];



exports.inProjectBeforeInstall = [
  
  (root,cb) => {
    
    const k = cp.spawn('bash');
    
    const cmd = `mkdir -p "${root}/cambiasso-test/files"`;
    
    k.stdin.end(cmd);
    
    k.once('exit',code => {
      if(code >0 ){
        console.error('Could not run command:',cmd);
      }
      cb(code);
    });
    
  },
  
  (root,cb) => {
    
    console.error('this is the root:', root);
    
    fs.createReadStream(require.resolve('../dist/util.js'))
      .pipe(fs.createWriteStream(path.resolve(root + '/cambiasso-test/files/util.js')))
      .once('error',cb)
      .once('finish',cb);
    
  },
  
  (root,cb) => {
    
    console.error('this is the root:', root);
    
    fs.createReadStream(require.resolve('./cambiasso.js'))
      .pipe(fs.createWriteStream(path.resolve(root + '/.cambiasso.js')))
      .once('error',cb)
      .once('finish',cb);
    
  },
  
  
];

exports.inProjectAfterInstall = [




];