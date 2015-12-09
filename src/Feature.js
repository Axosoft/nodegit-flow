const Promise = require('nodegit-promise');
const NodeGit = require('nodegit');
const Config = require('./Config');

class Feature {
  constructor(repo, config) {
    this.repo = repo;
    this.config = config;
  }

  /**
   * Static method to start a feature
   * @param {Object} the repo to start a feature in
   * @param {String} new branch name to start feature with
   */
  static startFeature(repo, featureName) {
    if (!repo) {
      return Promise.reject(new Error('Repo is required'));
    }

    if (!featureName) {
      return Promise.reject(new Error('Feature name is required'));
    }

    let featureBranchName;
    let featureBranch;
    return Config.getConfig(repo)
      .then((config) => {
        const featurePrefix = config['gitflow.prefix.feature'];
        const developBranchName = config['gitflow.branch.develop'];

        featureBranchName = featurePrefix + featureName;
        return NodeGit.Branch.lookup(
          repo,
          developBranchName,
          NodeGit.Branch.BRANCH.LOCAL
        );
      })
      .then((developBranch) => NodeGit.Commit.lookup(repo, developBranch.target()))
      .then((localDevelopCommit) => repo.createBranch(featureBranchName, localDevelopCommit))
      .then((_featureBranch) => {
        featureBranch = _featureBranch;
        return repo.checkoutBranch(featureBranch);
      })
      .then(() => featureBranch);
  }

  /**
   * Static method to finish a feature
   * @param {Object} the repo to start a feature in
   * @param {String} branch name to finish feature with
   */
  static finishFeature() {
    // TODO
  }

  /**
   * Instance method to start a feature
   * @param {String} branch name to finish feature with
   */
  startFeature(featureName) {
    return Feature.startFeature(this.repo, featureName);
  }

  /**
   * Instance method to finish a feature
   * @param {String} branch name to finish feature with
   */
  finishFeature() {
    // TODO
  }
}

module.exports = Feature;
