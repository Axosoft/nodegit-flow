const MergeUtils = {
  getMergeMessage(toBranch, fromBranch) {
    let mergeDecorator;
    if (fromBranch.isTag()) {
      mergeDecorator = 'tag';
    } else if (fromBranch.isRemote()) {
      mergeDecorator = 'remote-tracking branch';
    } else {
      mergeDecorator = 'branch';
    }

    const message = `Merge ${mergeDecorator} '${fromBranch.shorthand()}'`;

    // https://github.com/git/git/blob/master/builtin/fmt-merge-msg.c#L456-L459
    return toBranch.shorthand() !== 'master'
      ? `${message} into ${toBranch.shorthand()}`
      : message;
  }
};

module.exports = MergeUtils;
