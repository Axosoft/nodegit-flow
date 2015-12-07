var Release = function(repo) {
  this.repo = repo;
};

/**
 * Static method to start a release
 * @param {Object} the repo to start a release in
 * @param {String} new branch name to start release with
 */
Release.startRelease = function startRelease() {
  // TODO
};

/**
 * Static method to finish a release
 * @param {Object} the repo to start a release in
 * @param {String} branch name to finish release with
 */
Release.finishRelease = function finishRelease() {
  // TODO
};

/**
 * Instance method to start a release
 * @param {String} branch name to finish release with
 */
Release.prototype.startRelease = function startRelease() {
  // TODO
};

/**
 * Instance method to finish a release
 * @param {String} branch name to finish release with
 */
Release.prototype.finishRelease = function finishRelease() {
  // TODO
};

module.exports = Release;
