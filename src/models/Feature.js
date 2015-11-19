var Config = require('./Config');

var Feature = function(repo, config) {
  this.repo = repo;
  this.config = config;
};

/**
 * Static method to start a feature
 * @param {Object} the repo to start a feature in
 * @param {String} new branch name to start feature with
 */
Feature.startFeature = function startFeature(repo, featureName) {
  if (!repo) {
    return Promise.reject(new Error('Repo is required'));
  }

  if (!featureName) {
    return Promise.reject(new Error('Feature name is required'));
  }

  var featurePrefix;
  return Config.getConfig(repo)
    .then(function(config) {
      featurePrefix = config.featurePrefix;
      var branchName = featurePrefix + featureName;
      return repo.createBranch(branchName);
    });
};

Feature.startFeatureOnCommit = function startFeatureOnCommit() {
  // TODO
};

/**
 * Static method to finish a feature
 * @param {Object} the repo to start a feature in
 * @param {String} branch name to finish feature with
 */
Feature.finishFeature = function finishFeature() {
  // TODO
};

/**
 * Instance method to start a feature
 * @param {String} branch name to finish feature with
 */
Feature.prototype.startFeature = function startFeature() {
  // TODO
};

/**
 * Instance method to finish a feature
 * @param {String} branch name to finish feature with
 */
Feature.prototype.finishFeature = function finishFeature() {
  // TODO
};

module.exports = Feature;
