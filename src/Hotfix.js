const Promise = require('nodegit-promise');
const NodeGit = require('nodegit');
const Config = require('./Config');

const constants = require('./constants');
const utils = require('./utils');

class Hotfix {
  constructor(repo) {
    this.repo = repo;
  }

  /**
   * Static method to start a hotfix
   * @param {Object} repo to start the hotfix in
   * @param {String} branch name to finish hotfix with
   */
  static startHotfix(repo, hotfixVersion) {
    if (!repo) {
      return Promise.reject(new Error(constants.ErrorMessage.REPO_REQUIRED));
    }

    if (!hotfixVersion) {
      return Promise.reject(new Error('Hotfix version is required'));
    }

    let hotfixBranchName;
    let hotfixBranch;

    return Config.getConfig(repo)
      .then((config) => {
        const hotfixPrefix = config['gitflow.prefix.hotfix'];
        const masterBranchName = config['gitflow.branch.master'];
        hotfixBranchName = hotfixPrefix + hotfixVersion;

        return NodeGit.Branch.lookup(
          repo,
          masterBranchName,
          NodeGit.Branch.BRANCH.LOCAL
        );
      })
      .then((masterBranch) => NodeGit.Commit.lookup(repo, masterBranch.target()))
      .then((localMasterCommit) => repo.createBranch(hotfixBranchName, localMasterCommit))
      .then((_hotfixBranch) => {
        hotfixBranch = _hotfixBranch;
        return repo.checkoutBranch(hotfixBranch);
      })
      .then(() => hotfixBranch);
  }

  /**
   * Static method to finish a hotfix
   * @param {Object} repo that contains the hotfix to finish
   * @param {String} branch name to finish hotfix with
   */
  static finishHotfix(repo, hotfixVersion) {
    if (!repo) {
      return Promise.reject(new Error('Repo is required'));
    }

    if (!hotfixVersion) {
      return Promise.reject(new Error('Hotfix name is required'));
    }

    let developBranch;
    let hotfixBranch;
    let masterBranch;
    let developCommit;
    let hotfixCommit;
    let masterCommit;
    let mergeCommit;
    let versionPrefix;
    return Config.getConfig(repo)
      .then((config) => {
        const developBranchName = config['gitflow.branch.develop'];
        const hotfixBranchName = config['gitflow.prefix.hotfix'] + hotfixVersion;
        const masterBranchName = config['gitflow.branch.master'];
        versionPrefix = config['gitflow.prefix.versiontag'];

        // Get the develop, master, and hotfix branch
        return Promise.all(
          [developBranchName, hotfixBranchName, masterBranchName]
            .map((branchName) => NodeGit.Branch.lookup(repo, branchName, NodeGit.Branch.BRANCH.LOCAL))
        );
      })
      .then((branches) => {
        developBranch = branches[0];
        hotfixBranch = branches[1];
        masterBranch = branches[2];

        // Get the commits that the develop, master, and hotfix branches point to
        return Promise.all(branches.map((branch) => repo.getCommit(branch.target())));
      })
      .then((commits) => {
        developCommit = commits[0];
        hotfixCommit = commits[1];
        masterCommit = commits[2];

        // Merge the hotfix branch into master
        return NodeGit.Merge.commits(repo, hotfixCommit, masterCommit);
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
        const commitMessage = utils.Merge.getMergeMessage(masterBranch, hotfixBranch);

        // Create the merge commit of hotfix into master
        return repo.createCommit(
          masterBranch.name(),
          ourSignature,
          ourSignature,
          commitMessage,
          oid,
          [masterCommit, hotfixCommit]
        );
      })
      .then((oid) => NodeGit.Commit.lookup(repo, oid))
      // Tag the merge commit on master
      .then((commit) => {
        const tagName = versionPrefix + hotfixVersion;
        const ourSignature = repo.defaultSignature();
        return NodeGit.Tag.create(repo, tagName, commit, ourSignature, '', 0);
      })
      // Merge hotfix into develop
      .then(() => NodeGit.Merge.commits(repo, hotfixCommit, developCommit))
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
        const commitMessage = utils.Merge.getMergeMessage(developBranch, hotfixBranch);
        return repo.createCommit(
          developBranch.name(),
          ourSignature,
          ourSignature,
          commitMessage,
          oid,
          [developCommit, hotfixCommit]
        );
      })
      .then((_mergeCommit) => {
        mergeCommit = _mergeCommit;
        return repo.checkoutBranch(developBranch);
      })
      .then(() => hotfixBranch.delete())
      .then(() => mergeCommit);
  }

  /**
   * Instance method to start a hotfix
   * @param {String} new branch name to start hotfix with
   */
  startHotfix(hotfixVersion) {
    return Hotfix.startHotfix(this.repo, hotfixVersion);
  }

  /**
   * Instance method to finish a hotfix
   * @param {String} branch name to finish hotfix with
   */
  finishHotfix(hotfixVersion) {
    return Hotfix.finishHotfix(this.repo, hotfixVersion);
  }
}

module.exports = Hotfix;
