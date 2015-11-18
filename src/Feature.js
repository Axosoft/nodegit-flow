var NodeGit = require('nodegit');
var Config = require('./Config');

var Feature = function(repo, config) {
  this.repo = repo;
  this.config = config;
}

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
  var developBranch;
  return Config.getConfig(repo)
    .then(function(config) {
      featurePrefix = config.featurePrefix;
      developBranch = config.developBranch;
      var branchName = featurePrefix + featureName;
      return repo.createBranch(branchName, commit)
    });
};

Feature.startFeatureOnCommit = function startFeatureOnCommit(repo, featureName, sha) {
  // TODO
};

/**
 * Static method to finish a feature
 * @param {Object} the repo to start a feature in
 * @param {String} branch name to finish feature with
 */
Feature.finishFeature = function finishFeature(repo, featureName) {
  // TODO
};

/**
 * Instance method to start a feature
 * @param {String} branch name to finish feature with
 */
Feature.prototype.startFeature = function startFeature(branchName) {
  // TODO
};

/**
 * Instance method to finish a feature
 * @param {String} branch name to finish feature with
 */
Feature.prototype.finishFeature = function finishFeature(branchName) {
  // TODO
};

module.exports = Feature;
