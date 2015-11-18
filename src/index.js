var nodegit = require('nodegit');
var utils = require('./utils');

var flow = nodegit.Flow = {};

utils.Assign(flow, require('./config'));
utils.Assign(flow, require('./Flow'));

module.exports = nodegit;
