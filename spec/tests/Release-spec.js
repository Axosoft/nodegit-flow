/* eslint prefer-arrow-callback: 0 */

const Release = require('../../src/Release');
const NodeGit = require('../../src');
const RepoUtils = require('../utils/RepoUtils');

const expectStartReleaseSuccess = function expectStartReleaseSuccess(releaseBranch, expectedBranchName) {
  expect(releaseBranch.isBranch()).toBeTruthy();
  expect(releaseBranch.shorthand()).toBe(expectedBranchName);
  expect(releaseBranch.isHead()).toBeTruthy();
};

describe('Release', function() {
  beforeEach(function(done) {
    this.repoName = 'releaseRepo';
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
        this.config = NodeGit.Flow.getConfigDefault();
        this.releasePrefix = this.config['gitflow.prefix.release'];

        return NodeGit.Flow.init(this.repo, this.config);
      })
      .then((flow) => {
        this.flow = flow;
        done();
      });
  });

  afterEach(function() {
    RepoUtils.deleteRepo(this.repoName);
  });

  it('should be able to start release statically', function(done) {
    const releaseName = 'foobar';
    Release.startRelease(this.repo, releaseName)
      .then((releaseBranch) => {
        expectStartReleaseSuccess(releaseBranch, this.releasePrefix + releaseName);
        done();
      });
  });

  it('should be able to start release using flow instance', function(done) {
    const releaseName = 'foobar';
    this.flow.startRelease(releaseName)
      .then((releaseBranch) => {
        expectStartReleaseSuccess(releaseBranch, this.releasePrefix + releaseName);
        done();
      });
  });
});
