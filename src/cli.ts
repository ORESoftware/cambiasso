#!/usr/bin/env node
'use strict';

import path = require('path');
import cp = require("child_process");
import log from './logger';
import * as assert from "assert";
import {Registry} from "./main";

const cwd = process.cwd();
let cambiasso = null;

try{
   cambiasso = require(cwd + '/.cambiasso.js');
}
catch(err){
  log.error('Could not load your .cambiasso.js file from your project root.');
  process.exit(1);
}

assert.equal(typeof cambiasso, 'object', 'cambiasso export is not an object.');
assert(cambiasso, 'cambiasso export is falsy.');


const registry : Registry = cambiasso.default || cambiasso;
assert(!Array.isArray(registry), 'cambiasso export is an array, but it should be a non-array object.');
assert(Array.isArray(registry.list), 'cambiasso list export is not an array, but it should be an array.');


const root = path.resolve(cwd + '/node_modules/@cambiasso');

const commands = registry.list.map(v => {
  const base = path.dirname(v.dest);
  const mkdirpath = path.resolve(root + '/' + base);
  const dest = path.isAbsolute(v.dest) ? v.dest : path.resolve(root + '/' + v.dest);
  const src = path.isAbsolute(v.src) ? v.src : path.resolve(cwd + '/' + v.src);
  return `mkdir -p "${mkdirpath}" && ln -sf "${src}" "${dest}"`
});

const k = cp.spawn('bash');

const cmd = [
  `mkdir -p "${root}"`,
  `rm -rf "${root}"`,
  `mkdir -p "${root}"`,
  commands.join('\n')
].join('\n');

k.stdin.end(cmd);


k.stdout.pipe(process.stdout);
k.stderr.pipe(process.stderr);


k.once('exit', code => {

  if(code > 0){
    log.error('Could not run the following bash command successfully:');
    log.error(cmd);
    process.exit(code);
  }

  log.info('Cambiasso run successfully.');
  process.exit(0);
  
});