class Release {
  constructor(repo) {
    this.repo = repo;
  }

  /**
   * Static method to start a release
   * @param {Object} the repo to start a release in
   * @param {String} new branch name to start release with
   */
  startRelease() {
    // TODO
  }

  /**
   * Static method to finish a release
   * @param {Object} the repo to start a release in
   * @param {String} branch name to finish release with
   */
  finishRelease() {
    // TODO
  }

  /**
   * Instance method to start a release
   * @param {String} branch name to finish release with
   */
  static startRelease() {
    // TODO
  }

  /**
   * Instance method to finish a release
   * @param {String} branch name to finish release with
   */
  static finishRelease() {
    // TODO
  }
}

module.exports = Release;
