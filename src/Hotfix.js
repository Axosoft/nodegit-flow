const NodeGit = require('nodegit');
const Config = require('./Config');

const constants = require('./constants');
const utils = require('./utils');

/**
 * All of this class' functions are attached to `NodeGit.Flow` or a `Flow` instance object
 * @class
 */
class Hotfix {
  constructor(repo) {
    this.repo = repo;
  }

  /**
   * Starts a git flow "hotfix"
   * @async
   * @param {Object}  repo          The repository to start a hotfix in
   * @param {String}  hotfixVersion The version of the hotfix to start
   * @param {Object}  options       Options for start hotfix
   * @return {Branch}   The nodegit branch for the hotfix
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
   * Finishes a git flow "hotfix"
   * @async
   * @param {Object}  repo            The repository to finish a hotfix in
   * @param {String}  hotfixVersion   The version of the hotfix to finish
   * @param {Object}  options         Options for finish hotfix
   * @return {Commit}   The commit created by finishing the hotfix
   */
  static finishHotfix(repo, hotfixVersion, options = {}) {
    const {keepBranch, message} = options;

    if (!repo) {
      return Promise.reject(new Error('Repo is required'));
    }

    if (!hotfixVersion) {
      return Promise.reject(new Error('Hotfix name is required'));
    }

    let cancelMasterMerge;
    let cancelDevelopMerge;
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

        // If either develop or master point to the same commit as the hotfix branch cancel
        // their respective merge
        cancelDevelopMerge = developCommit.id().toString() === hotfixCommit.id().toString();
        cancelMasterMerge = masterCommit.id().toString() === hotfixCommit.id().toString();

        // Merge hotfix into develop
        if (!cancelDevelopMerge) {
          return utils.Repo.merge(developBranch, hotfixBranch, repo);
        }
        return Promise.resolve();
      })
      .then((_mergeCommit) => {
        mergeCommit = _mergeCommit;

        const tagName = versionPrefix + hotfixVersion;
        // Merge the hotfix branch into master
        if (!cancelMasterMerge) {
          return utils.Repo.merge(masterBranch, hotfixBranch, repo)
            .then((oid) => utils.Tag.create(oid, tagName, message, repo));
        }

        // If the merge is cancelled only tag the master commit
        const masterOid = NodeGit.Oid.fromString(masterCommit.id().toString());
        return utils.Tag.create(masterOid, tagName, message, repo);
      })
      .then(() => {
        if (keepBranch) {
          return Promise.resolve();
        }

        return hotfixBranch.delete();
      })
      .then(() => mergeCommit);
  }

  /**
   * Starts a git flow "hotfix"
   * @async
   * @param {String}  hotfixVersion The version of the hotfix to start
   * @param {Object}  options       Options for start hotfix
   * @return {Branch}   The nodegit branch for the hotfix
   */
  startHotfix() {
    return Hotfix.startHotfix(this.repo, ...arguments);
  }

  /**
   * Finishes a git flow "hotfix"
   * @async
   * @param {String}  hotfixVersion   The version of the hotfix to finish
   * @param {Object}  options         Options for finish hotfix
   * @return {Commit}   The commit created by finishing the hotfix
   */
  finishHotfix() {
    return Hotfix.finishHotfix(this.repo, ...arguments);
  }
}

module.exports = Hotfix;
