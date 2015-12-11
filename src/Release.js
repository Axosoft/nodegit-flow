const Promise = require('nodegit-promise');
const NodeGit = require('nodegit');
const Config = require('./Config');

const constants = require('./constants');
const utils = require('./utils');

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
  static finishRelease(repo, releaseVersion) {
    if (!repo) {
      return Promise.reject(new Error('Repo is required'));
    }

    if (!releaseVersion) {
      return Promise.reject(new Error('Release name is required'));
    }

    let developBranch;
    let releaseBranch;
    let masterBranch;
    let developCommit;
    let releaseCommit;
    let masterCommit;
    let mergeCommit;
    let versionPrefix;
    return Config.getConfig(repo)
      .then((config) => {
        const developBranchName = config['gitflow.branch.develop'];
        const releaseBranchName = config['gitflow.prefix.release'] + releaseVersion;
        const masterBranchName = config['gitflow.branch.master'];
        versionPrefix = config['gitflow.prefix.versiontag'];

        // Get the develop, master, and release branch
        return Promise.all(
          [developBranchName, releaseBranchName, masterBranchName]
            .map((branchName) => NodeGit.Branch.lookup(repo, branchName, NodeGit.Branch.BRANCH.LOCAL))
        );
      })
      .then((branches) => {
        developBranch = branches[0];
        releaseBranch = branches[1];
        masterBranch = branches[2];

        // Get the commits that the develop, master, and release branches point to
        return Promise.all(branches.map((branch) => repo.getCommit(branch.target())));
      })
      .then((commits) => {
        developCommit = commits[0];
        releaseCommit = commits[1];
        masterCommit = commits[2];

        // Merge the release branch into master
        return NodeGit.Merge.commits(repo, releaseCommit, masterCommit);
      })
      .then((index) => {
        if (!index.hasConflicts()) {
          index.write();

          // Write the merge index to the repo
          return index.writeTreeTo(repo);
        }

        // Reject with the index if there are conflicts
        return Promise.reject(index);
      })
      .then((oid) => {
        const ourSignature = repo.defaultSignature();
        const commitMessage = utils.Merge.getMergeMessage(masterBranch, releaseBranch);

        // Create the merge commit of release into master
        return repo.createCommit(
          masterBranch.name(),
          ourSignature,
          ourSignature,
          commitMessage,
          oid,
          [masterCommit, releaseCommit]
        );
      })
      .then((oid) => NodeGit.Commit.lookup(repo, oid))
      // Tag the merge commit on master
      .then((commit) => {
        const tagName = versionPrefix + releaseVersion;
        const ourSignature = repo.defaultSignature();
        return NodeGit.Tag.create(repo, tagName, commit, ourSignature, '', 0);
      })
      // Merge release into develop
      .then(() => NodeGit.Merge.commits(repo, releaseCommit, developCommit))
      .then((index) => {
        if (!index.hasConflicts()) {
          index.write();
          return index.writeTreeTo(repo);
        }

        // Reject with the index if there are conflicts
        return Promise.reject(index);
      })
      .then((oid) => {
        const ourSignature = repo.defaultSignature();
        const commitMessage = utils.Merge.getMergeMessage(developBranch, releaseBranch);
        return repo.createCommit(
          developBranch.name(),
          ourSignature,
          ourSignature,
          commitMessage,
          oid,
          [developCommit, releaseCommit]
        );
      })
      .then((_mergeCommit) => {
        mergeCommit = _mergeCommit;
        return repo.checkoutBranch(developBranch);
      })
      .then(() => releaseBranch.delete())
      .then(() => mergeCommit);
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
  finishRelease(releaseVersion) {
    return Release.finishRelease(this.repo, releaseVersion);
  }
}

module.exports = Release;
