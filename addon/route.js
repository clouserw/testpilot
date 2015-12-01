/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */
const prefs = require('sdk/simple-prefs').prefs;
const IdeaTown = require('idea-town');
const ideaTown = new IdeaTown({
  'BASE_URL': prefs['BASE_URL'], // eslint-disable-line dot-notation
  'HOSTNAME': prefs['HOSTNAME'], // eslint-disable-line dot-notation
  'IDEATOWN_PREFIX': prefs['IDEATOWN_PREFIX'] // eslint-disable-line dot-notation
});

function Router(mod) {
  this.mod = mod;
  this._events = {};
  this.mod.port.on('from-web-to-addon', function(evt) {
    if (this._events[evt.type]) this._events[evt.type](evt.data);
  }.bind(this));
  return this;
}

Router.prototype.on = function(name, f) {
  this._events[name] = f;
  return this;
};

Router.prototype.send = function(name, data, addon) {
  if (addon) {
    data.tags = ['main-addon'];
    ideaTown.metric(name, data, addon);
  }
  this.mod.port.emit('from-addon-to-web', {type: name, data: data});
  return this;
};

module.exports = Router;
