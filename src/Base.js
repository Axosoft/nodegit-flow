const Config = require('./Config');
const Feature = require('./Feature');
const Hotfix = require('./Hotfix');
const Release = require('./Release');
const GitFlowClasses = [Base, Config, Feature, Hotfix, Release];

const Base = function() {};

/**
 * Initializes the repo to use gitflow
 * @param {Repository}  repo            The repository to initialize gitflow in
 * @param {Object}      gitflowConfig   The gitflow configuration to use
 * @async
 */
Base.init = function init(repo, gitflowConfig) {
  if (!repo) {
    return Promise.reject(new Error('A repository is required'));
  }

  gitflowConfig = gitflowConfig || {};

  var defaultConfig = Config.getConfigDefault();
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

      // Magic to keep individual object context when using init methods
      GitFlowClasses.forEach(function(GitFlowClass) {
        var gitflowObject = new GitFlowClass(repo);
        Object.getOwnPropertyNames(GitFlowClass.prototype).forEach(function(propName) {
          if (propName !== 'constructor' && typeof GitFlowClass.prototype[propName] === 'function') {
            flow[propName] = function() {
              gitflowObject[propName].apply(gitflowObject, arguments);
            };
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
Base.isInitialized = function isInitialized(repo) {
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

module.exports = Base;
