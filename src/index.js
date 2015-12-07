const nodegit = require('nodegit');
const utils = require('./utils');
const Base = require('./Base');
const Config = require('./Config');
const Feature = require('./Feature');
const Hotfix = require('./Hotfix');
const Release = require('./Release');
const GitFlowClasses = [Base, Config, Feature, Hotfix, Release];

// Add Flow methods to vanilla nodegit instance
nodegit.Flow = {};
GitFlowClasses.forEach((GitFlowClass) => {
  utils.Assign(nodegit.Flow, GitFlowClass);
});

module.exports = nodegit;
