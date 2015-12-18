const Promise = require('nodegit-promise');
const NodeGit = require('nodegit');

const RepoUtils = {
  merge(toBranch, fromBranch, repo) {
    return repo.mergeBranches(toBranch.name(), fromBranch.name(), null, NodeGit.Merge.PREFERENCE.NO_FASTFORWARD)
      .then((result) => {
        if (result.hasConflicts && result.hasConflicts()) {
          return Promise.reject(result);
        }

        return Promise.resolve(result);
      });
  },

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
