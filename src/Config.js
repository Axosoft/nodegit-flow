const constants = require('./constants');

function _getConfigKeys() {
  return Object.keys(Config.getConfigDefault());
}

function _getConfigValue(repo, configKey) {
  if (!repo) {
    return Promise.reject(new Error(constants.ErrorMessage.REPO_REQUIRED));
  }

  if (_getConfigKeys().indexOf(configKey) === -1) {
    return Promise.reject(new Error('Invalid gitflow config key.'));
  }

  return repo.config()
    .then((config) => config.getString(configKey))
    .catch(() => Promise.reject(new Error(`Failed to read config value ${configKey}`)));
}

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

      'gitflow.prefix.versiontag': ''
    };
  }

  static getConfigRequiredKeys() {
    return [
      'gitflow.branch.master',
      'gitflow.branch.develop',
      'gitflow.prefix.feature',
      'gitflow.prefix.release',
      'gitflow.prefix.hotfix'
    ];
  }

  /**
   * Checks a config object for all required gitflow config keys.
   * @return An error message, or 0 if all required keys are present.
   */
  static validateConfig(config) {
    const missingKeys = Config.getConfigRequiredKeys().filter((key) => {
      return !config[key] || typeof config[key] !== 'string';
    });

    if (missingKeys.length) {
      return 'gitflow config missing key(s): ' + missingKeys.join(', ');
    }

    return 0;
  }

  /**
   * Gets the gitflow related config values for the repository
   * @param {Repository}  repo  The nodegit repository to get the config values from
   * @async
   */
  static getConfig(repo) {
    if (!repo) {
      return Promise.reject(new Error(constants.ErrorMessage.REPO_REQUIRED));
    }

    const configKeys = _getConfigKeys();

    return repo.config()
      .then((config) => {
        const promises = configKeys.map((key) => {
          return config.getString(key);
        });

        return Promise.all(promises);
      })
      .then((values) => {
        const result = {};
        configKeys.forEach((key, i) => {
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
