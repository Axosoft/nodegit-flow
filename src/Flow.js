var utils = require('./utils');
var Config = require('./Config');
var Feature = require('./Feature');
var Hotfix = require('./Hotfix');
var Release = require('./Release');
var GitFlowClasses = [Config, Feature, Hotfix, Release];

var defaultConfig = {
  'gitflow.branch.master': 'master',
  'gitflow.branch.develop': 'develop',

  'gitflow.prefix.feature': 'feature/',
  'gitflow.prefix.release': 'release/',
  'gitflow.prefix.hotfix': 'hotfix/',
  'gitflow.prefix.support': 'support/',
  'gitflow.prefix.versiontag': ''
};

var Flow = function() {};

GitFlowClasses.forEach(function(GitFlowClass) {
  utils.Assign(Flow, GitFlowClass);
});

/**
 * Initializes the repo to use gitflow
 * @param {Repository}  repo            The repository to initialize gitflow in
 * @param {Object}      gitflowConfig   The gitflow configuration to use
 * @async
 */
Flow.init = function init(repo, gitflowConfig) {
  if (!repo) {
    return Promise.reject(new Error('A repository is required'));
  }

  gitflowConfig = gitflowConfig || {};

  var configKeys = Object.keys(defaultConfig);
  var configToUse = {};
  configKeys.forEach(function(key) {
    configToUse[key] = gitflowConfig[key] || defaultConfig[key];
  });

  return repo.config()
    .then(function(config) {
      // Chain them so we don't have concurrent setString calls to the same config file
      return configKeys.reduce(function(last, next) {
        return last
          .then(function() {
            return config.setString(next, configToUse[next]);
          });
      }, Promise.resolve());
    })
    .then(function() {
      var flow = {};
      flow.config = configToUse;

      // Magic to keep individual object context when using init methods
      GitFlowClasses.forEach(function(GitFlowClass) {
        var gitflowObject = new GitFlowClass(repo);
        Object.getOwnPropertyNames(GitFlowClass.prototype).forEach(function(propName) {
          if (propName !== 'constructor' && typeof GitFlowClass.prototype[propName] === 'function') {
            flow[propName] = function() {
              gitflowObject[propName].apply(gitflowObject, arguments);
            }
          }
        });
      });

      return flow;
    });
};

/**
 * Check if the repo is using gitflow
 * @param {Repository}  repo  The nodegit repository instance to check
 * @async
 */
Flow.isInitialized = function isInitialized(repo) {
  if (!repo) {
    return Promise.reject(new Error('A repository is required'));
  }

  return repo.config()
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
};

module.exports = Flow;
