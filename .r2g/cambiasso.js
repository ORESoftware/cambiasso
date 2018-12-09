'use strict';

const path = require('path');

exports.default = {
  
  list: [
    {
      src: path.resolve(__dirname + '/cambiasso-test/files/util.js'),
      dest: 'util.js'
    },
    {
      src: path.resolve(__dirname + '/cambiasso-test/files/util.js'),
      dest: 'red/blue/green/util.js'
    }
  ]
  
  
};