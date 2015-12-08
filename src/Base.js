const Config = require('./Config');
const Feature = require('./Feature');
const Hotfix = require('./Hotfix');
const Release = require('./Release');
const GitFlowClasses = [Config, Feature, Hotfix, Release];

class Base {
  /**
   * Initializes the repo to use gitflow
   * @param {Repository}  repo            The repository to initialize gitflow in
   * @param {Object}      gitflowConfig   The gitflow configuration to use
   * @async
   */
  static init(repo, gitflowConfig) {
    if (!repo) {
      return Promise.reject(new Error('A repository is required'));
    }

    gitflowConfig = gitflowConfig || {};

    var defaultConfig = Config.getConfigDefault();
    var configKeys = Object.keys(defaultConfig);
    var configToUse = {};

    // filter out non-gitflow keys
    configKeys.forEach(function(key) {
      configToUse[key] = gitflowConfig[key];
    });

    var configError = Config.validateConfig(configToUse);
    if (configError) {
      return Promise.reject(new Error(configError));
    }

    var masterBranchName = configToUse['gitflow.branch.master'];
    var developBranchName = configToUse['gitflow.branch.develop'];

    return repo.getBranch(masterBranchName)
      .catch(function() {
        return Promise.reject(new Error('The branch set as the master branch must already exist'));
      })
      .then(function() {
        // Create the `develop` branch if it does not already exist
        return repo.getBranch(developBranchName)
          .catch(function() {
            return repo.getBranchCommit(masterBranchName)
              .then(function(commit) {
                return repo.createBranch(developBranchName, commit.id());
              });
          });
      })
      .then(function() {
        return repo.config();
      })
      .then(function(config) {
        // Set the config values. We chain them so we don't have concurrent setString calls to the same config file
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
  }

  /**
   * Check if the repo is using gitflow
   * @param {Repository}  repo  The nodegit repository instance to check
   * @async
   */
  static isInitialized(repo) {
    if (!repo) {
      return Promise.reject(new Error('A repository is required'));
    }

    return repo.config()
      .then(function(config) {
        var promises = Config.getConfigRequiredKeys().map(function(key) {
          return config.getString(key);
        });

        return Promise.all(promises)
          .then(function() {
            return true;
          })
          .catch(function() {
            return false;
          });
      });
  }
}

module.exports = Base;
