const MergeUtils = {
  getMergeMessage(toBranch, fromBranch) {
    return `Merged ${fromBranch.shorthand()} into ${toBranch.shorthand()}`;
  }
};

module.exports = MergeUtils;
