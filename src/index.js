var nodegit = require('nodegit');
var utils = require('./utils');
var models = require('./models');

var flow = nodegit.Flow = {};

utils.Assign(flow, models.Config);
utils.Assign(flow, models.Flow);

module.exports = nodegit;
