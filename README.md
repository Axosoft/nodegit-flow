# nodegit-flow

Adds gitflow methods to the [nodegit](https://github.com/nodegit/nodegit) module.

## Installation

```
npm install --save nodegit-flow
```

## Usage

`nodegit-flow` is a drop in replacement for `nodegit`. All methods in `nodegit` are included in `nodegit-flow`.

```javascript
var nodegit = require('nodegit-flow'); // wrap nodegit in gitflow
```

You can initialize an instance of `nodegit-flow` or use its static methods
```javascript
var flow = nodegit.Flow.init(repo, config);

flow.startRelease('1.0.0'); // Use a flow instance to start a release
nodegit.Flow.startRelease(repo, '1.0.0'); // or the static equivalent
```

## Methods

* Flow.finishFeature
* Flow.finishHotfix
* Flow.finishRelease
* Flow.getConfig
* Flow.getConfigDefault
* Flow.getConfigRequiredKeys
* Flow.getDevelopBranch
* Flow.getFeaturePrefix
* Flow.getHotfixPrefix
* Flow.getMasterBranch
* Flow.getReleasePrefix
* Flow.getSupportPrefix
* Flow.getVersionTagPrefix
* Flow.init
* Flow.isInitialized
* Flow.open
* Flow.startFeature
* Flow.startHotfix
* Flow.startRelease
* Flow.validateConfig
