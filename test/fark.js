const a = {
  "scripts": {
    "test": "echo 'noop'"
  }
};


const b = {
  "scripts": {
    "postinstall": "cambiasso"
  }
};


const c = console.log(Object.assign({}, a, b));