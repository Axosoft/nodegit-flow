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
    .then((config) => config.getString(configKey))
    .catch(() => Promise.reject(new Error(`Failed to read config value ${configKey}`)));
};

class Config {
  constructor(repo) {
    this.repo = repo;
  }

  static getConfigDefault() {
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
  static getConfig(repo) {
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
  }

  /**
   * Gets the gitflow related config values for the repository
   * @async
   */
  getConfig() {
    return Config.getConfig(this.repo);
  }

  static getMasterBranch(repo) {
    return _getConfigValue(repo, 'gitflow.branch.master');
  }

  getMasterBranch() {
    return Config.getMasterBranch(this.repo);
  }

  static getDevelopBranch(repo) {
    return _getConfigValue(repo, 'gitflow.branch.develop');
  }

  getDevelopBranch() {
    return Config.getDevelopBranch(this.repo);
  }

  static getFeaturePrefix(repo) {
    return _getConfigValue(repo, 'gitflow.prefix.feature');
  }

  getFeaturePrefix() {
    return Config.getFeaturePrefix(this.repo);
  }

  static getReleasePrefix(repo) {
    return _getConfigValue(repo, 'gitflow.prefix.release');
  }

  getReleasePrefix() {
    return Config.getReleasePrefix(this.repo);
  }

  static getHotfixPrefix(repo) {
    return _getConfigValue(repo, 'gitflow.prefix.hotfix');
  }

  getHotfixPrefix() {
    return Config.getHotfixPrefix(this.repo);
  }

  static getSupportPrefix(repo) {
    return _getConfigValue(repo, 'gitflow.prefix.support');
  }

  getSupportPrefix() {
    return Config.getSupportPrefix(this.repo);
  }

  static getVersionTagPrefix(repo) {
    return _getConfigValue(repo, 'gitflow.prefix.versiontag');
  }

  getVersionTagPrefix() {
    return Config.getVersionTagPrefix(this.repo);
  }
}

module.exports = Config;
