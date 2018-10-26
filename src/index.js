const constants = require('./constants');
const makeUtils = require('./utils');
const makeBase = require('./Base');
const makeConfig = require('./Config');
const makeFeature = require('./Feature');
const makeHotfix = require('./Hotfix');
const makeRelease = require('./Release');

module.exports = (NodeGit) => {
  const utils = makeUtils(NodeGit);
  const Config = makeConfig(NodeGit, { constants });
  const Feature = makeFeature(NodeGit, { constants, utils }, { Config });
  const Hotfix = makeHotfix(NodeGit, { constants, utils }, { Config });
  const Release = makeRelease(NodeGit, { constants, utils }, { Config });
  const Base = makeBase(NodeGit, { constants }, { Config, Feature, Hotfix, Release });

  const GitFlowClasses = [Base, Config, Feature, Hotfix, Release];
  // Add static Flow methods to provided nodegit instance
  NodeGit.Flow = {};
  GitFlowClasses.forEach((GitFlowClass) => {
    utils.Assign(NodeGit.Flow, GitFlowClass);
  });

  if (process.env.NODEGIT_FLOW_TESTING_ENABLED) {
    NodeGit.Flow.__TEST__ = {
      Base,
      Config,
      Feature,
      Hotfix,
      Release,
      utils
    };
  }

  module.exports = NodeGit;
  return module.exports;
};
