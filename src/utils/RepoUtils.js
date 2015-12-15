const Promise = require('nodegit-promise');

const RepoUtils = {
  rebase(toBranch, fromBranch, repo) {
    return repo.rebaseBranches(fromBranch.name(), toBranch.name(), undefined, undefined)
      .then((result) => {
        if (result.hasConflicts && result.hasConflicts()) {
          return Promise.reject(result);
        }

        return toBranch.setTarget(result, '');
      });
  }
};

module.exports = RepoUtils;
