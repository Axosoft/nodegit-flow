const Promise = require('nodegit-promise');
const NodeGit = require('nodegit');
const Config = require('./Config');

const constants = require('./constants');

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
      return Promise.reject(new Error(constants.ErrorMessage.REPO_REQUIRED));
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
  static finishFeature(repo, featureName) {
    if (!repo) {
      return Promise.reject(new Error('Repo is required'));
    }

    if (!featureName) {
      return Promise.reject(new Error('Feature name is required'));
    }

    let developBranch;
    let featureBranch;
    let developCommit;
    let featureCommit;
    return Config.getConfig(repo)
      .then((config) => {
        const developBranchName = config['gitflow.branch.develop'];
        const featureBranchName = config['gitflow.prefix.feature'] + featureName;

        return Promise.all(
          [developBranchName, featureBranchName]
            .map((branchName) => NodeGit.Branch.lookup(repo, branchName, NodeGit.Branch.BRANCH.LOCAL))
        );
      })
      .then((branches) => {
        developBranch = branches[0];
        featureBranch = branches[1];
        return Promise.all(branches.map((branch) => repo.getCommit(branch.target())));
      })
      .then((commits) => {
        developCommit = commits[0];
        featureCommit = commits[1];
        return NodeGit.Merge.commits(repo, developCommit, featureCommit);
      })
      .then((index) => {
        if (!index.hasConflicts()) {
          index.write();
          return index.writeTreeTo(repo);
        }
        return Promise.reject(`Failed merging ${featureBranch.name()} into ${developBranch.name()}`);
      })
      .then((oid) => {
        const commitMessage = `Merged branch ${featureBranch.name()} into ${developBranch.name()}`;
        return repo.createCommit(
          developBranch.name(),
          repo.defaultSignature(),
          repo.defaultSignature(),
          commitMessage,
          oid,
          [developCommit, featureCommit]
        );
      })
      .then(() => repo.checkoutBranch(developBranch))
      .then(() => featureBranch.delete());
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
  finishFeature(featureName) {
    return Feature.finishFeature(this.repo, featureName);
  }
}

module.exports = Feature;
