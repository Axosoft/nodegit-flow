var nodegit = require('nodegit');

function getConfig(repository) {
  if (!repository) {
    return Promise.reject('A repository is required.');
  }

  var configKeys = [
    'gitflow.branch.master',
    'gitflow.branch.develop',
    'gitflow.prefix.feature',
    'gitflow.prefix.release',
    'gitflow.prefix.hotfix',
    'gitflow.prefix.support',
    'gitflow.prefix.versiontag'
  ];

  return repository.config()
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

module.exports = getConfig;
