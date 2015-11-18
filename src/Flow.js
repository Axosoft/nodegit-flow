var assign = require('./utils/assign');
var Feature = require('./Feature');
var Hotfix = require('./Hotfix');
var Release = require('./Release');
var GitFlowClasses = [Feature, Hotfix, Release];

var Flow = function() {};

GitFlowClasses.forEach(function(GitFlowClass) {
  assign(Flow, GitFlowClass);
});

Flow.init = function init(options) {
  var flow = {};
  var repo = options.repository;
  if (!repo) {
    return Promise.reject(new Error('A repository is required'));
  }

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
