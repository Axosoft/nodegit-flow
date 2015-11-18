var Hotfix = function(repo) {
  this.repo = repo;
}

/**
 * Static method to start a hotfix
 * @param {Object} the repo to start a hotfix in
 * @param {String} new branch name to start hotfix with
 */
Hotfix.startHotfix = function startHotfix(repo, branchName) {
  // TODO
}

/**
 * Static method to finish a hotfix
 * @param {Object} the repo to start a hotfix in
 * @param {String} branch name to finish hotfix with
 */
Hotfix.finishHotfix = function finishHotfix(repo, branchName) {
  // TODO
}

/**
 * Instance method to start a hotfix
 * @param {String} branch name to finish hotfix with
 */
Hotfix.prototype.startHotfix = function startHotfix(branchName) {
  // TODO
}

/**
 * Instance method to finish a hotfix
 * @param {String} branch name to finish hotfix with
 */
Hotfix.prototype.finishHotfix = function finishHotfix(branchName) {
  // TODO
}

module.exports = Hotfix;
