const Feature = require('../../src/Feature');
const NodeGit = require('../../src');
const fse = require('fs-extra');
const RepoUtils = require('../utils/RepoUtils');

describe('Feature', function() {
  beforeEach(function(done) {
    this.repoName = 'featureRepo';
    this.fileName = 'foobar.js';
    return RepoUtils.createRepo(this.repoName)
      .then((repo) => {
        this.repo = repo;
        return RepoUtils.commitFileToRepo(
          this.repo,
          this.fileName,
          'Line1\nLine2\nLine3'
        );
      })
      .then(() => {
        const defaultConfig = NodeGit.Flow.getConfigDefault();
        this.featurePrefix = defaultConfig['gitflow.prefix.feature'];

        return NodeGit.Flow.init(this.repo, defaultConfig);
      })
      .then((flow) => {
        this.flow = flow;
        done();
      });
  });

  afterEach(function() {
    RepoUtils.deleteRepo(this.repoName);
  });

  it('should be able to start feature statically', function(done) {
    const featureName = 'foobar';
    Feature.startFeature(this.repo, featureName)
      .then((branch) => {
        expect(branch.isBranch()).toBeTruthy();
        expect(branch.shorthand()).toBe(this.featurePrefix + featureName);
        done();
      });
  });
});
