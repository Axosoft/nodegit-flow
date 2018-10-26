const NodeGit = require('nodegit');
const attachFlow = require('../../src');

process.env.NODEGIT_FLOW_TESTING_ENABLED = true;
module.exports = attachFlow(NodeGit);
