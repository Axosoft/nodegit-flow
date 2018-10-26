const fse = require('fs-extra');
const path = require('path');

const promisify = require('../../src/utils/Promisify');
const NodeGit = require('./NodeGit');

fse.writeFile = promisify(fse.writeFile);

const RepoUtils = {
  repoDir: '../repos',

  addFileToIndex(repository, fileName) {
    return repository.index()
      .then((index) => {
        return index.addByPath(fileName)
          .then(() => index.write())
          .then(() => index.writeTree());
      });
  },

  createRepo(repoName) {
    const repoPath = path.join(__dirname, this.repoDir, repoName);
    fse.ensureDirSync(repoPath);
    return NodeGit.Repository.init(repoPath, 0);
  },

  commitFileToRepo(repo, fileName, fileContent, _commitMessage, parent, branchName = 'HEAD') {
    const repoWorkDir = repo.workdir();
    const signature = NodeGit.Signature.create('Foo bar',
      'foo@bar.com', 123456789, 60);
    const commitMessage = _commitMessage || 'initial commit';
    const parents = (parent) ? [parent] : [];

    return fse.writeFile(path.join(repoWorkDir, fileName), fileContent)
      .then(() => this.addFileToIndex(repo, fileName))
      .then((oid) => repo.createCommit(branchName, signature, signature, commitMessage, oid, parents))
      .then((commitOid) => repo.getCommit(commitOid));
  },

  deleteRepo(repoName) {
    const repoPath = path.join(__dirname, this.repoDir, repoName);
    if (fse.existsSync(repoPath)) {
      fse.removeSync(repoPath);
    }
  }
};

module.exports = RepoUtils;
