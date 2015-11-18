var Config = function(repo) {
  this.repo = repo;
};

var _getConfigKeys = function() {
  return Object.keys(Config.getConfigDefault());
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

module.exports = Config;
