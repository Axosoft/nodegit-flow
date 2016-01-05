const NodeGit = require('nodegit');

const Config = require('./Config');
const Feature = require('./Feature');
const Hotfix = require('./Hotfix');
const Release = require('./Release');
const GitFlowClasses = [Config, Feature, Hotfix, Release];

const constants = require('./constants');

function createFlowInstance(repo) {
  const Flow = {};

  // Magic to keep individual object context when using init methods
  GitFlowClasses.forEach((GitFlowClass) => {
    const gitflowObject = new GitFlowClass(repo);
    Object.getOwnPropertyNames(GitFlowClass.prototype).forEach((propName) => {
      if (propName !== 'constructor' && typeof GitFlowClass.prototype[propName] === 'function') {
        Flow[propName] = function() {
          return gitflowObject[propName].apply(gitflowObject, arguments);
        };
      }
    });
  });

  return Flow;
}

/**
 * All of this class' functions are attached to `NodeGit.Flow`
 * @class
 */
class Base {
  /**
   * Check if the repo is initialized with git flow and its develop branch exists
   * @async
   * @param {Repository}  repo  The nodegit repository instance to check
   * @return {Boolean} Whether or not the develop branch as specified in the git config exists
   */
  static developBranchExists(repo) {
    if (!repo) {
      return Promise.reject(new Error(constants.ErrorMessage.REPO_REQUIRED));
    }

    return this.isInitialized(repo)
      .then((isInitialized) => {
        if (!isInitialized) {
          return Promise.reject(new Error(constants.ErrorMessage.GIT_FLOW_NOT_INITIALIZED));
        }

        return repo.config()
          .then((config) => {
            const developBranchName = config.getString('gitflow.branch.develop');
            return NodeGit.Branch.lookup(repo, developBranchName, NodeGit.Branch.BRANCH.LOCAL);
          })
          .then(() => true)
          .catch(() => false);
      });
  }

  /**
   * Initializes the repo to use git flow
   * @async
   * @param {Repository}  repo            The repository to initialize git flow in
   * @param {Object}      gitflowConfig   The git flow configuration to use
   * @return {Flow} An instance of a flow object tied to the repository
   */
  static init(repo, gitflowConfig) {
    if (!repo) {
      return Promise.reject(new Error(constants.ErrorMessage.REPO_REQUIRED));
    }

    gitflowConfig = gitflowConfig || {};

    const defaultConfig = Config.getConfigDefault();
    const configKeys = Object.keys(defaultConfig);
    const configToUse = {};

    // filter out non-gitflow keys
    configKeys.forEach((key) => {
      configToUse[key] = gitflowConfig[key];
    });

    const configError = Config.validateConfig(configToUse);
    if (configError) {
      return Promise.reject(new Error(configError));
    }

    const masterBranchName = configToUse['gitflow.branch.master'];
    const developBranchName = configToUse['gitflow.branch.develop'];

    return NodeGit.Branch.lookup(repo, masterBranchName, NodeGit.Branch.BRANCH.LOCAL)
      .catch(() => {
        return Promise.reject(new Error('The branch set as the `master` branch must already exist locally'));
      })
      .then(() => {
        // Create the `develop` branch if it does not already exist
        return NodeGit.Branch.lookup(repo, developBranchName, NodeGit.Branch.BRANCH.LOCAL)
          .catch(() => repo.getBranchCommit(masterBranchName)
              .then((commit) => repo.createBranch(developBranchName, commit.id())));
      })
      .then(() => repo.config())
      .then((config) => {
        // Set the config values. We chain them so we don't have concurrent setString calls to the same config file
        return configKeys.reduce((last, next) => {
          return last
            .then(() => {
              return config.setString(next, configToUse[next]);
            });
        }, Promise.resolve());
      })
      .then(() => createFlowInstance(repo));
  }

  /**
   * Check if the repo is using git flow
   * @async
   * @param {Repository}  repo  The nodegit repository instance to check
   * @return {Boolean} Whether or not the repo has git flow initialized
   */
  static isInitialized(repo) {
    if (!repo) {
      return Promise.reject(new Error(constants.ErrorMessage.REPO_REQUIRED));
    }

    return repo.config()
      .then((config) => {
        const promises = Config.getConfigRequiredKeys().map((key) => {
          return config.getString(key);
        });

        return Promise.all(promises)
          .then(() => true)
          .catch(() => false);
      });
  }

  /**
   * Check if the repo is initialized with git flow and its master branch exists
   * @async
   * @param {Repository}  repo  The nodegit repository instance to check
   * @return {Boolean} Whether or not the master branch as specified in the git config exists
   */
  static masterBranchExists(repo) {
    if (!repo) {
      return Promise.reject(new Error(constants.ErrorMessage.REPO_REQUIRED));
    }

    return Base.isInitialized(repo)
      .then((isInitialized) => {
        if (!isInitialized) {
          return Promise.reject(new Error(constants.ErrorMessage.GIT_FLOW_NOT_INITIALIZED));
        }

        return repo.config()
          .then((config) => {
            const masterBranchName = config.getString('gitflow.branch.master');
            return NodeGit.Branch.lookup(repo, masterBranchName, NodeGit.Branch.BRANCH.LOCAL);
          })
          .then(() => true)
          .catch(() => false);
      });
  }

  /**
   * Creates a Flow instance for a repo that already has git flow initialized
   * @async
   * @param {Repository}  repo  The target nodegit repository
   * @return {Flow} An instance of a flow object tied to the repository
   */
  static open(repo) {
    return Base.isInitialized(repo)
      .then((isInitialized) => {
        if (!isInitialized) {
          return Promise.reject(new Error('The repository does not have gitflow initialized'));
        }

        return createFlowInstance(repo);
      });
  }
}

module.exports = Base;
