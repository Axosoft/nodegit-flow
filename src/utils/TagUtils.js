module.exports = (NodeGit) => ({
  create(oid, tagName, tagMessage = '', repo) {
    return Promise.all([
      NodeGit.Commit.lookup(repo, oid),
      repo.defaultSignature()
    ])
      .then(([commit, ourSignature]) =>
        NodeGit.Tag.create(repo, tagName, commit, ourSignature, tagMessage, 0)
      );
  }
});
