/* eslint prefer-arrow-callback: 0 */

const Feature = require('../../src/Feature');
const NodeGit = require('../../src');
const RepoUtils = require('../utils/RepoUtils');

const MergeUtils = require('../../src/utils/MergeUtils');

const expectStartFeatureSuccess = function expectStartFeatureSuccess(featureBranch, expectedBranchName) {
  expect(featureBranch.isBranch()).toBeTruthy();
  expect(featureBranch.shorthand()).toBe(expectedBranchName);
  expect(featureBranch.isHead()).toBeTruthy();
};

const expectFinishFeatureSuccess = function expectFinishFeatureSuccess(featureBranch, keepBranch, message) {
  let developBranch;
  const promise =  NodeGit.Branch.lookup(
    this.repo,
    this.config['gitflow.branch.develop'],
    NodeGit.Branch.BRANCH.LOCAL
  )
    .then((_developBranch) => {
      developBranch = _developBranch;
      expect(developBranch.isHead());
      return this.repo.getCommit(developBranch.target());
    })
    .then((developCommit) => {
      const expectedCommitMessage = message || MergeUtils.getMergeMessage(developBranch, featureBranch);
      expect(developCommit.message()).toBe(expectedCommitMessage);
      return NodeGit.Branch.lookup(this.repo, featureBranch.shorthand(), NodeGit.Branch.BRANCH.LOCAL);
    });

  if (!keepBranch) {
    return promise.catch((err) => {
      expect(err.message.toLowerCase()).toBe(`cannot locate local branch '${featureBranch.shorthand().toLowerCase()}'`);
    });
  }

  return promise;
};

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
      .then((firstCommit) => {
        this.firstCommit = firstCommit;
        this.config = NodeGit.Flow.getConfigDefault();
        this.featurePrefix = this.config['gitflow.prefix.feature'];

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

  it('should be able to start feature statically', function(done) {
    const featureName = 'foobar';
    Feature.startFeature(this.repo, featureName)
      .then((featureBranch) => {
        expectStartFeatureSuccess(featureBranch, this.featurePrefix + featureName);
        done();
      });
  });

  it('should be able to start feature using flow instance', function(done) {
    const featureName = 'foobar';
    this.flow.startFeature(featureName)
      .then((featureBranch) => {
        expectStartFeatureSuccess(featureBranch, this.featurePrefix + featureName);
        done();
      });
  });

  it('should be able to finish feature statically', function(done) {
    const featureName = 'foobar';
    let featureBranch;
    Feature.startFeature(this.repo, featureName)
      .then((_featureBranch) => {
        featureBranch = _featureBranch;
        expectStartFeatureSuccess(featureBranch, this.featurePrefix + featureName);

        return RepoUtils.commitFileToRepo(
          this.repo,
          'someFile.js',
          'Hello World',
          'second commit',
          this.firstCommit
        );
      })
      .then(() => Feature.finishFeature(this.repo, featureName))
      .then(() => expectFinishFeatureSuccess.call(this, featureBranch))
      .then(done);
  });

  it('should be able to finish feature on flow instance', function(done) {
    const featureName = 'foobar';
    let featureBranch;
    this.flow.startFeature(featureName)
      .then((_featureBranch) => {
        featureBranch = _featureBranch;
        expectStartFeatureSuccess(featureBranch, this.featurePrefix + featureName);

        return RepoUtils.commitFileToRepo(
          this.repo,
          'someFile.js',
          'Hello World',
          'second commit',
          this.firstCommit
        );
      })
      .then(() => this.flow.finishFeature(featureName, {keepBranch: true}))
      .then(() => expectFinishFeatureSuccess.call(this, featureBranch))
      .then(done);
  });

  it('should be able to finish feature statically and keep the branch', function(done) {
    const featureName = 'foobar';
    let featureBranch;
    Feature.startFeature(this.repo, featureName)
      .then((_featureBranch) => {
        featureBranch = _featureBranch;
        expectStartFeatureSuccess(featureBranch, this.featurePrefix + featureName);

        return RepoUtils.commitFileToRepo(
          this.repo,
          'someFile.js',
          'Hello World',
          'second commit',
          this.firstCommit
        );
      })
      .then(() => Feature.finishFeature(this.repo, featureName, {keepBranch: true}))
      .then(() => expectFinishFeatureSuccess.call(this, featureBranch, true))
      .then(done);
  });

  it('should be able to finish feature on flow instance and keep the branch', function(done) {
    const featureName = 'foobar';
    let featureBranch;
    this.flow.startFeature(featureName)
      .then((_featureBranch) => {
        featureBranch = _featureBranch;
        expectStartFeatureSuccess(featureBranch, this.featurePrefix + featureName);

        return RepoUtils.commitFileToRepo(
          this.repo,
          'someFile.js',
          'Hello World',
          'second commit',
          this.firstCommit
        );
      })
      .then(() => this.flow.finishFeature(featureName, {keepBranch: true}))
      .then(() => expectFinishFeatureSuccess.call(this, featureBranch, true))
      .then(done);
  });

  it('should be able to finish feature statically with a rebase', function(done) {
    const featureName = 'foobar';
    let featureBranch;
    Feature.startFeature(this.repo, featureName)
      .then((_featureBranch) => {
        featureBranch = _featureBranch;
        expectStartFeatureSuccess(featureBranch, this.featurePrefix + featureName);

        return RepoUtils.commitFileToRepo(
          this.repo,
          'someFile.js',
          'Hello World',
          'second commit',
          this.firstCommit
        );
      })
      .then(() => this.repo.checkoutBranch('develop'))
      .then(() => RepoUtils.commitFileToRepo(
        this.repo,
        'someOtherFile.js',
        'Some content',
        'third commit',
        this.firstCommit,
        'refs/heads/develop'
      ))
      .then(() => Feature.finishFeature(this.repo, featureName, {keepBranch: false, isRebase: true}))
      .then(() => expectFinishFeatureSuccess.call(this, featureBranch, false, 'second commit'))
      .then(done);
  });
});
