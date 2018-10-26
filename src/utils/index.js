const AssignUtils = require('./AssignUtils');
const InjectIntermediateCallbackUtils = require('./InjectIntermediateCallbackUtils');
const MergeUtils = require('./MergeUtils');
const RepoUtils = require('./RepoUtils');
const TagUtils = require('./TagUtils');

module.exports = (NodeGit) => ({
  Assign: AssignUtils,
  InjectIntermediateCallback: InjectIntermediateCallbackUtils,
  Merge: MergeUtils,
  Repo: RepoUtils(NodeGit, MergeUtils),
  Tag: TagUtils(NodeGit)
});
