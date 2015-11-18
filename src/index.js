var nodegit = require('nodegit');

var flow = nodegit.Flow = {};

function assign(to, from) {
  Object.keys(from).forEach(function(key) {
    to[key] = from[key];
  });
}

assign(flow, require('./init'));

module.exports = nodegit;
