# nodegit-flow

Adds gitflow methods to the [nodegit](https://github.com/nodegit/nodegit) module.

## Installation

```
npm install --save nodegit-flow
```

## Usage

`nodegit-flow` is a drop in replacement for `nodegit`. All methods in `nodegit` are included in `nodegit-flow`.
You must provide the `nodegit` module to `nodegit-flow`.

```javascript
var nodegit = require('nodegit-flow')(require('nodegit')); // wrap nodegit in git flow methods
```

You can initialize an instance of `nodegit-flow` or use its static methods
```javascript
var flow = nodegit.Flow.init(repo, config);

flow.startRelease('1.0.0'); // Use a flow instance to start a release
nodegit.Flow.startRelease(repo, '1.0.0'); // or the static equivalent
```

## Methods

* [Flow.finishFeature](#finishfeaturerepository-name-options)
* [Flow.finishHotfix](#finishhotfixrepository-name-options)
* [Flow.finishRelease](#finishreleaserepository-name-options)
* [Flow.getConfig](#getconfigrepository)
* [Flow.getConfigDefault](#getconfigdefault)
* [Flow.getConfigRequiredKeys](#getconfigrequiredkeysrepository)
* [Flow.getDevelopBranch](#getdevelopbranchrepository)
* [Flow.getFeaturePrefix](#getfeatureprefixrepository)
* [Flow.getHotfixPrefix](#gethotfixprefixrepository)
* [Flow.getMasterBranch](#getmasterbranchrepository)
* [Flow.getReleasePrefix](#getreleaseprefixrepository)
* [Flow.getSupportPrefix](#getsupportprefixrepository)
* [Flow.getVersionTagPrefix](#getversiontagprefixrepository)
* [Flow.init](#initrepository-config)
* [Flow.isInitialized](#isinitializedrepository)
* [Flow.open](#openrepository)
* [Flow.startFeature](#startfeaturerepository-name-options)
* [Flow.startHotfix](#starthotfixrepository-name)
* [Flow.startRelease](#startreleaserepository-name)
* [Flow.validateConfig](#validateconfigconfig)

### finishFeature(repository, name, [options])
By default `finishFeature` will merge the feature branch into the develop branch and delete the feature branch. If successful, finishFeature will resolve with the merge commit. If a merge conflict occurs `finishFeature` will reject with the index of the conflict.

`options` Object
 * `isRebase` Boolean default=`false`
 * `keepBranch` Boolean default=`false`

Example:
```javascript
NodeGit.Flow.finishFeature(
  repository,
  'my-feature'
)
  .then((mergeCommit) => {
    console.log(mergeCommit.id()); // => the sha of the newly created commit
  });
```

### finishHotfix(repository, name, [options])
By default `finishHotfix` will merge the hotfix branch into the develop branch and the master branch, create a tag at the merge commit on master, and delete the hotfix branch. If successful, finishHotfix will resolve with the merge commit on develop. If a merge conflict occurs `finishHotfix` will reject with the index of the conflict.

`options` Object
 * `keepBranch` Boolean default=`false`
 * `message` String tag annotation default=`''`

Example:
```javascript
NodeGit.Flow.finishHotfix(
  repository,
  'my-hotfix'
)
  .then((mergeCommit) => {
    console.log(mergeCommit.id()); // => the sha of the newly created commit
  });
```

### finishRelease(repository, name, [options])
By default `finishRelease` will merge the release branch into the develop branch and the master branch, create a tag the points to the merge commit on master, and delete the release branch. If successful, finishRelease will resolve with the merge commit. If a merge conflict occurs `finishRelease` will reject with the index of the conflict.

`options` Object
 * `isRebase` Boolean default=`false`
 * `keepBranch` Boolean default=`false`
 * `message` String tag annotation default=`''`

Example:
```javascript
NodeGit.Flow.finishRelease(
  repository,
  'my-release'
)
  .then((mergeCommit) => {
    console.log(mergeCommit.id()); // => the sha of the newly created commit
  });
```

### getConfig(repository)
Retrieves an object that contains the git config values that are relevant to git flow

### getConfigDefault()
Returns the following object which is the standard git flow config object
```javascript
{
  'gitflow.branch.master': 'master',
  'gitflow.branch.develop': 'develop',
  'gitflow.prefix.feature': 'feature/',
  'gitflow.prefix.release': 'release/',
  'gitflow.prefix.hotfix': 'hotfix/',
  'gitflow.prefix.versiontag': ''
}
```

### getConfigRequiredKeys()
Returns the config keys that are required to use `nodegit-flow`

### getDevelopBranch(repository)
Returns the value stored within a repos git config with the key of `gitflow.branch.develop`

### getHotfixPrefix(repository)
Returns the value stored within a repos git config with the key of `gitflow.prefix.hotfix`

### getMasterBranch(repository)
Returns the value stored within a repos git config with the key of `gitflow.branch.master`

### getFeaturePrefix(repository)
Returns the value stored within a repos git config with the key of `gitflow.prefix.feature`

### getReleasePrefix(repository)
Returns the value stored within a repos git config with the key of `gitflow.prefix.release`

### getSupportPrefix(repository)
Returns the value stored within a repos git config with the key of `gitflow.prefix.support`

### getVersionTagPrefix(repository)
Returns the value stored within a repos git config with the key of `gitflow.prefix.versiontag`

### init(repository, config)
Sets the git flow config values for the given repo and returns a new instance of `nodegit-flow`. This new instance contains all of the static methods within the `NodeGit.Flow` object but does not require a repository to be passed in when using its methods.

### isInitialized(repository)
Resolves to true or false depending on whether the repository has git flow initialized

Example:
```javascript
NodeGit.Flow.isInitialized(repository)
  .then((isInitialized) => {
    console.log(isInitialized); // => true or false depending the git config of the repo
  });
```

### open(repository)
Resolves to a new instance of `nodegit-flow` if the repository has git flow initialized, otherwise reject with the reason

Example:
```javascript
NodeGit.Flow.open(repository)
  .then((flow) => {
    return flow.getMasterBranch();
  })
  .then((masterBranchName) => {
    console.log(masterBranchName); // => master
  });
```

### startFeature(repository, name, [options])
`options` Object
 * `sha` String

 `options` is an object with a `sha` that marks the starting commit of the feature. If no `sha` is passed in, the feature will start at the `develop` branch.

 The name of the feature branch is the `featurePrefix` set in the git config appended with the passed in `name` parameter;

Example:
```javascript
NodeGit.Flow.startFeature(
  repository,
  'my-feature',
  {sha: 'a7b7a15c94df9528339fd86b9808ec2d9c645705'}
)
  .then((featureBranch) => {
    console.log(featureBranch.shorthand()); // => feautre/my-feature
  });
```

### startHotfix(repository, name)
The name of the hotfix branch is the `hotfixPrefix` set in the git config appended with the passed in `name` parameter;

Example:
```javascript
NodeGit.Flow.startHotfix(
  repository,
  '0.1.13'
)
  .then((hotfixBranch) => {
    console.log(hotfixBranch.shorthand()); // => hotfix/0.1.13
  });
```

### startRelease(repository, name [options])
`options` Object
 * `sha` String

 `options` is an object with a `sha` that marks the starting commit of the release. If no `sha` is passed in, the release will start at the `develop` branch.

The name of the release branch is the `releasePrefix` set in the git config appended with the passed in `name` parameter;

Example:
```javascript
NodeGit.Flow.startRelease(
  repository,
  '0.2.0'
)
  .then((releaseBranch) => {
    console.log(releaseBranch.shorthand()); // => release/0.2.0
  });
```

### validateConfig(config)
Validates that a config object has all of the required keys for nodegit-flow to work.

Example:
```javascript
const result = NodeGit.Flow.validateConfig({
  'gitflow.branch.master': 'master',
  'gitflow.branch.develop': 'develop',
  'gitflow.prefix.feature': 'feature/',
  'gitflow.prefix.hotfix': 'hotfix/'
});
console.log(result); // => gitflow config missing key(s): gitflow.prefix.release
```
