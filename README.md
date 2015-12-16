# nodegit-flow

Adds gitflow methods to the [nodegit](https://github.com/nodegit/nodegit) module.

## Installation

```
npm install --save nodegit-flow
```

## Usage

`nodegit-flow` is a drop in replacement for `nodegit`. All methods in `nodegit` are included in `nodegit-flow`.

```javascript
var nodegit = require('nodegit-flow'); // wrap nodegit in git flow methods
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
### finishHotfix(repository, name, [options])
### finishRelease(repository, name, [options])
### getConfig(repository)
### getConfigDefault()
### getConfigRequiredKeys(repository)
### getDevelopBranch(repository)
### getFeaturePrefix(repository)
### getHotfixPrefix(repository)
### getMasterBranch(repository)
### getReleasePrefix(repository)
### getSupportPrefix(repository)
### getVersionTagPrefix(repository)
### init(repository, config)
### isInitialized(repository)
### open(repository)
### startFeature(repository, name, [options])
### startHotfix(repository, name)
### startRelease(repository, name)
### validateConfig(config)
