/* eslint prefer-arrow-callback: 0 */

const NodeGit = require('../utils/NodeGit');
const RepoUtils = require('../utils/RepoUtils');

const { utils } = NodeGit.Flow.__TEST__;

const expectStartHotfixSuccess = function expectStartHotfixSuccess(hotfixBranch, expectedBranchName) {
  expect(hotfixBranch.isBranch()).toBeTruthy();
  expect(hotfixBranch.shorthand()).toBe(expectedBranchName);
  expect(hotfixBranch.isHead()).toBeTruthy();
};

const expectFinishHotfixSuccess = function expectFinishHotfixSuccess(
  hotfixBranch,
  expectedTagName,
  keepBranch,
  developMergeMessage,
  masterMergeMessage
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
      const expectedDevelopCommitMessage
        = developMergeMessage || utils.Merge.getMergeMessage(developBranch, hotfixBranch);
      const expectedMasterCommitMessage
        = masterMergeMessage || utils.Merge.getMergeMessage(masterBranch, hotfixBranch);
      expect(developCommit.message()).toBe(expectedDevelopCommitMessage);
      expect(masterCommit.message()).toBe(expectedMasterCommitMessage);
      return NodeGit.Reference.lookup(this.repo, expectedTagName);
    })
    .then((tag) => {
      expect(tag.isTag()).toBeTruthy();
      expect(tag.target()).toEqual(masterCommit.id());
      return NodeGit.Branch.lookup(this.repo, hotfixBranch.shorthand(), NodeGit.Branch.BRANCH.LOCAL);
    });

  if (!keepBranch) {
    return promise
      .catch((err) => {
        expect(err.message.toLowerCase()).toBe(`cannot locate local branch '${hotfixBranch.shorthand().toLowerCase()}'`);
      });
  }

  return promise;
};

describe('Hotfix', function() {
  beforeEach(function(done) {
    this.repoName = 'hotfixRepo';
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
        this.hotfixPrefix = this.config['gitflow.prefix.hotfix'];
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

  it('should be able to start hotfix statically', function(done) {
    const hotfixName = '1.0.0';
    NodeGit.Flow.startHotfix(this.repo, hotfixName)
      .then((hotfixBranch) => {
        expectStartHotfixSuccess(hotfixBranch, this.hotfixPrefix + hotfixName);
        done();
      });
  });

  it('should be able to start hotfix using flow instance', function(done) {
    const hotfixName = '1.0.0';
    this.flow.startHotfix(hotfixName)
      .then((hotfixBranch) => {
        expectStartHotfixSuccess(hotfixBranch, this.hotfixPrefix + hotfixName);
        done();
      });
  });

  it('should be able to finish hotfix statically', function(done) {
    const hotfixName = '1.0.0';
    const fullTagName = `refs/tags/${this.versionPrefix}${hotfixName}`;
    let hotfixBranch;
    NodeGit.Flow.startHotfix(this.repo, hotfixName)
      .then((_hotfixBranch) => {
        hotfixBranch = _hotfixBranch;
        expectStartHotfixSuccess(hotfixBranch, this.hotfixPrefix + hotfixName);
        return RepoUtils.commitFileToRepo(
          this.repo,
          'anotherFile.js',
          'Hello World',
          'second commit',
          this.firstCommit
        );
      })
      .then(() => NodeGit.Flow.finishHotfix(this.repo, hotfixName))
      .then(() => expectFinishHotfixSuccess.call(this, hotfixBranch, fullTagName))
      .then(done);
  });

  it('should be able to finish hotfix using flow instance', function(done) {
    const hotfixName = '1.0.0';
    const fullTagName = `refs/tags/${this.versionPrefix}${hotfixName}`;
    let hotfixBranch;
    this.flow.startHotfix(hotfixName)
      .then((_hotfixBranch) => {
        hotfixBranch = _hotfixBranch;
        expectStartHotfixSuccess(hotfixBranch, this.hotfixPrefix + hotfixName);

        return RepoUtils.commitFileToRepo(
          this.repo,
          'anotherFile.js',
          'Hello World',
          'second commit',
          this.firstCommit
        );
      })
      .then(() => this.flow.finishHotfix(hotfixName))
      .then(() => expectFinishHotfixSuccess.call(this, hotfixBranch, fullTagName))
      .then(done);
  });

  it('should be able to finish hotfix statically and keep the branch', function(done) {
    const hotfixName = '1.0.0';
    const fullTagName = `refs/tags/${this.versionPrefix}${hotfixName}`;
    let hotfixBranch;
    NodeGit.Flow.startHotfix(this.repo, hotfixName)
      .then((_hotfixBranch) => {
        hotfixBranch = _hotfixBranch;
        expectStartHotfixSuccess(hotfixBranch, this.hotfixPrefix + hotfixName);
        return RepoUtils.commitFileToRepo(
          this.repo,
          'anotherFile.js',
          'Hello World',
          'second commit',
          this.firstCommit
        );
      })
      .then(() => NodeGit.Flow.finishHotfix(this.repo, hotfixName, {keepBranch: true}))
      .then(() => expectFinishHotfixSuccess.call(this, hotfixBranch, fullTagName, true))
      .then(done);
  });

  it('should be able to finish hotfix using flow instance and keep the branch', function(done) {
    const hotfixName = '1.0.0';
    const fullTagName = `refs/tags/${this.versionPrefix}${hotfixName}`;
    let hotfixBranch;
    this.flow.startHotfix(hotfixName)
      .then((_hotfixBranch) => {
        hotfixBranch = _hotfixBranch;
        expectStartHotfixSuccess(hotfixBranch, this.hotfixPrefix + hotfixName);

        return RepoUtils.commitFileToRepo(
          this.repo,
          'anotherFile.js',
          'Hello World',
          'second commit',
          this.firstCommit
        );
      })
      .then(() => this.flow.finishHotfix(hotfixName, {keepBranch: true}))
      .then(() => expectFinishHotfixSuccess.call(this, hotfixBranch, fullTagName, true))
      .then(done);
  });

  it('should be able to finish a hotfix that is still pointed at master', function(done) {
    const hotfixName = '1.0.0';
    const fullTagName = `refs/tags/${this.versionPrefix}${hotfixName}`;
    const expectedCommitMessage = 'initial commit';
    let hotfixBranch;
    this.flow.startHotfix(hotfixName)
      .then((_hotfixBranch) => {
        hotfixBranch = _hotfixBranch;
        expectStartHotfixSuccess(hotfixBranch, this.hotfixPrefix + hotfixName);
        return this.flow.finishHotfix(hotfixName, {keepBranch: true});
      })
      .then(() => expectFinishHotfixSuccess.call(
        this,
        hotfixBranch,
        fullTagName,
        true,
        expectedCommitMessage,
        expectedCommitMessage
      ))
      .then(done);
  });
});
