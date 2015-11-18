var nodegit = require('nodegit');
var assign = require('./utils/assign');

var flow = nodegit.Flow = {};

assign(flow, require('./init'));

module.exports = nodegit;
