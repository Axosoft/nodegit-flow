var Config = function(repo) {
  this.repo = repo;
};

var _getConfigKeys = function() {
  return Object.keys(Config.getConfigDefault());
};

var _getConfigValue = function(repo, configKey) {
  if (!repo) {
    return Promise.reject(new Error('A repository is required'));
  }

  if (_getConfigKeys().indexOf(configKey) === -1) {
    return Promise.reject(new Error('Invalid gitflow config key.'));
  }

  return repo.config()
    .then(function(config) {
      return config.getString(configKey);
    });
};

Config.getConfigDefault = function() {
  return {
    'gitflow.branch.master': 'master',
    'gitflow.branch.develop': 'develop',

    'gitflow.prefix.feature': 'feature/',
    'gitflow.prefix.release': 'release/',
    'gitflow.prefix.hotfix': 'hotfix/',
    'gitflow.prefix.support': 'support/',
    'gitflow.prefix.versiontag': ''
  };
}

/**
 * Gets the gitflow related config values for the repository
 * @param {Repository}  repo  The nodegit repository to get the config values from
 * @async
 */
Config.getConfig = function(repo) {
  if (!repo) {
    return Promise.reject(new Error('A repository is required'));
  }

  var configKeys = _getConfigKeys();

  return repo.config()
    .then(function(config) {
      var promises = configKeys.map(function(key) {
        return config.getString(key);
      });

      return Promise.all(promises);
    })
    .then(function(values) {
      var result = {};
      configKeys.forEach(function(key, i) {
        result[key] = values[i];
      });

      return result;
    });
};

/**
 * Gets the gitflow related config values for the repository
 * @async
 */
Config.prototype.getConfig = function() {
  return Config.getConfig(this.repo);
};

Config.getMasterBranch = function(repo) {
  return _getConfigValue(repo, 'gitflow.branch.master');
};

Config.prototype.getMasterBranch = function() {
  return Config.getMasterBranch(this.repo);
};

Config.getDevelopBranch = function(repo) {
  return _getConfigValue(repo, 'gitflow.branch.develop');
};

Config.prototype.getDevelopBranch = function() {
  return Config.getDevelopBranch(this.repo);
};

Config.getFeaturePrefix = function(repo) {
  return _getConfigValue(repo, 'gitflow.prefix.feature');
};

Config.prototype.getFeaturePrefix = function() {
  return Config.getFeaturePrefix(this.repo);
};

Config.getReleasePrefix = function(repo) {
  return _getConfigValue(repo, 'gitflow.prefix.release');
};

Config.prototype.getReleasePrefix = function() {
  return Config.getReleasePrefix(this.repo);
};

Config.getHotfixPrefix = function(repo) {
  return _getConfigValue(repo, 'gitflow.prefix.hotfix');
};

Config.prototype.getHotfixPrefix = function() {
  return Config.getHotfixPrefix(this.repo);
};

Config.getSupportPrefix = function(repo) {
  return _getConfigValue(repo, 'gitflow.prefix.support');
};

Config.prototype.getSupportPrefix = function() {
  return Config.getSupportPrefix(this.repo);
};

Config.getVersionTagPrefix = function(repo) {
  return _getConfigValue(repo, 'gitflow.prefix.versiontag');
};

Config.prototype.getVersionTagPrefix = function() {
  return Config.getVersionTagPrefix(this.repo);
};

module.exports = Config;
