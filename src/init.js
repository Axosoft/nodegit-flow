function init(options) {
}

function isInitialized(repository) {
  if (!repository) {
    throw new Error('A repository is required.');
  }

  return repository.config()
    .then(function(config) {
      return Promise.all([
        config.getString('gitflow.branch.master'),
        config.getString('gitflow.branch.develop')
      ])
        .then(function() {
          return true;
        })
        .catch(function() {
          return false;
        });
    });
}

module.exports = {
  init: init,
  isInitialized: isInitialized
};
