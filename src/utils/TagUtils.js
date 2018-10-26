module.exports = (NodeGit) => ({
  create(oid, tagName, tagMessage = '', repo) {
    return NodeGit.Commit.lookup(repo, oid)
      .then((commit) => {
        const ourSignature = repo.defaultSignature();
        return NodeGit.Tag.create(repo, tagName, commit, ourSignature, tagMessage, 0);
      });
  }
});
