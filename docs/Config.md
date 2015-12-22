<a name="Config"></a>
## Config
All of this class' functions are attached to `NodeGit.Flow` or a `Flow` instance object

**Kind**: global class  

* [Config](#Config)
    * _instance_
        * [.getConfig()](#Config+getConfig) ⇒ <code>Object</code>
        * [.getMasterBranch()](#Config+getMasterBranch) ⇒ <code>String</code>
        * [.getDevelopBranch()](#Config+getDevelopBranch) ⇒ <code>String</code>
        * [.getFeaturePrefix()](#Config+getFeaturePrefix) ⇒ <code>String</code>
        * [.getReleasePrefix()](#Config+getReleasePrefix) ⇒ <code>String</code>
        * [.getHotfixPrefix()](#Config+getHotfixPrefix) ⇒ <code>String</code>
        * [.getVersionTagPrefix()](#Config+getVersionTagPrefix) ⇒ <code>String</code>
    * _static_
        * [.getConfigDefault()](#Config.getConfigDefault) ⇒ <code>Object</code>
        * [.getConfigRequiredKeys()](#Config.getConfigRequiredKeys) ⇒ <code>Array</code>
        * [.validateConfig(config)](#Config.validateConfig) ⇒ <code>Number</code> &#124; <code>String</code>
        * [.getConfig(repo)](#Config.getConfig) ⇒ <code>Object</code>
        * [.getMasterBranch(The)](#Config.getMasterBranch) ⇒ <code>String</code>
        * [.getDevelopBranch(The)](#Config.getDevelopBranch) ⇒ <code>String</code>
        * [.getFeaturePrefix(The)](#Config.getFeaturePrefix) ⇒ <code>String</code>
        * [.getReleasePrefix(The)](#Config.getReleasePrefix) ⇒ <code>String</code>
        * [.getHotfixPrefix(The)](#Config.getHotfixPrefix) ⇒ <code>String</code>
        * [.getVersionTagPrefix(The)](#Config.getVersionTagPrefix) ⇒ <code>String</code>

<a name="Config+getConfig"></a>
### config.getConfig() ⇒ <code>Object</code>
Gets the git flow related config values for the repository

**Kind**: instance method of <code>[Config](#Config)</code>  
**Returns**: <code>Object</code> - An object of git flow config key/value pairs  
**Async**:   
<a name="Config+getMasterBranch"></a>
### config.getMasterBranch() ⇒ <code>String</code>
Gets the config value for the git flow master branch

**Kind**: instance method of <code>[Config](#Config)</code>  
**Returns**: <code>String</code> - The config value of the git flow master branch  
**Async**:   
<a name="Config+getDevelopBranch"></a>
### config.getDevelopBranch() ⇒ <code>String</code>
Gets the config value for the git flow develop branch

**Kind**: instance method of <code>[Config](#Config)</code>  
**Returns**: <code>String</code> - The config value of the git flow develop branch  
**Async**:   
<a name="Config+getFeaturePrefix"></a>
### config.getFeaturePrefix() ⇒ <code>String</code>
Gets the config value for the git flow feature prefix

**Kind**: instance method of <code>[Config](#Config)</code>  
**Returns**: <code>String</code> - The config value of the git flow feature prefix  
**Async**:   
<a name="Config+getReleasePrefix"></a>
### config.getReleasePrefix() ⇒ <code>String</code>
Gets the config value for the git flow release prefix

**Kind**: instance method of <code>[Config](#Config)</code>  
**Returns**: <code>String</code> - The config value of the git flow release prefix  
**Async**:   
<a name="Config+getHotfixPrefix"></a>
### config.getHotfixPrefix() ⇒ <code>String</code>
Gets the config value for the git flow hotfix prefix

**Kind**: instance method of <code>[Config](#Config)</code>  
**Returns**: <code>String</code> - The config value of the git flow hotfix prefix  
**Async**:   
<a name="Config+getVersionTagPrefix"></a>
### config.getVersionTagPrefix() ⇒ <code>String</code>
Gets the config value for the git flow version tag prefix

**Kind**: instance method of <code>[Config](#Config)</code>  
**Returns**: <code>String</code> - The config value of the git flow version tag prefix  
**Async**:   
<a name="Config.getConfigDefault"></a>
### Config.getConfigDefault() ⇒ <code>Object</code>
Get default git flow configuration values you can use for initializing. Note that the `initialize` function does
not use any values the user did not explicitly pass in.

**Kind**: static method of <code>[Config](#Config)</code>  
**Returns**: <code>Object</code> - An object of git flow config key/value pairs.  
<a name="Config.getConfigRequiredKeys"></a>
### Config.getConfigRequiredKeys() ⇒ <code>Array</code>
Get a list of git flow config keys that are required for initializing git flow

**Kind**: static method of <code>[Config](#Config)</code>  
**Returns**: <code>Array</code> - A list of config keys  
<a name="Config.validateConfig"></a>
### Config.validateConfig(config) ⇒ <code>Number</code> &#124; <code>String</code>
Checks a config object for all required git flow config keys.

**Kind**: static method of <code>[Config](#Config)</code>  
**Returns**: <code>Number</code> &#124; <code>String</code> - An error message, or 0 if all required keys are present.  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | An object of git flow config key/value pairs to check |

<a name="Config.getConfig"></a>
### Config.getConfig(repo) ⇒ <code>Object</code>
Gets the git flow related config values for the repository

**Kind**: static method of <code>[Config](#Config)</code>  
**Returns**: <code>Object</code> - An object of git flow config key/value pairs  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| repo | <code>Repository</code> | The nodegit repository to get the config values from |

<a name="Config.getMasterBranch"></a>
### Config.getMasterBranch(The) ⇒ <code>String</code>
Gets the config value for the git flow master branch

**Kind**: static method of <code>[Config](#Config)</code>  
**Returns**: <code>String</code> - The config value of the git flow master branch  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| The | <code>Repository</code> | nodegit repository to get the config value from |

<a name="Config.getDevelopBranch"></a>
### Config.getDevelopBranch(The) ⇒ <code>String</code>
Gets the config value for the git flow develop branch

**Kind**: static method of <code>[Config](#Config)</code>  
**Returns**: <code>String</code> - The config value of the git flow develop branch  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| The | <code>Repository</code> | nodegit repository to get the config value from |

<a name="Config.getFeaturePrefix"></a>
### Config.getFeaturePrefix(The) ⇒ <code>String</code>
Gets the config value for the git flow feature prefix

**Kind**: static method of <code>[Config](#Config)</code>  
**Returns**: <code>String</code> - The config value of the git flow feature prefix  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| The | <code>Repository</code> | nodegit repository to get the config value from |

<a name="Config.getReleasePrefix"></a>
### Config.getReleasePrefix(The) ⇒ <code>String</code>
Gets the config value for the git flow release prefix

**Kind**: static method of <code>[Config](#Config)</code>  
**Returns**: <code>String</code> - The config value of the git flow release prefix  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| The | <code>Repository</code> | nodegit repository to get the config value from |

<a name="Config.getHotfixPrefix"></a>
### Config.getHotfixPrefix(The) ⇒ <code>String</code>
Gets the config value for the git flow hotfix prefix

**Kind**: static method of <code>[Config](#Config)</code>  
**Returns**: <code>String</code> - The config value of the git flow hotfix prefix  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| The | <code>Repository</code> | nodegit repository to get the config value from |

<a name="Config.getVersionTagPrefix"></a>
### Config.getVersionTagPrefix(The) ⇒ <code>String</code>
Gets the config value for the git flow version tag prefix

**Kind**: static method of <code>[Config](#Config)</code>  
**Returns**: <code>String</code> - The config value of the git flow version tag prefix  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| The | <code>Repository</code> | nodegit repository to get the config value from |

