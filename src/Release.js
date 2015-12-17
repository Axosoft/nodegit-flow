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
  static startRelease(repo, releaseVersion, options) {
    const {sha} = options;

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

        // If we have a sha look that up instead of the develop branch
        if (sha) {
          return NodeGit.Commit.lookup(repo, sha);
        }

        return NodeGit.Branch.lookup(
          repo,
          developBranchName,
          NodeGit.Branch.BRANCH.LOCAL
        )
        .then((developBranch) => NodeGit.Commit.lookup(repo, developBranch.target()));
      })
      .then((startingCommit) => repo.createBranch(releaseBranchName, startingCommit))
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
   * @param {Object} options for finish release
   */
  static finishRelease(repo, releaseVersion, options = {}) {
    const {keepBranch, message} = options;

    if (!repo) {
      return Promise.reject(new Error('Repo is required'));
    }

    if (!releaseVersion) {
      return Promise.reject(new Error('Release name is required'));
    }

    let developBranch;
    let releaseBranch;
    let masterBranch;
    let cancelDevelopMerge;
    let cancelMasterMerge;
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

        // If either develop or master point to the same commit as the release branch cancel
        // their respective merge
        cancelDevelopMerge = developCommit.id().toString() === releaseCommit.id().toString();
        cancelMasterMerge = masterCommit.id().toString() === releaseCommit.id().toString();

        // Merge the release branch into master
        if (!cancelMasterMerge) {
          return NodeGit.Merge.commits(repo, releaseCommit, masterCommit);
        }
        return Promise.resolve();
      })
      .then((index) => {
        if (cancelMasterMerge) {
          return Promise.resolve();
        }

        if (!index.hasConflicts()) {
          index.write();

          // Write the merge index to the repo
          return index.writeTreeTo(repo);
        }

        // Reject with the index if there are conflicts
        return Promise.reject(index);
      })
      .then((oid) => {
        if (cancelMasterMerge) {
          return Promise.resolve(masterCommit.id());
        }

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
      // Tag the merge (or master) commit
      .then((commit) => {
        const tagName = versionPrefix + releaseVersion;
        const ourSignature = repo.defaultSignature();
        const tagMessage = message || '';
        return NodeGit.Tag.create(repo, tagName, commit, ourSignature, tagMessage, 0);
      })
      // Merge release into develop
      .then(() => {
        if (!cancelDevelopMerge) {
          return NodeGit.Merge.commits(repo, releaseCommit, developCommit);
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
          return Promise.resolve(releaseCommit);
        }

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
      .then(() => {
        if (keepBranch) {
          return Promise.resolve();
        }

        return releaseBranch.delete();
      })
      .then(() => mergeCommit);
  }

  /**
   * Instance method to start a release
   * @param {String} branch name to finish release with
   */
  startRelease() {
    return Release.startRelease(this.repo, ...arguments);
  }

  /**
   * Instance method to finish a release
   * @param {String} branch name to finish release with
   * @param {Boolean} option to keep release branch after finishing
   * @param {String} optional message to create an annotatd release tag with
   */
  finishRelease() {
    return Release.finishRelease(this.repo, ...arguments);
  }
}

module.exports = Release;
