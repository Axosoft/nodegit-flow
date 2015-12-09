const Promise = require('nodegit-promise');
const NodeGit = require('nodegit');
const Config = require('./Config');

const constants = require('./constants');

class Release {
  constructor(repo) {
    this.repo = repo;
  }

  /**
   * Static method to start a release
   * @param {Object} the repo to start a release in
   * @param {String} new branch name to start release with
   */
  static startRelease(repo, releaseVersion) {
    if (!repo) {
      return Promise.reject(new Error(constants.ErrorMessage.REPO_REQUIRED));
    }

    if (!releaseVersion) {
      return Promise.reject(new Error('Release version is required'));
    }

    let releaseBranchName;
    let releaseBranch;

    return Config.getConfig(repo)
      .then((config) => {
        const releasePrefix = config['gitflow.prefix.release'];
        const developBranchName = config['gitflow.branch.develop'];
        releaseBranchName = releasePrefix + releaseVersion;

        return NodeGit.Branch.lookup(
          repo,
          developBranchName,
          NodeGit.Branch.BRANCH.LOCAL
        );
      })
      .then((developBranch) => NodeGit.Commit.lookup(repo, developBranch.target()))
      .then((localDevelopCommit) => repo.createBranch(releaseBranchName, localDevelopCommit))
      .then((_releaseBranch) => {
        releaseBranch = _releaseBranch;
        return repo.checkoutBranch(releaseBranch);
      })
      .then(() => releaseBranch);
  }

  /**
   * Static method to finish a release
   * @param {Object} the repo to start a release in
   * @param {String} branch name to finish release with
   */
  static finishRelease() {
    // TODO
  }

  /**
   * Instance method to start a release
   * @param {String} branch name to finish release with
   */
  startRelease(releaseVersion) {
    return Release.startRelease(this.repo, releaseVersion);
  }

  /**
   * Instance method to finish a release
   * @param {String} branch name to finish release with
   */
  finishRelease() {
    // TODO
  }
}

module.exports = Release;
