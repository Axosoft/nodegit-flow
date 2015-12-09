const NodeGit = require('../../src');
const fse = require('fs-extra');
fse.writeFile = require('../../src/utils/Promisify')(fse.writeFile);
const path = require('path');

const RepoUtils = {
  repoDir: '../repos',

  addFileToIndex(repository, fileName) {
    return repository.openIndex()
      .then((index) => {
        index.read(1);
        index.addByPath(fileName);
        index.write();
        return index.writeTree();
      });
  },

  createRepo(repoName) {
    const repoPath = path.join(__dirname, this.repoDir, repoName);
    fse.ensureDirSync(repoPath);
    return NodeGit.Repository.init(repoPath, 0)
  },

  commitFileToRepo(repo, fileName, fileContent) {
    const repoWorkDir = repo.workdir();
    const signature = NodeGit.Signature.create('Foo bar',
      'foo@bar.com', 123456789, 60);

    return fse.writeFile(path.join(repoWorkDir, fileName), fileContent)
      .then(() => this.addFileToIndex(repo, fileName))
      .then((oid) => repo.createCommit('HEAD', signature, signature, 'initial commit', oid, []))
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
