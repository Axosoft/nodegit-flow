/* eslint prefer-arrow-callback: 0 */

const Release = require('../../src/Release');
const NodeGit = require('../../src');
const RepoUtils = require('../utils/RepoUtils');

const utils = require('../../src/utils');

const expectStartReleaseSuccess = function expectStartReleaseSuccess(releaseBranch, expectedBranchName) {
  expect(releaseBranch.isBranch()).toBeTruthy();
  expect(releaseBranch.shorthand()).toBe(expectedBranchName);
  expect(releaseBranch.isHead()).toBeTruthy();
};

const expectFinishReleaseSuccess = function expectFinishReleaseSuccess(
  releaseBranch,
  expectedTagName,
  keepBranch,
  developCommitMessage,
  masterCommitMessage
) {
  let developBranch;
  let masterBranch;
  let developCommit;
  let masterCommit;
  const promise = Promise.all([this.config['gitflow.branch.develop'], this.config['gitflow.branch.master']].map(
    (branch) => NodeGit.Branch.lookup(
      this.repo,
      branch,
      NodeGit.Branch.BRANCH.LOCAL
    )
  ))
    .then((branches) => {
      developBranch = branches[0];
      masterBranch = branches[1];
      expect(developBranch.isHead());
      return Promise.all(branches.map((branch) => this.repo.getCommit(branch.target())));
    })
    .then((commits) => {
      developCommit = commits[0];
      masterCommit = commits[1];
      const expectedDevelopCommitMessage =
        developCommitMessage || utils.Merge.getMergeMessage(developBranch, releaseBranch);
      const expectedMasterCommitMessage =
        masterCommitMessage || utils.Merge.getMergeMessage(masterBranch, releaseBranch);
      expect(developCommit.message()).toBe(expectedDevelopCommitMessage);
      expect(masterCommit.message()).toBe(expectedMasterCommitMessage);
      return NodeGit.Reference.lookup(this.repo, expectedTagName);
    })
    .then((tag) => {
      expect(tag.isTag()).toBeTruthy();
      expect(tag.target()).toEqual(masterCommit.id());
      return NodeGit.Branch.lookup(this.repo, releaseBranch.shorthand(), NodeGit.Branch.BRANCH.LOCAL);
    });

  if (!keepBranch) {
    return promise
      .catch((err) => {
        expect(err.message.toLowerCase()).toBe(`cannot locate local branch '${releaseBranch.shorthand().toLowerCase()}'`);
      });
  }

  return promise;
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
      .then((firstCommit) => {
        this.firstCommit = firstCommit;
        this.config = NodeGit.Flow.getConfigDefault();
        this.releasePrefix = this.config['gitflow.prefix.release'];
        this.versionPrefix = this.config['gitflow.prefix.versiontag'];

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
    const releaseName = '1.0.0';
    Release.startRelease(this.repo, releaseName)
      .then((releaseBranch) => {
        expectStartReleaseSuccess(releaseBranch, this.releasePrefix + releaseName);
        done();
      });
  });

  it('should be able to start release using flow instance', function(done) {
    const releaseName = '1.0.0';
    this.flow.startRelease(releaseName)
      .then((releaseBranch) => {
        expectStartReleaseSuccess(releaseBranch, this.releasePrefix + releaseName);
        done();
      });
  });

  it('should be able to finish release statically', function(done) {
    const releaseName = '1.0.0';
    const fullTagName = `refs/tags/${this.versionPrefix}${releaseName}`;
    let releaseBranch;
    Release.startRelease(this.repo, releaseName)
      .then((_releaseBranch) => {
        releaseBranch = _releaseBranch;
        expectStartReleaseSuccess(releaseBranch, this.releasePrefix + releaseName);

        return RepoUtils.commitFileToRepo(
          this.repo,
          'anotherFile.js',
          'some content',
          'second commit',
          this.firstCommit
        );
      })
      .then(() => Release.finishRelease(this.repo, releaseName))
      .then(() => expectFinishReleaseSuccess.call(this, releaseBranch, fullTagName))
      .then(done);
  });

  it('should be able to finish release using flow instance', function(done) {
    const releaseName = '1.0.0';
    const fullTagName = `refs/tags/${this.versionPrefix}${releaseName}`;
    let releaseBranch;
    this.flow.startRelease(releaseName)
      .then((_releaseBranch) => {
        releaseBranch = _releaseBranch;
        expectStartReleaseSuccess(releaseBranch, this.releasePrefix + releaseName);

        return RepoUtils.commitFileToRepo(
          this.repo,
          'anotherFile.js',
          'some content',
          'second commit',
          this.firstCommit
        );
      })
      .then(() => this.flow.finishRelease(releaseName))
      .then(() => expectFinishReleaseSuccess.call(this, releaseBranch, fullTagName))
      .then(done);
  });

  it('should be able to finish release statically and keep the branch', function(done) {
    const releaseName = '1.0.0';
    const fullTagName = `refs/tags/${this.versionPrefix}${releaseName}`;
    let releaseBranch;
    Release.startRelease(this.repo, releaseName)
      .then((_releaseBranch) => {
        releaseBranch = _releaseBranch;
        expectStartReleaseSuccess(releaseBranch, this.releasePrefix + releaseName);

        return RepoUtils.commitFileToRepo(
          this.repo,
          'anotherFile.js',
          'some content',
          'second commit',
          this.firstCommit
        );
      })
      .then(() => Release.finishRelease(this.repo, releaseName, {keepBranch: true}))
      .then(() => expectFinishReleaseSuccess.call(this, releaseBranch, fullTagName, true))
      .then(done);
  });

  it('should be able to finish release using flow instance and keep the branch', function(done) {
    const releaseName = '1.0.0';
    const fullTagName = `refs/tags/${this.versionPrefix}${releaseName}`;
    let releaseBranch;
    this.flow.startRelease(releaseName)
      .then((_releaseBranch) => {
        releaseBranch = _releaseBranch;
        expectStartReleaseSuccess(releaseBranch, this.releasePrefix + releaseName);

        return RepoUtils.commitFileToRepo(
          this.repo,
          'anotherFile.js',
          'some content',
          'second commit',
          this.firstCommit
        );
      })
      .then(() => this.flow.finishRelease(releaseName, {keepBranch: true}))
      .then(() => expectFinishReleaseSuccess.call(this, releaseBranch, fullTagName, true))
      .then(done);
  });

  it('should be able to finish release while branch is still pointed at master', function(done) {
    const releaseName = '1.0.0';
    const fullTagName = `refs/tags/${this.versionPrefix}${releaseName}`;
    const commitMessage = 'initial commit';
    let releaseBranch;
    this.flow.startRelease(releaseName)
      .then((_releaseBranch) => {
        releaseBranch = _releaseBranch;
        expectStartReleaseSuccess(releaseBranch, this.releasePrefix + releaseName);
        return this.flow.finishRelease(releaseName, {keepBranch: true});
      })
      .then(() => expectFinishReleaseSuccess.call(this, releaseBranch, fullTagName, true, commitMessage, commitMessage))
      .then(done);
  });
});
