// global jsio
jsio = require('jsio');
path = require('path');

// Export window
global.window = global;
global.screen = {
  width: 640,
  height: 480
};

__tests = __dirname;
/**
 * Mock local storage
 */

var storage = {};
global.localStorage = {
  getItem: function (key) {
    return storage[key];
  },

  setItem: function (key, val) {
    storage[key] = val;
  },

  length: function () {
    return Object.keys(storage).filter(function (key) {
      return storage[key] !== void 0;
    });
  },

  removeItem: function (key) {
    storage[key] = void 0;
  },

  /* jshint -W001 */
  hasOwnProperty: function (key) {
    return storage[key] !== void 0;
  },
  /* jshint +W001 */

  clear: function () {
    Object.keys(storage).forEach(function(key) {
      storage[key] = void 0;
    });
  }
};

// Use mock APIs
global.DEBUG = true;

global.CACHE = {};

global.NATIVE = {
  plugins: {
    sendEvent: function() {}
  }
};

global.GC = {
  on: function () {},
  off: function () {}
};

// mock navigator
var machine = 'Macintosh';
var arch = 'Intel Mac OS X 10_6_7';
var engine = 'AppleWebKit/534.36 (KHTML, like Gecko)' +
             'NodeJS/v0.4.7 Chrome/13.0.767.0 Safari/534.36';
global.navigator = {
  appCodeName: 'Mozilla',
  appName: 'Netscape',
  appVersion: '5.0 (' + machine + '; ' + arch + ') ' + engine,
  cookieEnabled: true,
  geolocation: undefined,
  mimeTypes: [],
  onLine: true,
  platform: 'MacIntel',
  plugins: [],
  product: 'Gecko',
  productSub: '20030107',
  userAgent: 'Mozilla/5.0 (' + machine + '; ' + arch + ') ' + engine,
  vendor: 'Joyent',
  vendorSub: ''
};

global.document = {
  createElement: function () {
    return {
      insertBefore: function () {}
    };
  },
  documentElement: {}
};

jsio.path.add('js');
jsio.path.add('node_modules/devkit-timestep/src');
jsio.path.add('node_modules/jsio/packages');

after(function () {
  // Clear cached jsio modules so source is fresh on next run. This is
  // necessary for mocha's --watch functionality.
  jsio.__modules = {preprocessors: {}};

  // Reset local storage between runs
  localStorage.clear();
});

getFreshJSIO = function () {
  var j = jsio.clone();
  j.path.value = JSON.parse(JSON.stringify(jsio.path.value));
  j.path.cache = JSON.parse(JSON.stringify(jsio.path.cache));
  return j;
};
