const MergeUtils = {
  getMergeMessage(toBranch, fromBranch) {
    return `Merged branch ${fromBranch.shorthand()} into ${toBranch.shorthand()}`;
  }
};

module.exports = MergeUtils;
