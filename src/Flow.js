var assign = require('./utils/assign');
var Feature = require('./Feature');
var Hotfix = require('./Hotfix');
var Release = require('./Release');

var Flow = function() {}

Flow.init = function init(options) {
  var flow = {};
  var repo = options.repository;
  if (!repo) {
    throw new Error('A repository is required');
  }

  var feature = new Feature(repo);
  var hotfix = new hotfix(repo);
  var release = new Release(repo);

  assign(flow, feature);
  assign(flow, hotfix);
  assign(flow, release);

  return flow;
}

Flow.isInitialized = function isInitialized(repository) {
  if (!repository) {
    throw new Error('A repository is required.');
  }

  return repository.config()
    .then(function(config) {
      return Promise.all([
        config.getString('gitflow.branch.master'),
        config.getString('gitflow.branch.develop')
      ])
        .then(function() {
          return true;
        })
        .catch(function() {
          return false;
        });
    });
}

module.exports = Flow;
