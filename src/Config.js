module.exports = (NodeGit, { constants }) => {
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
      .then((config) => config.snapshot())
      .then((snapshot) => snapshot.getString(configKey))
      .catch(() => Promise.reject(new Error(`Failed to read config value ${configKey}`)));
  }

  /**
  * All of this class' functions are attached to `NodeGit.Flow` or a `Flow` instance object
  * @class
  */
  class Config {
    constructor(repo) {
      this.repo = repo;
    }

    /**
    * Get default git flow configuration values you can use for initializing. Note that the `initialize` function does
    * not use any values the user did not explicitly pass in.
    * @return {Object} An object of git flow config key/value pairs.
    */
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

    /**
    * Get a list of git flow config keys that are required for initializing git flow
    * @return {Array} A list of config keys
    */
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
    * Checks a config object for all required git flow config keys.
    * @param {Object}  config  An object of git flow config key/value pairs to check
    * @return {Number|String}  An error message, or 0 if all required keys are present.
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
    * Gets the git flow related config values for the repository
    * @async
    * @param {Repository}  repo  The nodegit repository to get the config values from
    * @return {Object}   An object of git flow config key/value pairs
    */
    static getConfig(repo) {
      if (!repo) {
        return Promise.reject(new Error(constants.ErrorMessage.REPO_REQUIRED));
      }

      const configKeys = _getConfigKeys();

      return repo.config()
        .then((config) => config.snapshot())
        .then((snapshot) => {
          const promises = configKeys.map((key) => {
            return snapshot.getString(key);
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
    * Gets the git flow related config values for the repository
    * @async
    * @return {Object}   An object of git flow config key/value pairs
    */
    getConfig() {
      return Config.getConfig(this.repo);
    }

    /**
    * Gets the config value for the git flow master branch
    * @async
    * @param {Repository}  repo  The nodegit repository to get the config value from
    * @return {String}   The config value of the git flow master branch
    */
    static getMasterBranch(repo) {
      return _getConfigValue(repo, 'gitflow.branch.master');
    }

    /**
    * Gets the config value for the git flow master branch
    * @async
    * @return {String} The config value of the git flow master branch
    */
    getMasterBranch() {
      return Config.getMasterBranch(this.repo);
    }


    /**
    * Gets the config value for the git flow develop branch
    * @async
    * @param {Repository}  repo  The nodegit repository to get the config value from
    * @return {String}   The config value of the git flow develop branch
    */
    static getDevelopBranch(repo) {
      return _getConfigValue(repo, 'gitflow.branch.develop');
    }

    /**
    * Gets the config value for the git flow develop branch
    * @async
    * @return {String}   The config value of the git flow develop branch
    */
    getDevelopBranch() {
      return Config.getDevelopBranch(this.repo);
    }


    /**
    * Gets the config value for the git flow feature prefix
    * @async
    * @param {Repository}  repo  The nodegit repository to get the config value from
    * @return {String}   The config value of the git flow feature prefix
    */
    static getFeaturePrefix(repo) {
      return _getConfigValue(repo, 'gitflow.prefix.feature');
    }


    /**
    * Gets the config value for the git flow feature prefix
    * @async
    * @return {String}   The config value of the git flow feature prefix
    */
    getFeaturePrefix() {
      return Config.getFeaturePrefix(this.repo);
    }


    /**
    * Gets the config value for the git flow release prefix
    * @async
    * @param {Repository}  repo  The nodegit repository to get the config value from
    * @return {String}   The config value of the git flow release prefix
    */
    static getReleasePrefix(repo) {
      return _getConfigValue(repo, 'gitflow.prefix.release');
    }

    /**
    * Gets the config value for the git flow release prefix
    * @async
    * @return {String}   The config value of the git flow release prefix
    */
    getReleasePrefix() {
      return Config.getReleasePrefix(this.repo);
    }

    /**
    * Gets the config value for the git flow hotfix prefix
    * @async
    * @param {Repository}  repo  The nodegit repository to get the config value from
    * @return {String}   The config value of the git flow hotfix prefix
    */
    static getHotfixPrefix(repo) {
      return _getConfigValue(repo, 'gitflow.prefix.hotfix');
    }

    /**
    * Gets the config value for the git flow hotfix prefix
    * @async
    * @return {String}   The config value of the git flow hotfix prefix
    */
    getHotfixPrefix() {
      return Config.getHotfixPrefix(this.repo);
    }

    // static getSupportPrefix(repo) {
    //   return _getConfigValue(repo, 'gitflow.prefix.support');
    // }
    //
    // getSupportPrefix() {
    //   return Config.getSupportPrefix(this.repo);
    // }

    /**
    * Gets the config value for the git flow version tag prefix
    * @async
    * @param {Repository}  repo  The nodegit repository to get the config value from
    * @return {String}   The config value of the git flow version tag prefix
    */
    static getVersionTagPrefix(repo) {
      return _getConfigValue(repo, 'gitflow.prefix.versiontag');
    }

    /**
    * Gets the config value for the git flow version tag prefix
    * @async
    * @return {String}   The config value of the git flow version tag prefix
    */
    getVersionTagPrefix() {
      return Config.getVersionTagPrefix(this.repo);
    }
  }

  return Config;
};
