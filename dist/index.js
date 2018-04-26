#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const util = require("util");
const residence = require("residence");
const async = require("async");
let cwd = process.cwd();
let root = residence.findProjectRoot(cwd);
const cp = require("child_process");
let pckJSON;
try {
    pckJSON = require(path.resolve(root + '/package.json'));
    if (pckJSON.name === 'cambiasso') {
        const dir = path.dirname((path.resolve(root + '/../')));
        if (dir !== 'node_modules') {
            console.log('done with cambiasso');
            return;
        }
        process.chdir('../../');
        cwd = process.cwd();
        root = residence.findProjectRoot(cwd);
        pckJSON = require(path.resolve(root + '/package.json'));
    }
}
catch (err) {
    console.error('cambiasso could not complete the postinstall routine - missing package.json file.');
    console.error('current working directory:', cwd);
    console.error('current project root:', root);
    throw err;
}
const map = pckJSON.cambiasso || {};
const keys = Object.keys(map);
const home = String(process.env.HOME || '');
async.eachLimit(keys, 3, function (k, cb) {
    const to = path.resolve(`${root}/node_modules/${k}`);
    const from = path.resolve(`${root}/${map[k]}`);
    if (String(to).toUpperCase() === String(home).toUpperCase()) {
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
            cb({ to, from, stderr });
        }
        else {
            cb(null);
        }
    });
}, function (err) {
    if (err) {
        console.error(util.inspect(err));
        process.exit(1);
    }
    console.log('cambiasso success.');
});
