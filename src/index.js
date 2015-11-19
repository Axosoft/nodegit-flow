var nodegit = require('nodegit');
var utils = require('./utils');

var flow = nodegit.Flow = {};

utils.Assign(flow, require('./Config'));
utils.Assign(flow, require('./Flow'));

module.exports = nodegit;
