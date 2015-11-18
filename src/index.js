var nodegit = require('nodegit');
var assign = require('./utils/assign');

var flow = nodegit.Flow = {};

assign(flow, require('./config'));
assign(flow, require('./Flow'));

module.exports = nodegit;
