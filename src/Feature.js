const Promise = require('nodegit-promise');
const NodeGit = require('nodegit');
const Config = require('./Config');

const constants = require('./constants');
const utils = require('./utils');

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
   * @param {Boolean} option to keep feature branch after finishing
   */
  static finishFeature(repo, featureName, keepBranch) {
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
    let cancelDevelopMerge;
    let mergeCommit;
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

        // If the develop branch and feautre branch point to the same thing do not merge them
        cancelDevelopMerge = developCommit.id().toString() === featureCommit.id().toString();

        if (!cancelDevelopMerge) {
          return NodeGit.Merge.commits(repo, developCommit, featureCommit);
        }
        return Promise.resolve();
      })
      .then((index) => {
        if (cancelDevelopMerge) {
          return Promise.resolve();
        }

        if (!index.hasConflicts()) {
          index.write();
          return index.writeTreeTo(repo);
        }

        // Reject with the index if there are conflicts
        return Promise.reject(index);
      })
      .then((oid) => {
        if (cancelDevelopMerge) {
          return Promise.resolve(featureCommit);
        }

        const ourSignature = repo.defaultSignature();
        const commitMessage = utils.Merge.getMergeMessage(developBranch, featureBranch);
        return repo.createCommit(
          developBranch.name(),
          ourSignature,
          ourSignature,
          commitMessage,
          oid,
          [developCommit, featureCommit]
        );
      })
      .then((_mergeCommit) => {
        mergeCommit = _mergeCommit;
        return repo.checkoutBranch(developBranch);
      })
      .then(() => {
        if (keepBranch) {
          return Promise.resolve();
        }

        return featureBranch.delete();
      })
      .then(() => mergeCommit);
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
   * @param {Boolean} option to keep feature branch after finishing
   */
  finishFeature(featureName, keepBranch) {
    return Feature.finishFeature(this.repo, featureName, keepBranch);
  }
}

module.exports = Feature;
