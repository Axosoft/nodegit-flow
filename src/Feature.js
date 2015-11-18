var Feature = function(repo) {
  this.repo = repo;
}

/**
 * Static method to start a feature
 * @param {Object} the repo to start a feature in
 * @param {String} new branch name to start feature with
 */
Feature.startFeature = function startFeature(repo, branchName) {
  // TODO
}

/**
 * Static method to finish a feature
 * @param {Object} the repo to start a feature in
 * @param {String} branch name to finish feature with
 */
Feature.finishFeature = function finishFeature(repo, branchName) {
  // TODO
}

/**
 * Instance method to start a feature
 * @param {String} branch name to finish feature with
 */
Feature.prototype.startFeature = function startFeature(branchName) {
  // TODO
}

/**
 * Instance method to finish a feature
 * @param {String} branch name to finish feature with
 */
Feature.prototype.finishFeature = function finishFeature(branchName) {
  // TODO
}

module.exports = Feature;
